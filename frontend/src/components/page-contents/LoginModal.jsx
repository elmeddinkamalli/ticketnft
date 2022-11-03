import React, { Component } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { connectToWallet } from "../../redux/features/userSlice";

class LoginModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        show={this.props.isLoginModalActive}
        onHide={this.props.toggleLoginModal}
        className="login-modal"
      >
        <Modal.Header className="border-0">
          <Modal.Title>Available wallets</Modal.Title>
          <CloseButton variant="white" onClick={this.props.toggleLoginModal} />
        </Modal.Header>
        <Modal.Body className="pb-4">
          <button
            className="btn btn-outline-info w-100 text-left"
            onClick={() => {
              this.props.connectToWallet({
                isWalletConnect: false,
                needNonce: true,
              });
              this.props.toggleLoginModal();
            }}
          >
            <img
              src="/static/metamask-sm.png"
              alt="metamask"
              className="mr-3"
            />
            <span>Metamask</span>
          </button>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapDipatchToProps = (dispatch) => {
  return {
    connectToWallet: (payload) => dispatch(connectToWallet(payload)),
  };
};

const mapStateToProps = (state) => {
  return {
    connectedAddress: state.connectedAddress,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(LoginModal);
