import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import {
  ADD_FOLLOWING_USER_DATA,
  CLEAR_USERS,
  CURRENT_USER_POST_LIKES,
  UPDATE_FOLLOWING_USERS_COUNT,
  UPDATE_FOLLOWING_USERS_ON_UNFOLLOW,
} from "./ActionTypes";

const helper = (type, payload) => ({ type, payload });

const Add_Following_User = (payload) =>
  helper(ADD_FOLLOWING_USER_DATA, payload);

const Update_Following_User_Count = (payload) =>
  helper(UPDATE_FOLLOWING_USERS_COUNT, payload);

export const Update_Following_Users_On_Unfollow = (payload) =>
  helper(UPDATE_FOLLOWING_USERS_ON_UNFOLLOW, payload);

export const Clear_Users = () => helper(CLEAR_USERS, null);

const Current_User_Post_Liskes = (payload) =>
  helper(CURRENT_USER_POST_LIKES, payload);

export const Fetch_Following_User =
  (id, getPosts, Users) => (dispatch, getState) => {
    const found = getState().FollowingData.Users.some((ele) => ele.id === id);
    if (!found) {
      const docRef = doc(db, "users", id);
      getDoc(docRef)
        .then((res) => {
          const user = res.data();
          const found = getState().FollowingData.Users.some(
            (ele) => ele.id === user.id
          );
          if (!found) {
            if (Users) {
              Users.push(user);
            }
            dispatch(Add_Following_User(user));
            if (getPosts) {
              dispatch(Fetch_Following_User_Posts(id));
            }
            // console.log("User added", user,getPosts);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

const Fetch_Following_User_Posts = (id) => (dispatch, getState) => {
  onSnapshot(collection(db, `posts/${id}/userPosts`), (res) => {
    const id = res.docs[0]?.ref.path.split("/")[1] || res._snapshot.query.path.segments[1];
    const user = getState().FollowingData.Users.find((ele) => ele.id === id);
    const posts = res.docs.map((doc) => {
      return { ...doc.data(), id: doc.id, user };
    });

    posts.forEach((post) => {
      dispatch(Fetch_Following_User_Post_Likes(id, post.id));
    });

    dispatch(Update_Following_User_Count(posts));
  });
};

const Fetch_Following_User_Post_Likes =
  (userId, postId) => (dispatch) => {
    onSnapshot(
      doc(
        db,
        `posts/${userId}/userPosts/${postId}/likes/${auth.currentUser.uid}`
      ),
      (res) => {
        const postId = res.ref._key.path.segments[3];
        let CurrentUserLike = false;
        if (res.exists()) {
          CurrentUserLike = true;
        }
        dispatch(Current_User_Post_Liskes({ postId, CurrentUserLike }));
      }
    );
  };
