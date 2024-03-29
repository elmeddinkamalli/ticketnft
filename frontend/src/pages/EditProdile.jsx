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
import { setLoading } from "../redux/features/userSlice";
import { toast } from "react-toastify";
const fileTypes = ["JPG", "PNG", "JPEG"];
let stopUpdate = false;

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedPhoto: null,
      preview: null,
      fullname: null,
      username: null,
      email: null,
      errors: [],
    };
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.user && !stopUpdate) {
      stopUpdate = true;
      this.setState({
        preview: this.props.user.profile,
      });
    }
  }

  async uploadPhoto(file) {
    this.setState({
      uploadedPhoto: file,
      preview: URL.createObjectURL(new Blob([file], { type: "image/png" })),
    });
  }

  async handleSubmit() {
    this.props.setLoading(true);
    const formData = new FormData();
    if (this.state.uploadedPhoto)
      formData.append("profile", this.state.uploadedPhoto);
    if (this.state.fullname) formData.append("fullname", this.state.fullname);
    if (this.state.username) formData.append("username", this.state.username);
    if (this.state.email) formData.append("email", this.state.email);

    $axios
      .post("/user/edit", formData)
      .then((res) => {
        this.props.setLoading(false);
        toast.success("Updated successfully!");
      })
      .catch((err) => {
        this.props.setLoading(true);
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
              <h3>Edit user details</h3>
              <div className="mt-3 mb-2">
                <label className="d-block" htmlFor="fullname">
                  Fullname:
                </label>
                <input
                  className={`w-100`}
                  type="text"
                  name="fullname"
                  id="fullname"
                  defaultValue={this.props.user?.name ?? ""}
                  placeholder="Enter event name"
                  onChange={(e) => {
                    this.setState({
                      fullname: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="my-3">
                <label className="d-block" htmlFor="username">
                  Username:
                </label>
                <input
                  className={`w-100`}
                  type="text"
                  name="username"
                  id="username"
                  defaultValue={this.props.user?.username ?? ""}
                  placeholder="Enter event name"
                  onChange={(e) => {
                    this.setState({
                      username: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="my-3">
                <label className="d-block" htmlFor="Email">
                  Email:
                </label>
                <input
                  className={`w-100`}
                  type="email"
                  name="Email"
                  id="Email"
                  defaultValue={this.props.user?.email ?? ""}
                  placeholder="Enter event name"
                  onChange={(e) => {
                    this.setState({
                      email: e.target.value,
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
                  classes={`fileuploader w-100`}
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
  return {
    setLoading: (payload = true) => dispatch(setLoading(payload)),
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(EditProfile);
