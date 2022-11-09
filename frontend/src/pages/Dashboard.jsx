import React, { Component } from "react";
import { connect } from "react-redux";
import MySlider from "../components/page-contents/Slider";
import $axios from "../helpers/axios";
import { setLoading } from "../redux/features/userSlice";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      upcomingEvents: null,
    };
  }

  componentDidMount() {
    this.props.setLoading(true);
    $axios
      .get("/events/list?createdAt=desc&take=6")
      .then((res) => {
        this.setState({
          upcomingEvents: res.data.data,
        });
        this.props.setLoading(false);
      })
      .catch((err) => {
        this.props.setLoading(false);
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
          <div className="slogan text-center p-sm-0 p-5">
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

const mapStateToProps = (state) => {
  return {};
};

const mapDipatchToProps = (dispatch) => {
  return {
    setLoading: (payload = true) => dispatch(setLoading(payload)),
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Dashboard);
