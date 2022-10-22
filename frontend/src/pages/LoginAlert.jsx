import React, { Component } from "react";

export default class LoginAlert extends Component {
  render() {
    return (
      <div className="login-alert">
        <div className="center d-flex flex-column align-items-center">
          <img src="/static/unauthenticated.svg" alt="unauthenticated" />
          <h5 className="text-info mt-3">Login needed</h5>
        </div>
      </div>
    );
  }
}
