import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { ADD_POSTS, CURRENT_USER } from "./ActionTypes";

const helper = (type, payload) => ({ type, payload });

export const Add_User = (payload) => helper(CURRENT_USER, payload);
export const Add_Posts = (payload) => helper(ADD_POSTS, payload);

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
  getDocs(collection(db, `posts/${userId}/userPosts`))
    .then((res) => {
      const data = res.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      dispatch(Add_Posts(data));
    })
    .catch((err) => {
      console.log(err);
    });
};
