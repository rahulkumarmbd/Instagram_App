import {
  ADD_FOLLOWING_USER_DATA,
  ADD_FOLLOWING_USER_STORIES,
  CLEAR_USERS,
  CURRENT_USER_POST_LIKES,
  UPDATE_FOLLOWING_USERS_COUNT,
  UPDATE_FOLLOWING_USERS_ON_UNFOLLOW,
  UPDATE_FOLLOWING_USER_STORIES,
} from "./ActionTypes";

const initialState = {
  Users: [],
  Feeds: [],
  UsersFollowingCount: -1,
  Stories: [],
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
    case ADD_FOLLOWING_USER_STORIES:
      return { ...state, Stories: [...state.Stories, payload] };
    case UPDATE_FOLLOWING_USER_STORIES:
      return {
        ...state,
        Stories: [
          ...state.Stories.map((story) => {
            if (story.id === payload.id) {
              return payload;
            }
            return story;
          }),
        ],
      };
    default:
      return state;
  }
};
