import { ADD_POSTS, ADD_USER_FOLLOWINGS, CLEAR_USER, CURRENT_USER } from "./ActionTypes";

const initialState = {
  CurrentUser: "",
  posts: [],
  followings: [],
};

export const User = (state = initialState, { type, payload }) => {
  switch (type) {
    case CURRENT_USER:
      return { ...state, CurrentUser: payload };
    case ADD_POSTS:
      return { ...state, posts: payload };
    case ADD_USER_FOLLOWINGS:
      return { ...state, followings: payload };
    case CLEAR_USER:
      return initialState;
    default:
      return state;
  }
};
