import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import $axios from "../helpers/axios";
import { setLoading } from "../redux/features/userSlice";

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: null,
    };
  }

  componentDidMount() {
    this.props.setLoading(true);
    $axios
      .get("/events/list?createdAt=desc")
      .then((res) => {
        this.setState({
          events: res.data.data,
        });
        this.props.setLoading(false);
      })
      .catch((err) => {
        this.props.setLoading(false);
      });
  }
  render() {
    return (
      <div className="container events mt-5">
        <h4>Available events</h4>
        {this.state.events ? (
          <div className="grid-container">
            {this.state.events.map((event, i) => {
              return (
                <Link
                  to={`/events/${event._id}`}
                  key={i}
                  className="event-item h-100"
                >
                  <img className="w-100 h-100" src={event.image} alt="" />
                  <div className="event-item-info-section">
                    <h5 className="text-white">{event.eventName}</h5>
                    <h5 className="btn btn-sm btn-outline-info">
                      Mint your ticket now
                    </h5>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <small className="text-danger">No event available</small>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDipatchToProps = (dispatch) => {
  return {
    setLoading: (payload = true) => dispatch(setLoading(payload)),
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Events);
