const onChainChange = () => {
  window.ethereum.on("chainChanged", (chainId) => {
    localStorage.setItem("chainId", parseInt(chainId, 16));
    window.location.reload();
  });
};

const onAccountChange = () => {
  window.ethereum.on("accountsChanged", (accounts) => {
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
  currentChainId = await getCurrentChainId();
})();

const isValidChainId = (chainId) => {
  let compareWith = currentChainId;
  if (chainId) {
    compareWith = chainId;
  }
  return [
    +process.env.REACT_APP_ETH_CHAIN_ID,
    +process.env.REACT_APP_BNB_CHAIN_ID,
    +process.env.REACT_APP_MATIC_CHAIN_ID,
    +process.env.REACT_APP_FTM_CHAIN_ID,
  ].includes(+compareWith);
};

const isCurrentChain = (chainId) => {
  return currentChainId == chainId;
};

export {
  enableMetamask,
  getCurrentChainId,
  currentChainId,
  isValidChainId,
  isCurrentChain,
};
