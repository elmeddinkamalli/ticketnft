// import dayjs from "dayjs";
import { ethers } from "ethers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import $axios from "../helpers/axios";
import { convertUnixToDate } from "../helpers/functions";
import { getChainDetails } from "../helpers/web3";
import { setLoading } from "../redux/features/userSlice";

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: window.location.pathname.split("/").pop(),
      event: null,
      ticketsSold: 0,
      deadlinePercent: 0,
    };
  }

  async componentDidMount() {
    this.props.setLoading(true);
    await $axios.get(`/events/${this.state.id}`).then((res) => {
      this.setState({
        event: res.data.data,
      });
      this.props.setLoading(false);
    });
  }

  render() {
    let chainDetails;

    if (this.state.event) {
      chainDetails = getChainDetails(this.state.event.chainId);

      if (
        this.state.event.saleEnds &&
        this.state.event.saleEnds != 0 &&
        this.state.deadlinePercent == 0
      ) {
        setTimeout(() => {
          let deadlinePercent =
            (Math.floor(
              (new Date().getTime() - new Date().getTimezoneOffset()) / 1000 -
                this.state.event.saleStarts
            ) /
              (this.state.event.saleEnds - this.state.event.saleStarts)) *
            100;
          if (deadlinePercent > 100) {
            deadlinePercent = 100;
          }

          this.setState({
            deadlinePercent: deadlinePercent,
          });
        }, 1000);
      }
    }
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
                {this.state.event.saleEnds != 0 ? (
                  <div className="border border-primary w-100 event-deadline">
                    <div
                      className={`bg-primary h-100 d-flex align-items-center justify-content-between deadline-progress ${
                        this.state.deadlinePercent == 100 ? "ended" : ""
                      }`}
                      style={{
                        width: this.state.deadlinePercent + "%",
                      }}
                    >
                      <span>
                        Sale starts:{" "}
                        {convertUnixToDate(
                          this.state.event.saleStarts,
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </span>
                      <span>
                        Sale{" "}
                        {this.state.deadlinePercent == 100
                          ? "ended at"
                          : "ends"}
                        :{" "}
                        {convertUnixToDate(
                          this.state.event.saleEnds,
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
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
                  <span>Network: {chainDetails?.name}</span>
                </div>
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
                      String(this.state.event.pricePerTicket),
                      "wei"
                    )}{" "}
                    {chainDetails?.nativeCurrency.symbol}
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
