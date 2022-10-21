import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { connectToWallet } from "../../redux/features/userSlice";
import LoginModal from "../page-contents/LoginModal";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginModalActive: false,
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState, this.props, this.state);
  }

  toggleLoginModal() {
    this.setState({
      isLoginModalActive: !this.state.isLoginModalActive,
    });
  }
  render() {
    return (
      <>
        <header className="bg-dark d-flex justify-content-between text-white align-items-center p-3">
          <h5>TicketNFT</h5>
          {this.state.connectedAddress ? (
            this.state.connectedAddress
          ) : (
            <Button variant="outline-info" onClick={this.toggleLoginModal}>
              Connect wallet
            </Button>
          )}
        </header>
        <LoginModal
          isLoginModalActive={this.state.isLoginModalActive}
          toggleLoginModal={this.toggleLoginModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    connectedAddress: state.connectedAddress,
  };
};

export default connect(mapStateToProps, null)(Header);
