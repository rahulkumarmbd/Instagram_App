import {
  ADD_FOLLOWING_USER_DATA,
  CLEAR_USERS,
  UPDATE_FOLLOWING_USERS_COUNT,
  UPDATE_FOLLOWING_USERS_ON_UNFOLLOW,
} from "./ActionTypes";

const initialState = {
  Users: [],
  UsersFollowingCount: 0,
};

export const FollowingReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_FOLLOWING_USER_DATA:
      return {
        ...state,
        Users: [...state.Users, payload],
      };
    case UPDATE_FOLLOWING_USERS_COUNT:
      return {
        Users: [
          ...state.Users.map((user) => {
            if (user.id === payload.id) {
              return { ...user, posts: payload.posts };
            }
            return user;
          }),
        ],
        UsersFollowingCount: state.UsersFollowingCount + 1,
      };
    case UPDATE_FOLLOWING_USERS_ON_UNFOLLOW:
      return {
        Users: [...state.Users.filter((user) => user.id !== payload)],
        UsersFollowingCount: state.UsersFollowingCount - 1,
      };
    case CLEAR_USERS:
      return initialState;
    default:
      return state;
  }
};
