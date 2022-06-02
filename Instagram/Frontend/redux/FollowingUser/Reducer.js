import {
  ADD_FOLLOWING_USER_DATA,
  CLEAR_USERS,
  CURRENT_USER_POST_LIKES,
  UPDATE_FOLLOWING_USERS_COUNT,
  UPDATE_FOLLOWING_USERS_ON_UNFOLLOW,
} from "./ActionTypes";

const initialState = {
  Users: [],
  Feeds: [],
  UsersFollowingCount: -1,
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
        ...state,
        Feeds: [...state.Feeds, ...payload],
        UsersFollowingCount: state.UsersFollowingCount + 1,
      };
    case UPDATE_FOLLOWING_USERS_ON_UNFOLLOW:
      return {
        ...state,
        Feeds: [...state.Feeds.filter((feed) => feed.id !== payload)],
        UsersFollowingCount: state.UsersFollowingCount - 1,
      };
    case CURRENT_USER_POST_LIKES:
      return {
        ...state,
        Feeds: [
          ...state.Feeds.map((feed) => {
            if (feed.id === payload.postId) {
              return { ...feed, CurrentUserLike: payload.CurrentUserLike };
            }
            return feed;
          }),
        ],
      };
    case CLEAR_USERS:
      return initialState;
    default:
      return state;
  }
};
