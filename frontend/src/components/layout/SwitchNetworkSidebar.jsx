import React, { Component } from "react";
import { CloseButton } from "react-bootstrap";
import { connect } from "react-redux";
import LeftICO from "../../assets/static/left.svg";
import { toggleSwitchSidebar } from "../../redux/features/web3Slice";
import chains from "../../assets/data/chains.json";
import { isCurrentChain } from "../../helpers/web3";

class SwitchNetworkSidebar extends Component {
  constructor(props) {
    super(props);
  }

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
        className={`siwtch-network-sidebar ${
          this.props.isSwitchNetworkSidebarActive ? "active" : ""
        }`}
      >
        <div
          className="grayed-bg"
          onClick={this.props.toggleSwitchSidebar}
        ></div>
        <div className="siwtch-network-sidebar-wrapper d-flex align-items-center justify-content-center">
          <CloseButton
            variant="white"
            className="close-btn"
            onClick={this.props.toggleSwitchSidebar}
          />
          <div className="toggler" onClick={this.props.toggleSwitchSidebar}>
            <img src={LeftICO} />
          </div>
          <div className="available-chains">
            <h5>Available networks</h5>
            <ul className="p-0">
              <li
                className={`my-2 p-1 cursor-pointer ${
                  isCurrentChain(process.env.REACT_APP_ETH_CHAIN_ID)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  this.switchTo(process.env.REACT_APP_ETH_CHAIN_ID)
                }
              >
                <img
                  className="mr-3"
                  src="/static/ethereum.png"
                  alt="ethereum"
                />
                <span>Ethereum</span>
              </li>
              <li
                className={`my-2 p-1 cursor-pointer ${
                  isCurrentChain(process.env.REACT_APP_BNB_MAINNET_CHAIN_ID)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  this.switchTo(process.env.REACT_APP_BNB_MAINNET_CHAIN_ID)
                }
              >
                <img className="mr-3" src="/static/binance.png" alt="binance" />
                <span>Binance Mainnet</span>
              </li>
              <li
                className={`my-2 p-1 cursor-pointer ${
                  isCurrentChain(process.env.REACT_APP_BNB_CHAIN_ID)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  this.switchTo(process.env.REACT_APP_BNB_CHAIN_ID)
                }
              >
                <img className="mr-3" src="/static/binance.png" alt="binance" />
                <span>Binance Testnet</span>
              </li>
              <li
                className={`my-2 p-1 cursor-pointer ${
                  isCurrentChain(process.env.REACT_APP_MATIC_CHAIN_ID)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  this.switchTo(process.env.REACT_APP_MATIC_CHAIN_ID)
                }
              >
                <img className="mr-3" src="/static/polygon.png" alt="polygon" />
                <span>Polygon</span>
              </li>
              <li
                className={`my-2 p-1 cursor-pointer ${
                  isCurrentChain(process.env.REACT_APP_FTM_CHAIN_ID)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  this.switchTo(process.env.REACT_APP_FTM_CHAIN_ID)
                }
              >
                <img className="mr-3" src="/static/fantom.png" alt="fantom" />
                <span>Fantom</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    connectedAddress: state.user.connectedAddress,
    user: state.user.user,
    isSwitchNetworkSidebarActive: state.web3.isSwitchNetworkSidebarActive,
  };
};

const mapDipatchToProps = (dispatch) => {
  return {
    toggleSwitchSidebar: () => dispatch(toggleSwitchSidebar()),
  };
};

export default connect(
  mapStateToProps,
  mapDipatchToProps
)(SwitchNetworkSidebar);
