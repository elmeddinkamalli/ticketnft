import React, { Component } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";

export default class InfoMessage extends Component {
  constructor() {
    super();
    this.state = {
      message: localStorage.getItem("infoMessage"),
      show: true,
    };
  }

  render() {
    return (
      <Modal
        className="info-message-popup"
        show={this.state.show}
        onExiting={() => {
          localStorage.removeItem("infoMessage");
          localStorage.removeItem("hasInfoMessage");
        }}
        onHide={() => {
          this.setState({
            show: false,
          });
        }}
      >
        <Modal.Header className="border-0">
          <Modal.Title>Info message</Modal.Title>
          <CloseButton
            variant="white"
            onClick={() => {
              this.setState({
                show: false,
              });
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <p>{this.state.message}</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="primary"
            onClick={() => {
              this.setState({
                show: false,
              });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
