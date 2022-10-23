import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Event from "../pages/Event";
import Events from "../pages/Events";
import EventsCreate from "../pages/EventsCreate";
import Ticket from "../pages/Ticket";

export default class UserPanelRoutes extends Component {
  render() {
    console.log("test");
    return (
      <div className="contents px-2 px-sm-4">
        <Routes>
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"/events"} element={<Events />} />
          <Route path={"/events/create"} element={<EventsCreate />} />
          <Route path={"/events/:id"} element={<Event />} />
          <Route path={"/tickets/:id"} element={<Ticket />} />
        </Routes>
      </div>
    );
  }
}
