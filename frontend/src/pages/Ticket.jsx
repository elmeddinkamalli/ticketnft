import { ethers } from "ethers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import $axios from "../helpers/axios";
import { connectToWallet, setLoading } from "../redux/features/userSlice";
import { serializeError } from "eth-rpc-errors";
import PermissionPopup from "../components/page-contents/PermissionPopup";
import { getChainDetails, isCurrentChain } from "../helpers/web3";

class Ticket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: window.location.pathname.split("/").pop(),
      ticket: null,
      ticketsSold: 0,
      isPermissionPopupActive: false,
    };

    this.togglePermissionPopup = this.togglePermissionPopup.bind(this);
    this.burnTicket = this.burnTicket.bind(this);
  }

  async componentDidMount() {
    this.props.setLoading(true);
    await $axios.get(`/tickets/${this.state.id}`).then((res) => {
      this.setState({
        ticket: res.data.data,
      });
    });
    this.props.setLoading(false);
  }

  togglePermissionPopup() {
    this.setState({
      isPermissionPopupActive: !this.state.isPermissionPopupActive,
    });
  }

  async burnTicket() {
    this.props.setLoading(true);
    this.setState({
      isPermissionPopupActive: false,
    });

    await this.props.contract
      .burn(this.state.ticket.tokenId)
      .then(() => {
        this.props.setLoading(false);
      })
      .catch((err) => {
        const serializedError = serializeError(err);
        toast.error(serializedError.data.originalError.reason);

        this.props.setLoading(false);
      });
  }

  render() {
    let chainDetails;
    if (this.state.ticket && this.state.ticket.eventId) {
      chainDetails = getChainDetails(this.state.ticket.eventId.chainId);
    }
    return (
      <div className="container ticket">
        <div className="d-flex flex-column align-items-center wrapper mx-auto mt-5">
          {this.state.ticket ? (
            <div className="row w-100 ticket-details">
              <div className="col-4 left">
                <img
                  src={this.state.ticket.image}
                  className="w-100 h-100 ticket-image"
                  id="Canvatext"
                />
              </div>
              <div className="col-8 right">
                <div className="d-flex">
                  <h5>{this.state.ticket.eventId.eventName}</h5>
                  {this.state.ticket.eventId.isDraft ? (
                    <small className="text-danger font-weight-bold ml-3">
                      DRAFT
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <Link
                  className="d-flex align-items-center text-decoration-none owner"
                  to={`/profile/${this.state.ticket.ownerId._id}`}
                >
                  <img
                    src={this.state.ticket.ownerId.profile ?? ""}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/static/default_avatar.png";
                    }}
                    alt="avatar"
                    className="owner-image mr-2"
                  />
                  <span>{this.state.ticket.ownerId.name ?? "Owner"}</span>
                </Link>
                <hr />
                <p>{this.state.ticket.eventId.description}</p>
                <div>
                  <span>Network: {chainDetails?.name}</span>
                </div>
                <div>
                  <span>
                    Ticket count for sale:{" "}
                    {this.state.ticket.eventId.maxTicketSupply}
                  </span>
                </div>
                <div>
                  <span>Tickets sold: {this.state.ticket.soldCount}</span>
                </div>
                <div>
                  <span>
                    Ticket price:{" "}
                    {ethers.utils.formatEther(
                      String(this.state.ticket.eventId.pricePerTicket),
                      "wei"
                    )}{" "}
                    {chainDetails.nativeCurrency.symbol}
                  </span>
                </div>
                <hr />
                <div>
                  {this.props.connectedAddress &&
                  this.props.user &&
                  this.state.ticket.ownerId._id == this.props.user._id &&
                  isCurrentChain(this.state.ticket.eventId.chainId) ? (
                    <button
                      className="btn btn-danger"
                      onClick={this.togglePermissionPopup}
                    >
                      Burn ticket
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <PermissionPopup
                active={this.state.isPermissionPopupActive}
                toggle={this.togglePermissionPopup}
                handleSubmit={this.burnTicket}
              />
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    connectedAddress: state.user.connectedAddress,
    user: state.user.user,
    contract: state.web3.web3ForQuery,
  };
};

const mapDipatchToProps = (dispatch) => {
  return {
    setLoading: (payload = true) => dispatch(setLoading(payload)),
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Ticket);
