import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { CURRENT_USER } from "./ActionTypes";

const helper = (type, payload) => ({ type, payload });

export const Add_User = (payload) => helper(CURRENT_USER, payload);

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
