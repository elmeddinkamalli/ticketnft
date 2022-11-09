import React, { Component } from "react";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { currentChainId, isValidChainId } from "../../helpers/web3";
import { connectToWallet, logout } from "../../redux/features/userSlice";
import LoginModal from "../page-contents/LoginModal";
import SwitchNetwork from "../page-contents/SwitchNetwork";
import BarsIco from "../../assets/static/bars.svg";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginModalActive: false,
      bg: "transparent",
    };
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
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

    document
      .getElementById("menu-toggle")
      .addEventListener("change", this.toggleMobileMenu);
  }

  toggleMobileMenu() {
    var toggle = document.getElementById("menu-toggle");
    if (toggle.checked) {
      document.querySelector(".header_mobile").classList.add("open");
    } else {
      document.querySelector(".header_mobile").classList.remove("open");
    }
  }

  closeMobileMenu() {
    document.querySelector(".header_mobile").classList.remove("open");
    document.getElementById("menu-toggle").checked = false;
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
    return (
      <>
        <NavLink
          onClick={this.closeMobileMenu}
          className="px-3 text-white text-decoration-none nav-link"
          to={"/"}
          end
        >
          Home
        </NavLink>
        <NavLink
          onClick={this.closeMobileMenu}
          className="px-3 text-white nowrap text-decoration-none nav-link"
          to={"/events"}
          end
        >
          Events
        </NavLink>
        <NavLink
          onClick={this.closeMobileMenu}
          className="px-3 text-white nowrap text-decoration-none nav-link"
          to={"/about"}
        >
          About
        </NavLink>
      </>
    );
  }

  connectButtonsMobile() {
    if (this.props.connectedAddress && this.props.user) {
      return (
        <>
          <Link
            onClick={this.closeMobileMenu}
            className="px-3 text-white nowrap text-decoration-none nav-link"
            to={`/profile/${this.props.user._id}`}
          >
            Profile
          </Link>
          <Link
            onClick={this.closeMobileMenu}
            className="px-3 text-white nowrap text-decoration-none nav-link"
            to="/events/create"
          >
            Create event
          </Link>
          <hr />
          <Link
            className="px-3 text-white nowrap text-decoration-none nav-link"
            onClick={() => {
              this.props.logout();
              this.closeMobileMenu;
            }}
          >
            <button className="btn text-danger nowrap p-0 m-0">Log out</button>
          </Link>
        </>
      );
    } else if (this.props.connectedAddress == null && this.props.user) {
      return (
        <>
          <Link
            className="px-3 text-white nowrap text-decoration-none nav-link"
            variant="outline-info nowrap"
            onClick={() => this.props.connectToWallet(false)}
          >
            Connect wallet
          </Link>
        </>
      );
    } else if (this.props.user == null && this.props.connectedAddress) {
      return (
        <Link
          className="px-3 text-white nowrap text-decoration-none nav-link"
          variant="outline-info"
          onClick={() => this.props.connectToWallet(true)}
        >
          Login
        </Link>
      );
    } else {
      return (
        <Link
          className="px-3 text-white nowrap text-decoration-none nav-link"
          variant="outline-info nowrap"
          onClick={this.toggleLoginModal}
        >
          Connect and login
        </Link>
      );
    }
  }

  render() {
    return (
      <>
        <header
          className={`header p-3 border-bottom text-white px-5 ${this.state.bg}`}
        >
          <div className="header_web d-flex justify-content-between align-items-center">
            <Link
              to={"/"}
              className="header-logo d-flex align-items-center container p-0 m-0 text-decoration-none text-white"
              onClick={this.closeMobileMenu}
            >
              <img src="static/logo-header-2.png" alt="logo" />
              <span>TicketNFT</span>
            </Link>
            <div className="align-items-center d-flex">
              {!isValidChainId() && <SwitchNetwork />}
              <div className="cursor-pointer ml-3 d-sm-none d-block">
                <input id="menu-toggle" type="checkbox" className="d-none" />
                <label
                  className="header_mobile-menu_button_container"
                  htmlFor="menu-toggle"
                >
                  <div className="header_mobile-menu_button"></div>
                </label>
              </div>
              <div className="d-none d-sm-flex align-items-center">
                <ul className="d-flex flex-row navbar-nav mr-5">
                  {this.headerLinks()}
                </ul>
                {this.connectButtons()}
              </div>
            </div>
          </div>
          <div className="header_mobile d-sm-none d-block">
            <ul className="d-flex flex-column navbar-nav mr-5">
              {this.headerLinks()}
            </ul>
            <hr />
            <ul className="d-flex flex-column navbar-nav">
              {this.connectButtonsMobile()}
            </ul>
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
