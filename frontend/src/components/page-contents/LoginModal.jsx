import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
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
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button
            className="btn btn-outline-info"
            onClick={() =>
              this.props.connectToWallet({
                isWalletConnect: false,
                needNonce: true,
              })
            }
          >
            Login
          </button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleLoginModal}>
            Close
          </Button>
          <Button variant="primary" onClick={this.props.toggleLoginModal}>
            Save Changes
          </Button>
        </Modal.Footer>
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
