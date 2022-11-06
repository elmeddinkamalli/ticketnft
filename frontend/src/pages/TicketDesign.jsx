import { ethers } from "ethers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import $axios from "../helpers/axios";
import ipfs from "../helpers/ipfs";
import { connectToWallet, setLoading } from "../redux/features/userSlice";
const yourId = new Date().getTime();
import { serializeError } from "eth-rpc-errors";

class TicketDesign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: window.location.pathname.split("/").pop(),
      ticket: null,
      ticketsSold: 0,
      inProgress: false,
      generatedImage: false,
      deadlinePercent: 0,
    };

    this.mintTicket = this.mintTicket.bind(this);
  }

  async componentDidMount() {
    this.props.setLoading(true);
    await $axios.get(`/tickets/design/${this.state.id}`).then((res) => {
      this.setState({
        ticket: res.data.data,
      });
    });
    this.props.setLoading(false);
  }

  async generatedImage() {
    var canvas = document.getElementById("Canvatext");

    let firstText = this.state.ticket?.eventId.eventName;
    let secondText = yourId;
    if (!canvas || !firstText) return;
    var context = canvas.getContext("2d");
    var imageObj = new Image();
    imageObj.onload = function () {
      context.canvas.width = this.width;
      context.canvas.height = this.height;
      context.drawImage(imageObj, 0, 0);
      context.font = "40pt Calibri";
      context.fillText(
        firstText,
        (this.width * 20) / 100,
        (this.height * 15) / 100
      );
      context.font = "50pt Open Sans";
      var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop("0", "#5704C2");
      gradient.addColorStop("1.0", "#FF0305");
      context.fillStyle = gradient;
      context.fillText(
        `#${secondText} ID`,
        (this.width * 20) / 100,
        (this.height * 25) / 100
      );
    };
    imageObj.src = this.state.ticket.image;
    imageObj.setAttribute("crossorigin", "anonymous"); // works for me
    this.setState({
      generatedImage: true,
    });
  }

  componentDidUpdate() {
    if (this.state.generatedImage) {
      return;
    }
    this.generatedImage();
  }

  async mintTicket() {
    this.props.setLoading(true);
    this.setState({
      inProgress: true,
    });
    let ipfsHash;
    await fetch(document.getElementById("Canvatext").toDataURL())
      .then((res) => res.blob())
      .then(async (blob) => {
        ipfsHash = await ipfs.add(
          new File([blob], "ticket", { type: "image/png" }),
          {
            pin: true,
          }
        );
      });

    let openseaStandards = {
      name: this.state.ticket.eventId.eventName,
      description: this.state.ticket.eventId.description,
      external_url: "https://ticketnft.io",
      image: "https://ipfs.io/ipfs/" + ipfsHash.path,
      attributes: [],
      centralizedId: yourId,
    };

    const jsonUrl = await ipfs.pinJson(openseaStandards);
    this.props.contract
      .mintTicket(this.state.ticket.eventId.eventId, jsonUrl, yourId, {
        value: this.state.ticket.eventId.pricePerTicket,
      })
      .then(async (res2) => {
        await $axios.post("/tickets/create", {
          eventId: this.state.ticket.eventId._id,
          metadataURI: jsonUrl,
          image: ipfsHash.path,
          uniqueId: yourId,
        });
        this.props.setLoading(false);
      })
      .catch((err) => {
        const serializedError = serializeError(err);
        toast.error(serializedError.data.originalError.reason);
        this.setState({
          inProgress: false,
        });
        this.props.setLoading(false);
      });
  }

  initMintButton() {}

  render() {
    if (
      this.state.ticket &&
      this.state.ticket.eventId &&
      this.state.ticket.eventId.saleEnds &&
      this.state.ticket.eventId.saleEnds != 0 &&
      this.state.deadlinePercent == 0
    ) {
      setTimeout(() => {
        let deadlinePercent =
          (Math.floor(
            (new Date().getTime() - new Date().getTimezoneOffset()) / 1000 -
              this.state.ticket.eventId.saleStarts
          ) /
            (this.state.ticket.eventId.saleEnds -
              this.state.ticket.eventId.saleStarts)) *
          100;
        if (deadlinePercent > 100) {
          deadlinePercent = 100;
        }

        this.setState({
          deadlinePercent: deadlinePercent,
        });
      }, 100);
    }

    return (
      <div className="container ticket">
        <div className="d-flex flex-column align-items-center wrapper mx-auto mt-5">
          {this.state.ticket ? (
            <div className="row w-100 ticket-details">
              <div className="col-4 left">
                {/* <img
                  className="w-100 ticket-image"
                  src={this.state.ticket.image}
                  alt="ticket image"
                /> */}
                <canvas
                  className="w-100 h-100 ticket-image"
                  id="Canvatext"
                ></canvas>
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
                  to={`/profile/${this.state.ticket.eventId.ownerId._id}`}
                >
                  <img
                    src={this.state.ticket.eventId.ownerId.profile ?? ""}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/static/default_avatar.png";
                    }}
                    alt="avatar"
                    className="owner-image mr-2"
                  />
                  <span>
                    {this.state.ticket.eventId.ownerId.name ?? "Owner"}
                  </span>
                </Link>
                <hr />
                <p>{this.state.ticket.eventId.description}</p>
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
                      this.state.ticket.eventId.pricePerTicket,
                      "wei"
                    )}{" "}
                    ETH
                  </span>
                </div>
                <hr />
                {this.state.deadlinePercent != 100 ? (
                  !this.state.ticket.eventId.isDraft && (
                    <div>
                      {this.state.ticket.myTicket ? (
                        this.state.ticket.myTicket.isDraft ? (
                          <>
                            <button
                              className="btn btn-primary"
                              type="button"
                              disabled
                            >
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              <span className="sr-only ml-2">
                                Confirming...
                              </span>
                            </button>
                            <span className="badge badge-warning text-bg-danger ml-4">
                              DRAFT
                            </span>
                          </>
                        ) : (
                          <Link
                            to={`/tickets/${this.state.ticket.myTicket._id}`}
                            type="button"
                            className="btn btn-outline-success"
                          >
                            BOUGHT
                          </Link>
                        )
                      ) : this.props.user ? (
                        this.state.inProgress ? (
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="sr-only ml-2">In progress...</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-info"
                            onClick={this.mintTicket}
                          >
                            Mint your ticket now
                          </button>
                        )
                      ) : (
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => this.props.connectToWallet(true)}
                        >
                          Login to mint ticket
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  <button className="btn btn-success" disabled>
                    Ticket sale ended
                  </button>
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
    connectToWallet: (login) =>
      dispatch(
        connectToWallet({
          isWalletConnect: false,
          needNonce: login,
        })
      ),
    setLoading: (payload = true) => dispatch(setLoading(payload)),
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(TicketDesign);
