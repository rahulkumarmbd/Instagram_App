import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { AuthReducer } from "./Auth/Reducer";

const reducer = combineReducers({
  Auth: AuthReducer,
});


export const store = createStore(reducer,applyMiddleware(thunk));

// store.subscribe(() => {
//     console.log(store.getState());
// })