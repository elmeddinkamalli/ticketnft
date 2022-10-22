import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { connectToWallet, logout } from "../../redux/features/userSlice";
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
      return (
        <>
          <span>{this.props.connectedAddress.substring(0, 5) + "..."}</span>
          <Button
            variant="outline-info nowrap ml-3"
            onClick={() => this.props.logout()}
          >
            Log out
          </Button>
        </>
      );
    } else if (this.props.connectedAddress == null && this.props.user) {
      return (
        <>
          <Button
            variant="outline-info nowrap"
            onClick={() => this.props.connectToWallet(false)}
          >
            Connect wallet
          </Button>
        </>
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
        <Button variant="outline-info nowrap" onClick={this.toggleLoginModal}>
          Connect and login
        </Button>
      );
    }
  }

  render() {
    return (
      <>
        <header className="header d-flex justify-content-between align-items-center p-3 border-bottom text-white px-5">
          <div className="header-logo d-flex align-items-center container p-0 m-0">
            <img src="static/logo-header-2.png" alt="logo" />
            <span>TicketNFT</span>
          </div>
          <div className="align-items-center d-flex">
            {this.connectButtons()}
          </div>
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
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Header);
