const enableMetamask = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const resp = await getAddresses();
  return resp;
};

const getAddresses = async () => {
  return await window.ethereum.request({ method: "eth_accounts" });
};

export { enableMetamask };
