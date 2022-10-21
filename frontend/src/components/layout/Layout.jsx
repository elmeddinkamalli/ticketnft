import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../../redux/features/userSlice";
import Header from "./Header";

export default class Layout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}
