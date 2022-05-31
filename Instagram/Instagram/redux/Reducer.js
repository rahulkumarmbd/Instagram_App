import { ADD_POSTS, CURRENT_USER } from "./ActionTypes";

const initialState = {
  CurrentUser: "",
};

export const Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CURRENT_USER:
      return { ...state, CurrentUser: payload };
    case ADD_POSTS:
      return { ...state, posts: payload };
    default:
      return state;
  }
};
