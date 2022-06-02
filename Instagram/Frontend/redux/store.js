import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { FollowingReducer } from "./FollowingUser/Reducer";
import { User } from "./User/Reducer";

const Reducer = combineReducers({
  User: User,
  FollowingData: FollowingReducer,
});

export const store = createStore(Reducer, applyMiddleware(thunk));

// store.subscribe(() => {
//   console.log("store", store.getState().FollowingData.Feeds);
// });
