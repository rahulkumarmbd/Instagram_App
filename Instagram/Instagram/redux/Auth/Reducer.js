import { CURRENT_USER } from "./ActionTypes";

const initialState = {
  CurrentUser: "",
};

export const AuthReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CURRENT_USER:
      return { ...state, CurrentUser: payload };
    default:
      return state;
  }
};
