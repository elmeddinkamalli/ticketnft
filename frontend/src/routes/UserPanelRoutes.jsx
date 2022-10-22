import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import EventsCreate from "../pages/EventsCreate";

export default class UserPanelRoutes extends Component {
  render() {
    console.log("test");
    return (
      <div className="contents px-2 px-sm-4">
        <Routes>
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"/events/create"} element={<EventsCreate />} />
        </Routes>
      </div>
    );
  }
}
