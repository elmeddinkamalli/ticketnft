import React, { Component } from "react";
import Layout from "../components/layout/Layout";
import "../assets/styles/index.sass";
import UserPanelRoutes from "../routes/UserPanelRoutes";
import { BrowserRouter } from "react-router-dom";

export default class Main extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <UserPanelRoutes />
        </Layout>
      </BrowserRouter>
    );
  }
}
