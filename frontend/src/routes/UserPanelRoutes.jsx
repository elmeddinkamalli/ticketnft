import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

export default class UserPanelRoutes extends Component {
  render() {
    console.log("test");
    return (
      <div className="contents px-2 px-sm-4">
        <Routes>
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"/test"} element={<Dashboard />} />
        </Routes>
      </div>
    );
  }
}
