import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import EditProdile from "../pages/EditProdile";
import Event from "../pages/Event";
import Events from "../pages/Events";
import EventsCreate from "../pages/EventsCreate";
import Profile from "../pages/Profile";
import Ticket from "../pages/Ticket";
import TicketDesign from "../pages/TicketDesign";

export default class UserPanelRoutes extends Component {
  render() {
    return (
      <div className="contents px-2 px-sm-4">
        <Routes>
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"/events"} element={<Events />} />
          <Route path={"/events/create"} element={<EventsCreate />} />
          <Route path={"/events/:id"} element={<Event />} />
          <Route path={"/tickets/design/:id"} element={<TicketDesign />} />
          <Route path={"/tickets/:id"} element={<Ticket />} />
          <Route path={"/profile/edit"} element={<EditProdile />} />
          <Route path={"/profile/:id"} element={<Profile />} />
        </Routes>
      </div>
    );
  }
}
