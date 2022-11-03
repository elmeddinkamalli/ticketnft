import React, { Component } from "react";
import chains from "../../assets/data/chains.json";

export default class SwitchNetwork extends Component {
  async switchTo(chainId) {
    let chainIdHex = "0x" + parseInt(chainId).toString(16);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch ($e) {
      const chain = chains.find((chain) => {
        return +chain.chainId == +chainId;
      });
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: chain.rpc,
            blockExplorerUrls: [chain.explorers[0].url],
          },
        ],
      });
    }
  }

  render() {
    return (
      <div
        className="f-modal-alert"
        onClick={() => this.switchTo(process.env.REACT_APP_ETH_CHAIN_ID)}
      >
        <span className="alert-text">Switch network</span>
        <div className="f-modal-icon f-modal-warning scaleWarning">
          <span className="f-modal-body pulseWarningIns"></span>
          <span className="f-modal-dot pulseWarningIns"></span>
        </div>
      </div>
    );
  }
}
