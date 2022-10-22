import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer, { fetchUser } from "./features/userSlice";
import thunk from "redux-thunk";
import web3Slice, { getChainId, setWeb3 } from "./features/web3Slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    web3: web3Slice,
  },
  middleware: [thunk],
});

const initialThunks = async (dispatch, getState) => {
  await dispatch(getChainId());
  await dispatch(setWeb3());
};

store.dispatch(initialThunks);

export default store;
