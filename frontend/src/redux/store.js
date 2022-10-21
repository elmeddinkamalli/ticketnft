import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer, { fetchUser } from "./features/userSlice";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: [thunk],
});

// const initialThunks = async (dispatch, getState) => {
//   await dispatch(fetchUser());
// };

// store.dispatch(initialThunks);

export default store;
