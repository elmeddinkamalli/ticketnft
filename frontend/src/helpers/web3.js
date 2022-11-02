const onChainChange = () => {
  window.ethereum.on("chainChanged", (chainId) => {
    localStorage.setItem("chainId", parseInt(chainId, 16));
    window.location.reload();
  });
};

const onAccountChange = () => {
  window.ethereum.on("accountsChanged", (accounts) => {
    console.log(accounts);
    if (accounts) {
      localStorage.removeItem("authToken");
      window.location.reload();
    }
  });
};

const enableMetamask = async (requestToGetAccounts = true) => {
  if (requestToGetAccounts) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
  const resp = await getAddresses();
  return resp;
};

const getAddresses = async () => {
  return await window.ethereum.request({ method: "eth_accounts" });
};

const getCurrentChainId = async () => {
  if (window.ethereum) {
    onChainChange();
    onAccountChange();
    if (window.ethereum.networkVersion) {
      return await window.ethereum.networkVersion;
    } else {
      await enableMetamask(false);
      return await window.ethereum.networkVersion;
    }
  }
};

let currentChainId;
(async function () {
  console.log(await getCurrentChainId());
  currentChainId = await getCurrentChainId();
})();

export { enableMetamask, getCurrentChainId, currentChainId };
