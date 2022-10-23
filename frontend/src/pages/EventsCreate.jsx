import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import LoginAlert from "./LoginAlert";
import { FileUploader } from "react-drag-drop-files";
import { ReactComponent as UploadIcon } from "../assets/static/upload.svg";
import $axios from "../helpers/axios";
import { compressImage } from "../helpers/functions";
import ipfs from "../helpers/ipfs";
import DefaultTicketDesign from "../assets/static/ticket_design_to_mint.png";
const fileTypes = ["JPG", "PNG", "JPEG"];

class EventsCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedPhoto: null,
      preview: null,
      eventName: null,
      eventDescription: null,
      maxTicketSupply: null,
      pricePerTicket: null,
      uploadedTicket: null,
      ticketPreview: null,
      ticketDesignIsDefault: true,
      errors: [],
    };
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.uploadTicket = this.uploadTicket.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async uploadPhoto(file) {
    this.setState({
      uploadedPhoto: await compressImage(file),
      preview: URL.createObjectURL(new Blob([file], { type: "image/png" })),
    });
  }

  async uploadTicket(file) {
    this.setState({
      uploadedTicket: await compressImage(file),
      ticketPreview: URL.createObjectURL(
        new Blob([file], { type: "image/png" })
      ),
    });
  }

  validateSubmit() {
    this.setState({
      errors: [],
    });

    let errors = [];
    if (!this.state.uploadedPhoto) errors.push("eventImage");
    if (!this.state.ticketDesignIsDefault && !this.state.uploadedTicket)
      errors.push("ticketDesign");
    if (!this.state.eventName) errors.push("eventName");
    if (!this.state.maxTicketSupply) errors.push("maxTicketSupply");
    if (!this.state.pricePerTicket) errors.push("pricePerTicket");

    this.setState({
      errors: errors,
    });

    if (errors.length) return false;
    return true;
  }

  async handleSubmit() {
    if (!this.validateSubmit()) return false;

    let ipfsHashTicketDesign;
    let ipfsHashEventImage = await ipfs.add(this.state.uploadedPhoto, {
      pin: true,
      progress: (bytes) => {
        // console.log("File upload progress ", Math.floor(bytes * 100 / (params.logo.size)))
      },
    });

    if (this.state.ticketDesignIsDefault) {
      await fetch(DefaultTicketDesign)
        .then((res) => res.blob())
        .then(async (blob) => {
          ipfsHashTicketDesign = await ipfs.add(
            new File([blob], "default-design", { type: "image/png" }),
            {
              pin: true,
              progress: (bytes) => {
                // console.log("File upload progress ", Math.floor(bytes * 100 / (params.logo.size)))
              },
            }
          );
        });
    } else {
      ipfsHashTicketDesign = await ipfs.add(this.state.uploadedTicket, {
        pin: true,
        progress: (bytes) => {
          // console.log("File upload progress ", Math.floor(bytes * 100 / (params.logo.size)))
        },
      });
    }

    $axios
      .post("/events/create", {
        eventName: this.state.eventName,
        eventDescription: this.state.eventDescription,
        maxTicketSupply: this.state.maxTicketSupply,
        pricePerTicket: this.state.pricePerTicket,
        image: ipfsHashEventImage.path,
        ticketDesignIsDefault: this.state.ticketDesignIsDefault,
        ticketImage: ipfsHashTicketDesign.path,
      })
      .then((res) => {
        const draftEventId = res.data.data._id;
        const parameters = [
          this.state.eventName,
          this.state.maxTicketSupply,
          this.state.pricePerTicket,
          {
            value: 1000000000000000,
          },
        ];
        this.props.contract
          .createEvent(...parameters)
          .then((res2) => {
            console.log(res2);
            return (window.location.href = `/events/${draftEventId}`);
          })
          .catch(console.log);
      });
  }

  render() {
    if (!this.props.user) {
      return <LoginAlert />;
    } else {
      return (
        <div className="container events-create">
          <div className="d-flex flex-column align-items-center wrapper mx-auto mt-5">
            <div className="w-100">
              <h3>Create event</h3>
              <div className="mt-3 mb-2">
                <label className="d-block" htmlFor="event-name">
                  Event name:
                </label>
                <input
                  className={`w-100 ${
                    this.state.errors.includes("eventName") ? "hasError" : ""
                  }`}
                  type="text"
                  name="event-name"
                  id="event-name"
                  placeholder="Enter event name"
                  onChange={(e) => {
                    this.setState({
                      eventName: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="my-3">
                <label className="d-block" htmlFor="event-description">
                  Event description:
                </label>
                <textarea
                  className={`w-100`}
                  name="event-description"
                  id="event-description"
                  placeholder="Enter event description"
                  cols="30"
                  rows="4"
                  onChange={(e) => {
                    this.setState({
                      eventDescription: e.target.value,
                    });
                  }}
                ></textarea>
              </div>
              <div className="my-3">
                <label className="d-block" htmlFor="ticket-count">
                  Ticket count for sale:
                </label>
                <input
                  className={`w-100 ${
                    this.state.errors.includes("maxTicketSupply")
                      ? "hasError"
                      : ""
                  }`}
                  type="number"
                  min={1}
                  name="ticket-count"
                  id="ticket-count"
                  placeholder="Enter value"
                  onChange={(e) => {
                    this.setState({
                      maxTicketSupply: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="my-3">
                <label className="d-block" htmlFor="ticket-price">
                  Ticket price (ETH):
                </label>
                <input
                  className={`w-100 ${
                    this.state.errors.includes("pricePerTicket")
                      ? "hasError"
                      : ""
                  }`}
                  type="number"
                  min={1}
                  name="ticket-price"
                  id="ticket-price"
                  placeholder="Enter value"
                  onChange={(e) => {
                    this.setState({
                      pricePerTicket: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="file-upload-preview w-100 my-3">
              <label className="d-block" htmlFor="image">
                Image:
              </label>
              {this.state.preview ? (
                <div className="preview-box">
                  <img
                    src={this.state.preview}
                    className="preview"
                    alt="uploaded photo"
                  />
                  <button
                    className="text-white"
                    onClick={() =>
                      this.setState({
                        uploadedPhoto: null,
                        preview: null,
                      })
                    }
                  >
                    Change
                  </button>
                </div>
              ) : (
                <FileUploader
                  classes={`fileuploader w-100 ${
                    this.state.errors.includes("eventImage") ? "hasError" : ""
                  }`}
                  multiple={false}
                  handleChange={this.uploadPhoto}
                  name="file"
                  types={fileTypes}
                >
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center p-4">
                    <UploadIcon className="mb-4" />
                    <h5>Drag and drop your files here</h5>
                    <p className="m-0">or click to browse</p>
                  </div>
                </FileUploader>
              )}
            </div>

            <div className="ticket-upload-preview w-100 my-3">
              <label className="d-block" htmlFor="image">
                Ticket design:
              </label>
              <select
                className="w-100"
                name="ticket-design"
                id="ticket-design"
                onChange={(e) => {
                  this.setState({
                    ticketDesignIsDefault: e.target.value == 1 ? true : false,
                  });
                }}
              >
                <option value="1" defaultValue>
                  Default
                </option>
                <option value="0">Upload</option>
              </select>
              {this.state.ticketDesignIsDefault ? (
                <div className="my-3">
                  <label className="d-block" htmlFor="image">
                    Ticket:
                  </label>
                  <img
                    className="w-50"
                    src="/static/ticket_design_default.png"
                    alt="ticket design"
                  />
                </div>
              ) : this.state.ticketPreview ? (
                <div className="preview-box my-3">
                  <label className="d-block" htmlFor="image">
                    Ticket:
                  </label>
                  <img
                    src={this.state.ticketPreview}
                    className="preview"
                    alt="uploaded ticket"
                  />
                  <button
                    className="text-white"
                    onClick={() =>
                      this.setState({
                        uploadedTicket: null,
                        ticketPreview: null,
                      })
                    }
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="my-3">
                  <label className="d-block" htmlFor="image">
                    Upload ticket design:
                  </label>
                  <FileUploader
                    classes={`fileuploader w-100 ${
                      this.state.errors.includes("ticketDesign")
                        ? "hasError"
                        : ""
                    }`}
                    multiple={false}
                    handleChange={this.uploadTicket}
                    name="file"
                    types={fileTypes}
                  >
                    <div className="w-100 d-flex flex-column justify-content-center align-items-center p-4">
                      <UploadIcon className="mb-4" />
                      <h5>Drag and drop your files here</h5>
                      <p className="m-0">or click to browse</p>
                    </div>
                  </FileUploader>
                </div>
              )}
            </div>
            <div className="mt-4 w-100">
              <button
                className="w-100 btn btn-outline-primary"
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      );
    }
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

export default connect(mapStateToProps, mapDipatchToProps)(EventsCreate);