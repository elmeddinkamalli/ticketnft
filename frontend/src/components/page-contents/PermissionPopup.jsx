import React, { Component } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { connectToWallet } from "../../redux/features/userSlice";

class PermissionPopup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        show={this.props.active}
        onHide={this.props.toggle}
        className="permission-popup"
      >
        <Modal.Header className="border-0">
          <Modal.Title>Are you sure?</Modal.Title>
          <CloseButton variant="white" onClick={this.props.toggle} />
        </Modal.Header>
        <Modal.Body>
          <p>
            Burning your ticket means that it will be irreversibly destroyed.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="danger" onClick={this.props.handleSubmit}>
            Continue
          </Button>
          <Button variant="primary" onClick={this.props.toggle}>
            Close
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

export default connect(mapStateToProps, mapDipatchToProps)(PermissionPopup);
