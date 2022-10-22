/* eslint-disable no-unused-expressions */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSelectorHook, useDispatch, useSelector } from "react-redux";
import $axios from "../../helpers/axios";
import { enableMetamask } from "../../helpers/web3";
import web3 from "web3";

export const connectToWallet = createAsyncThunk(
  "/user/connectToWallet",
  async (payload, { dispatch }) => {
    if (payload.isWalletConnect) {
      enabledWalletConnect();
    } else {
      const res = await enableMetamask();
      if (payload.needNonce) {
        dispatch(generateNonce({ walletAddresses: res }));
      }
      return res;
    }
  }
);

export const generateNonce = createAsyncThunk(
  "/user/generateNonce",
  async (payload, { dispatch }) => {
    if (payload.walletAddresses != null) {
      const res = await $axios.get(
        `/user/genrateNonce/${payload.walletAddresses[0]}`
      );
      dispatch(
        loginWithNonce({
          nonce: res.data.data.nonce,
        })
      );
      return res;
    }
    return null;
  }
);

export const loginWithNonce = createAsyncThunk(
  "/user/loginWithNonce",
  async (payload, { dispatch, getState }) => {
    const request = {
      method: "personal_sign",
      params: [
        web3.utils.utf8ToHex(payload.nonce),
        getState(userSlice).user.connectedAddress,
      ],
    };
    const signature = await ethereum.request(request);

    let params = {
      nonce: payload.nonce,
      signature: signature,
    };

    return await $axios.post("/user/login", params);
  }
);

export const getUserDetails = createAsyncThunk(
  "/user/getUserDetails",
  async (payload, { dispatch, getState }) => {
    await dispatch(
      connectToWallet({
        isWalletConnect: false,
        needNonce: false,
      })
    );
    return await $axios.get("user/userDetails");
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
        localStorage.setItem("connectedAddress", action.payload[0]);
      } else {
        state.connectedAddress = null;
      }
    });
    builder.addCase(generateNonce.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(loginWithNonce.fulfilled, (state, action) => {
      console.log(action.payload.data.data);
      localStorage.setItem("authToken", action.payload.data.data.token);
      state.user = action.payload.data.data.details;
    });
    builder.addCase(loginWithNonce.rejected, (state, action) => {
      localStorage.setItem("authToken", "");
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.user = action.payload.data.data;
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.user = null;
      localStorage.setItem("authToken", "");
    });
  },
});

export const connectedAddress = (state) => state.user.connectedAddress;
export const loggedUser = (state) => state.user.user;

export default userSlice.reducer;
