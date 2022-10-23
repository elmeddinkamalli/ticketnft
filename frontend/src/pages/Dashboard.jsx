import React, { Component } from "react";
import MySlider from "../components/page-contents/Slider";
import $axios from "../helpers/axios";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      upcomingEvents: null,
    };
  }

  componentDidMount() {
    $axios.get("/events/list?createdAt=desc&take=6").then((res) => {
      this.setState({
        upcomingEvents: res.data.data,
      });
    });
  }

  render() {
    return (
      <div className="dashboard">
        <div
          className="dashboard-banner-bg"
          style={{ backgroundImage: "url(/static/dashboard-banner2.jpeg)" }}
        ></div>
        <div className="dashboard-head">
          <div className="slogan text-center">
            <h1>BOOK YOUR TICKETS FROM BLOKCHAIN</h1>
            <h5>Create events, buy and sell tickets as NFT</h5>
          </div>
        </div>
        <div style={{ height: "100px" }}></div>
        <div className="dashboard-slider mt-5 container">
          {this.state.upcomingEvents ? (
            <MySlider data={this.state.upcomingEvents} />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
