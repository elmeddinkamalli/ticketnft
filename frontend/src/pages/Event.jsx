import { ethers } from "ethers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import $axios from "../helpers/axios";

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: window.location.pathname.split("/").pop(),
      event: null,
      ticketsSold: 0,
    };
  }

  async componentDidMount() {
    await $axios.get(`/events/${this.state.id}`).then((res) => {
      this.setState({
        event: res.data.data,
      });

      if (!res.data.data.isDraft && res.data.data.blokchainId) {
        this.props.contract
          .eventTicketSoldCount(res.data.data.blokchainId)
          .then((res2) => {
            this.setState({
              ticketsSold: parseInt(res2, 16),
            });
          });
      }
    });
  }

  render() {
    return (
      <div className="container event">
        <div className="d-flex flex-column align-items-center wrapper mx-auto mt-5">
          {this.state.event ? (
            <div className="row w-100 event-details">
              <div className="col-8 left">
                <img
                  className="w-100 event-image"
                  src={this.state.event.image}
                  alt="event image"
                />
              </div>
              <div className="col-4 right">
                <div className="d-flex">
                  <h5>{this.state.event.eventName}</h5>
                  {this.state.event.isDraft ? (
                    <small className="text-danger font-weight-bold ml-3">
                      DRAFT
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <Link
                  className="d-flex align-items-center text-decoration-none owner"
                  to={`/profile/${this.state.event.ownerId._id}`}
                >
                  <img
                    src={this.state.event.ownerId.profile ?? ""}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/static/default_avatar.png";
                    }}
                    alt="avatar"
                    className="owner-image mr-2"
                  />
                  <span>{this.state.event.ownerId.name ?? "Owner"}</span>
                </Link>
                <hr />
                <div>
                  <span>
                    Ticket count for sale: {this.state.event.maxTicketSupply}
                  </span>
                </div>
                <div>
                  <span>Tickets sold: {this.state.ticketsSold}</span>
                </div>
                <div>
                  <span>Ticket price: {this.state.event.pricePerTicket}</span>
                </div>
                <hr />
                <div className="tickets">
                  <h5>Mint your own ticket for this event below now</h5>
                  <div className="grid-container">
                    <div className="ticket">
                      <img
                        className="w-100 event-image"
                        src={"/static/default_poster.png"}
                        alt="event image"
                      />
                    </div>
                    <div className="ticket">
                      <img
                        className="w-100 event-image"
                        src={"/static/default_poster.png"}
                        alt="event image"
                      />
                    </div>
                    <div className="ticket">
                      <img
                        className="w-100 event-image"
                        src={"/static/default_poster.png"}
                        alt="event image"
                      />
                    </div>
                    <div className="ticket">
                      <img
                        className="w-100 event-image"
                        src={"/static/default_poster.png"}
                        alt="event image"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
  return {};
};

export default connect(mapStateToProps, mapDipatchToProps)(Event);
