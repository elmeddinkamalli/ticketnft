import { ethers } from "ethers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import $axios from "../helpers/axios";
import ipfs from "../helpers/ipfs";

class Ticket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: window.location.pathname.split("/").pop(),
      ticket: null,
      ticketsSold: 0,
    };

    this.mintTicket = this.mintTicket.bind(this);
  }

  async componentDidMount() {
    await $axios.get(`/tickets/design/${this.state.id}`).then((res) => {
      this.setState({
        ticket: res.data.data,
      });

      if (!res.data.data.eventId.isDraft && res.data.data.eventId.blokchainId) {
        this.props.contract
          .eventTicketSoldCount(res.data.data.eventId.blokchainId)
          .then((res2) => {
            this.setState({
              ticketsSold: parseInt(res2, 16),
            });
          });
      }
    });
  }

  generatedImage() {
    var canvas = document.getElementById("Canvatext");

    let firstText = this.state.ticket?.eventId.eventName;
    let secondText = this.state.ticket?.eventId.blokchainId ?? 1;
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
      context.font = "80pt Open Sans";
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
  }

  componentDidUpdate() {
    if (this.state.generatedImage) return;
    this.generatedImage();
  }

  async mintTicket() {
    await fetch(document.getElementById("Canvatext").toDataURL())
      .then((res) => res.blob())
      .then(async (blob) => {
        await ipfs.add(new File([blob], "ticket", { type: "image/png" }), {
          pin: true
        });
      });
  }

  render() {
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
                  <span>Tickets sold: {this.state.ticketsSold}</span>
                </div>
                <div>
                  <span>
                    Ticket price: {this.state.ticket.eventId.pricePerTicket}
                  </span>
                </div>
                <hr />
                <div>
                  <button
                    className="btn btn-outline-info"
                    onClick={this.mintTicket}
                  >
                    Mint your ticket now
                  </button>
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

export default connect(mapStateToProps, mapDipatchToProps)(Ticket);
