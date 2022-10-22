import React, { Component } from "react";

export default class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <div
          className="dashboard-banner-bg"
          style={{ backgroundImage: "url(/static/dashboard-banner2.jpeg)" }}
        ></div>
        <div className="dashboard-head">
          <div className="slogan text-center">
            <h1>
              BOOK YOUR TICKETS FROM BLOKCHAIN
            </h1>
            <h5>Create events, buy and sell tickets as NFT</h5>
          </div>
        </div>
      </div>
    );
  }
}
