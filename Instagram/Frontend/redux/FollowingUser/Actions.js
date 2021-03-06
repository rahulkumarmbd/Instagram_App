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
  ADD_FOLLOWING_USER_STORIES,
  CLEAR_USERS,
  CURRENT_USER_POST_LIKES,
  UPDATE_FOLLOWING_USERS_COUNT,
  UPDATE_FOLLOWING_USERS_ON_UNFOLLOW,
  UPDATE_FOLLOWING_USER_STORIES,
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

const Add_Following_User_Stories = (payload) =>
  helper(ADD_FOLLOWING_USER_STORIES, payload);

const Update_Following_User_Stories = (payload) =>
  helper(UPDATE_FOLLOWING_USER_STORIES, payload);

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
              dispatch(Fetch_Following_User_Stories(id));
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
    const id =
      res.docs[0]?.ref.path.split("/")[1] ||
      res._snapshot.query.path.segments[1];
    const user = getState().FollowingData.Users.find((ele) => ele.id === id);
    let posts = res.docs.map((doc) => {
      return { ...doc.data(), id: doc.id, user };
    });

    posts = posts.filter((post) => {
      if (getState().FollowingData.Feeds.find((ele) => ele.id === post.id)) {
        return false;
      }
      return true;
    });

    posts.forEach((post) => {
      dispatch(Fetch_Following_User_Post_Likes(id, post.id));
    });

    dispatch(Update_Following_User_Count({ id, posts }));
  });
};

const Fetch_Following_User_Post_Likes = (userId, postId) => (dispatch) => {
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

export const Fetch_Following_User_Stories = (id) => (dispatch, getState) => {
  onSnapshot(collection(db, `stories/${id}/userStories`), (res) => {
    const id =
      res.docs[0]?.ref.path.split("/")[1] ||
      res._snapshot.query.path.segments[1];
    const stories = res.docs.map((doc) => {
      return doc.data();
    });
    const userStory = getState().FollowingData.Stories.find(
      (ele) => ele.id === id
    );

    if (!userStory && stories.length > 0) {
      dispatch(Add_Following_User_Stories({ id, stories }));
    } else if (stories.length > 0) {
      dispatch(Update_Following_User_Stories({ id, stories }));
    }
  });
};
