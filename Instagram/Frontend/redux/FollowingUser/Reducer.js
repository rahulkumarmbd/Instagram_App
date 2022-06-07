import { auth } from "../../firebase/config";
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
  UsersFollowingCount: 0,
  Stories: [],
};

let a = [];

const getCount = (userId, prevValue) => {
  if (a.includes(userId) || auth.currentUser.uid === userId) {
    return prevValue;
  } else {
    a.push(userId);
    return prevValue + 1;
  }
};

const removeCount = (userId, prevValue) => {
  a = a.filter((ele) => ele !== userId);
  return prevValue - 1;
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
        Feeds: [...state.Feeds, ...payload.posts],
        UsersFollowingCount: getCount(payload.id, state.UsersFollowingCount),
      };
    case UPDATE_FOLLOWING_USERS_ON_UNFOLLOW:
      return {
        Stories: [
          ...state.Stories.filter((story) => {
            return story.id !== payload;
          }),
        ],
        Users: [
          ...state.Users.filter((user) => {
            return user.id !== payload;
          }),
        ],
        Feeds: [...state.Feeds.filter((feed) => feed.user.id !== payload)],
        UsersFollowingCount: removeCount(payload, state.UsersFollowingCount),
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
