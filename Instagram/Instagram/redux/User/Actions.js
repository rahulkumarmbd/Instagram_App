import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Fetch_Following_User } from "../FollowingUser/Actions";
import {
  ADD_POSTS,
  ADD_USER_FOLLOWINGS,
  CLEAR_USER,
  CURRENT_USER,
} from "./ActionTypes";

const helper = (type, payload) => ({ type, payload });

export const Add_User = (payload) => helper(CURRENT_USER, payload);
export const Add_Posts = (payload) => helper(ADD_POSTS, payload);
export const Add_User_Followings = (payload) =>
  helper(ADD_USER_FOLLOWINGS, payload);

export const Clear_User = () => helper(CLEAR_USER, null);

export const Fetch_Current_User = (userId) => (dispatch) => {
  const docRef = doc(db, "users", userId);
  getDoc(docRef)
    .then((res) => {
      dispatch(Add_User(res.data()));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const Fetch_Current_User_Posts = (userId) => (dispatch) => {
  onSnapshot(
    query(
      collection(db, `posts/${userId}/userPosts`),
      orderBy("timestamp", "desc")
    ),
    (res) => {
      const data = res.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      dispatch(Add_Posts(data.sort((a, b) => b.timestamp - a.timestamp)));
    }
  );
};

export const Fetch_Current_User_Following = (userId) => (dispatch) => {
  onSnapshot(collection(db, `following/${userId}/userFollowing`), (res) => {
    const ids = res.docs.map((doc) => {
      return doc.id;
    });
    dispatch(Add_User_Followings(ids));
    ids.forEach((id) => {
      dispatch(Fetch_Following_User(id,true));
    });
  });
};
