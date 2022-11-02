import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { currentChainId } from "./web3";

const $axios = axios.create({
  headers: {
    "x-auth-token": localStorage.getItem("authToken"),
    chainId: currentChainId ?? localStorage.getItem("chainId"),
  },
  "content-type": "application/json",
  baseURL: process.env.REACT_APP_BASE_API_URL,
});

$axios.interceptors.response.use(
  (response) => {
    if (response.status === 201) {
      toast.success(response.data.message);
    } else if (response.config.method === "put") {
      toast.success("Updated Successfully!");
    }
    return response;
  },
  (error) => {
    if (
      error.response.status === 400 ||
      error.response.status === 401 ||
      error.response.status === 403
    ) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } else {
      toast.error("Something went wrong");
    }

    throw error;
  }
);

export default $axios;
