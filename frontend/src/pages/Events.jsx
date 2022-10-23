import React, { Component } from "react";
import { Link } from "react-router-dom";
import $axios from "../helpers/axios";

export default class Events extends Component {
  constructor() {
    super();
    this.state = {
      events: null,
    };
  }

  componentDidMount() {
    $axios.get("/events/list?createdAt=desc").then((res) => {
      this.setState({
        events: res.data.data,
      });
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
                    <Link
                      to={`/events/${event._id}`}
                      className="btn btn-sm btn-outline-info"
                    >
                      Mint your ticket now
                    </Link>
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
