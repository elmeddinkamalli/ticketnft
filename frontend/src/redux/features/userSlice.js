/* eslint-disable no-unused-expressions */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createSelectorHook, useDispatch } from "react-redux";
import { enableMetamask } from "../../helpers/web3";

export const fetchUser = createAsyncThunk(
  "/user/getUser",
  async (payload, { dispatch, rejectWithValue }) => {
    return await userSlice
      .getInitialState()
      .instance.get("/api/user")
      .then(async (res) => {
        return await res.data;
      })
      .catch((err) => console.log(err));
  }
);

export const destroyUser = createAsyncThunk(
  "/user/destroyUser",
  async (payload, { dispatch }) => {
    return await userSlice
      .getInitialState()
      .instance.delete("/api/_web3/users/logout")
      .then(async (res) => {
        console.log("success");
        return await res.data;
      })
      .catch(console.log);
  }
);

export const connectToWallet = createAsyncThunk(
  "/user/connectToWallet",
  async (payload, { dispatch }) => {
    if (payload.isWalletConnect) {
      enabledWalletConnect();
    } else {
      return await enableMetamask();
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isWalletConnect: false,
    provider: null,
    connectedAddress: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connectToWallet.fulfilled, (state, action) => {
      if (action.payload) {
        state.connectedAddress = action.payload[0];
      } else {
        state.connectedAddress = null;
      }
    });
  },
});

export const connectedAddress = (state) => state.user.connectedAddress;

export default userSlice.reducer;
