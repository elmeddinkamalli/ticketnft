/* eslint-disable no-unused-expressions */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSelectorHook, useDispatch, useSelector } from "react-redux";
import $axios from "../../helpers/axios";
import { enableMetamask } from "../../helpers/web3";
import web3 from "web3";

export const connectToWallet = createAsyncThunk(
  "/user/connectToWallet",
  async (payload, { dispatch }) => {
    dispatch(userSlice.actions.setLoading());
    if (payload.isWalletConnect) {
      enabledWalletConnect();
    } else {
      const res = await enableMetamask(payload.requestToGetAccounts);
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
    dispatch(userSlice.actions.setLoading());
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
    dispatch(userSlice.actions.setLoading());
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
    dispatch(userSlice.actions.setLoading());
    await dispatch(
      connectToWallet({
        isWalletConnect: false,
        needNonce: false,
        requestToGetAccounts: payload.requestToGetAccounts,
      })
    );
    if (localStorage.getItem("authToken")) {
      return await $axios.get("user/userDetails");
    }
    return false;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isWalletConnect: false,
    provider: null,
    connectedAddress: null,
    loading: true,
  },
  reducers: {
    logout: () => {
      localStorage.clear();
      window.location.reload();
    },
    setLoading: (state, payload) => {
      state.loading = payload.payload ?? true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectToWallet.fulfilled, (state, action) => {
      if (action.payload) {
        state.connectedAddress = action.payload[0];
        localStorage.setItem("connectedAddress", action.payload[0]);
      } else {
        state.connectedAddress = null;
      }
      state.loading = false;
    });
    builder.addCase(connectToWallet.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(generateNonce.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(generateNonce.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(loginWithNonce.fulfilled, (state, action) => {
      localStorage.setItem("authToken", action.payload.data.data.token);
      state.user = action.payload.data.data.details;
      state.loading = false;
    });
    builder.addCase(loginWithNonce.rejected, (state, action) => {
      localStorage.setItem("authToken", "");
      state.loading = false;
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.user = action.payload ? action.payload.data.data : null;
      state.loading = false;
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.user = null;
      localStorage.setItem("authToken", "");
      state.loading = false;
    });
  },
});

export const { logout, setLoading } = userSlice.actions;
export const connectedAddress = (state) => state.user.connectedAddress;
export const loggedUser = (state) => state.user.user;
export const loadingEffect = (state) => state.user.loading;

export default userSlice.reducer;
