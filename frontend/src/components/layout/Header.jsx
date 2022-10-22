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

  connectButtons() {
    if (this.props.connectedAddress && this.props.user) {
      return this.props.connectedAddress;
    } else if (this.props.connectedAddress == null && this.props.user) {
      return (
        <Button
          variant="outline-info"
          onClick={() => this.props.connectToWallet(false)}
        >
          Connect wallet
        </Button>
      );
    } else if (this.props.user == null && this.props.connectedAddress) {
      return (
        <Button
          variant="outline-info"
          onClick={() => this.props.connectToWallet(true)}
        >
          Login
        </Button>
      );
    } else {
      return (
        <Button variant="outline-info" onClick={this.toggleLoginModal}>
          Connect and login
        </Button>
      );
    }
  }

  render() {
    return (
      <>
        <header className="bg-dark d-flex justify-content-between text-white align-items-center p-3">
          <h5>TicketNFT</h5>
          {this.connectButtons()}
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
    connectedAddress: state.user.connectedAddress,
    user: state.user.user,
  };
};

const mapDipatchToProps = (dispatch) => {
  return {
    connectToWallet: (login) =>
      dispatch(
        connectToWallet({
          isWalletConnect: false,
          needNonce: login,
        })
      ),
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Header);
