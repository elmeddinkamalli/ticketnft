/* eslint-disable no-unused-expressions */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSelectorHook, useDispatch, useSelector } from "react-redux";
import $axios from "../../helpers/axios";
import { enableMetamask } from "../../helpers/web3";
import { ethers } from "ethers";
import ticketnftAbi from "../../contracts/ticketnft.json";
import userSlice from "./userSlice";

export const getChainId = createAsyncThunk(
  "/web3/getChainId",
  async (payload, { dispatch }) => {
    if (window.ethereum) {
      if (window.ethereum.networkVersion) {
        return await window.ethereum.networkVersion;
      } else {
        await enableMetamask(false);
        return await window.ethereum.networkVersion;
      }
    }
    return null;
  }
);

export const setWeb3 = createAsyncThunk(
  "/web3/setWeb3",
  async (payload, { dispatch, getState }) => {
    let web3Object = {
      web3: null,
      web3ForQuery: null,
    };
    if (window.ethereum) {
      if (!window.ethereum.networkVersion) {
        await enableMetamask(false);
      }
      web3Object.web3 = new ethers.providers.Web3Provider(window.ethereum);
      web3Object.web3ForQuery = new ethers.Contract(
        process.env.REACT_APP_ETH_CONTRACT_ADDRESS,
        ticketnftAbi,
        web3Object.web3.getSigner()
      );
    }
    return web3Object;
  }
);

export const web3Slice = createSlice({
  name: "web3",
  initialState: {
    web3: null,
    web3ForQuery: null,
    chainId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChainId.fulfilled, (state, action) => {
      state.chainId = action.payload;
    });
    builder.addCase(setWeb3.fulfilled, (state, action) => {
      console.log(action.payload);
      state.web3 = action.payload.web3;
      state.web3ForQuery = action.payload.web3ForQuery;
    });
    builder.addCase(setWeb3.rejected, (state, action) => {
      console.log(action);
    });
  },
});

export const { isValidChainId } = web3Slice.actions;

export default web3Slice.reducer;
