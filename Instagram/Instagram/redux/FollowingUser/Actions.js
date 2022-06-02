import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  ADD_FOLLOWING_USER_DATA,
  CLEAR_USERS,
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

export const Fetch_Following_User = (uid) => (dispatch, getState) => {
  const found = getState().FollowingData.Users.some((ele) => ele.id === uid);
  console.log(found);
  if (!found) {
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((res) => {
        const user = res.data();
        dispatch(Add_Following_User(user));
        dispatch(Fetch_Following_User_Posts(user.id));
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const Fetch_Following_User_Posts = (uid) => (dispatch, getState) => {
  onSnapshot(collection(db, `posts/${uid}/userPosts`), (res) => {
    const id = res.docs[0].ref.path.split("/")[1];
    const user = getState().FollowingData.Users.find((ele) => ele.id === id);
    const posts = res.docs.map((doc) => {
      return { ...doc.data(), id: doc.id, user };
    });
    dispatch(Update_Following_User_Count({ posts, id }));
  });
};
