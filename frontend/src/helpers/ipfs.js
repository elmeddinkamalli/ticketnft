const axios = require("axios");
const FormData = require("form-data");

const baseURL = "https://api.pinata.cloud/";
const fetch = axios.create({
  baseURL: baseURL,
});
const ipfs = {};

ipfs.add = async (file, progress) => {
  let data = new FormData();
  data.append("file", file, file.name);
  const r = await fetch.post("/pinning/pinFileToIPFS", data, {
    maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: process.env.REACT_APP_PINATA_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
    },
    onUploadProgress: (e) => {
      progress.progress(e.loaded);
    },
  });
  return { path: r["data"]["IpfsHash"] };
};

ipfs.pinJson = async (JSONBody) => {
  const r = await fetch.post("/pinning/pinJSONToIPFS", JSONBody, {
    headers: {
      pinata_api_key: process.env.REACT_APP_PINATA_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
    },
  });
  return r["data"]["IpfsHash"];
};

export default ipfs;
