import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import $axios from "../helpers/axios";
import { setLoading } from "../redux/features/userSlice";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: window.location.pathname.split("/").pop(),
      profile: null,
      activeTab: "events",
    };
  }

  componentDidMount() {
    this.props.setLoading(true);
    $axios.get(`/user/${this.state.id}`).then((res) => {
      this.setState({
        profile: res.data.data,
      });
    });
    this.props.setLoading(false);
  }

  render() {
    return (
      <div className="container profile">
        {this.state.profile ? (
          <div className="px-2 px-sm-5">
            <div className="d-flex flex-column justify-content-center align-items-center profile-wrapper p-5">
              <img
                className="avatar"
                src={this.state.profile.profile ?? ""}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "/static/default_avatar.png";
                }}
                alt="profile image"
              />
              <div className="text-center">
                <h5 className="mb-0 mt-2">
                  {this.state.profile.name ?? "Undefined"}
                </h5>
                <p>@{this.state.profile.username ?? "undefined"}</p>
              </div>
              {this.props.user &&
              this.state.profile._id == this.props.user._id ? (
                <div className="btns">
                  <Link to={`/profile/edit`} className="btn btn-outline-info">
                    Edit
                  </Link>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="row mt-5 p-0">
              <div className="col-12 col-md-2 mb-4 mb-md-0">
                <ul className="list-group tabs">
                  <li
                    className={`list-group-item ${
                      this.state.activeTab == "events" ? "active" : ""
                    }`}
                    onClick={() => {
                      this.setState({
                        activeTab: "events",
                      });
                    }}
                  >
                    Events
                  </li>
                  <li
                    className={`list-group-item ${
                      this.state.activeTab == "tickets" ? "active" : ""
                    }`}
                    onClick={() => {
                      this.setState({
                        activeTab: "tickets",
                      });
                    }}
                  >
                    Tickets
                  </li>
                </ul>
              </div>
              <div className="col-12 col-md-10">
                <div className="grid-container">
                  {this.state.activeTab == "events"
                    ? this.state.profile.events.map((event, i) => {
                        return (
                          <Link
                            to={`/events/${event._id}`}
                            key={i}
                            className="event-item h-100"
                          >
                            <img
                              className="w-100 h-100"
                              src={event.image}
                              alt=""
                            />
                            <div className="event-item-info-section">
                              <h5 className="text-white">{event.eventName}</h5>
                            </div>
                          </Link>
                        );
                      })
                    : ""}
                  {this.state.activeTab == "tickets"
                    ? this.state.profile.tickets.map((ticket, i) => {
                        return (
                          <Link
                            to={`/tickets/${ticket._id}`}
                            key={i}
                            className="event-item h-100"
                          >
                            <img
                              className="w-100 h-100"
                              src={ticket.image}
                              alt=""
                            />
                          </Link>
                        );
                      })
                    : ""}
                </div>
              </div>
            </div>
          </div>
        ) : (
          "Loading..."
        )}
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

export default connect(mapStateToProps, mapDipatchToProps)(Profile);
