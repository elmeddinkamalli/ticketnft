import React, { Component } from "react";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { connectToWallet, logout } from "../../redux/features/userSlice";
import LoginModal from "../page-contents/LoginModal";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginModalActive: false,
      bg: "transparent",
    };
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    const _this = this;
    document.addEventListener("scroll", function () {
      let scrollPos = window.pageYOffset;
      if (scrollPos > 100) {
        _this.setState({
          bg: "dark",
        });
      } else {
        _this.setState({
          bg: "transparent",
        });
      }
    });
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
          <NavDropdown
            title={this.props.connectedAddress.substring(0, 5) + "..."}
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href={`/profile/${this.props.user._id}`}>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item href="/events/create">
              Create event
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => this.props.logout()}>
              <button className="btn text-danger nowrap p-0 m-0">
                Log out
              </button>
            </NavDropdown.Item>
          </NavDropdown>
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

  headerLinks() {
    if (this.props.user) {
      return (
        <>
          <NavLink
            className="px-3 text-white text-decoration-none nav-link"
            to={"/"}
            end
          >
            Home
          </NavLink>
          <NavLink
            className="px-3 text-white nowrap text-decoration-none nav-link"
            to={"/events"}
            end
          >
            Events
          </NavLink>
          <NavLink
            className="px-3 text-white nowrap text-decoration-none nav-link"
            to={"/about"}
          >
            About
          </NavLink>
        </>
      );
    }
  }

  render() {
    return (
      <>
        <header
          className={`header d-flex justify-content-between align-items-center p-3 border-bottom text-white px-5 ${this.state.bg}`}
        >
          <Link
            to={"/"}
            className="header-logo d-flex align-items-center container p-0 m-0 text-decoration-none text-white"
          >
            <img src="static/logo-header-2.png" alt="logo" />
            <span>TicketNFT</span>
          </Link>
          <div className="align-items-center d-flex">
            <ul className="d-flex flex-row navbar-nav mr-5">
              {this.headerLinks()}
            </ul>
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
