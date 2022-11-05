import { ethers } from "ethers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import $axios from "../helpers/axios";
import { setLoading } from "../redux/features/userSlice";

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
    this.props.setLoading(true);
    await $axios.get(`/events/${this.state.id}`).then((res) => {
      this.setState({
        event: res.data.data,
      });

      // if (!res.data.data.isDraft && res.data.data.eventId) {
      //   this.props.contract
      //     .eventTicketSoldCount(res.data.data.eventId)
      //     .then((res2) => {
      //       this.setState({
      //         ticketsSold: parseInt(res2, 16),
      //       });
      //     });
      // }
      this.props.setLoading(false);
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
                <div className="mt-2">{this.state.event.description}</div>
                <hr />
                <div>
                  <span>
                    Ticket count for sale: {this.state.event.maxTicketSupply}
                  </span>
                </div>
                <div>
                  <span>Tickets sold: {this.state.event.ticketSoldCount}</span>
                </div>
                <div>
                  <span>
                    Ticket price:{" "}
                    {ethers.utils.formatEther(
                      this.state.event.pricePerTicket,
                      "wei"
                    )}{" "}
                    ETH
                  </span>
                </div>
                <hr />
                {this.state.event.ticketDesigns ? (
                  <div className="tickets">
                    <h5>Mint your own ticket for this event below now</h5>
                    <div className="grid-container">
                      {this.state.event.ticketDesigns.map((design, i) => {
                        return (
                          <Link
                            key={i}
                            to={`/tickets/design/${design._id}`}
                            className="ticket"
                          >
                            <img
                              className="w-100 event-image"
                              src={design.image}
                              alt="event image"
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
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
  return {
    setLoading: (payload = true) => dispatch(setLoading(payload)),
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Event);
