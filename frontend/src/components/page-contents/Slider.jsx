import React, { Component } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { ReactComponent as ArrowIcon } from "../../assets/static/arrow.svg";

export default class MySlider extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: this.props.data.length > 2 ? 3 : 2,
      slidesToScroll: 1,
      cclassName: "center",
      centerMode: true,
      centerPadding: "60px",
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
      ],
    };

    return (
      <div className="slider">
        <div className="align-items-center d-flex justify-content-between mb-3">
          <h3 className="slider-headline">Upcoming events</h3>
          <div className="controls d-flex justify-content-between">
            <span
              className="align-items-center d-flex justify-content-center text-center"
              onClick={this.previous}
            >
              <ArrowIcon className="arrow-left" />
            </span>
            <span
              className="align-items-center d-flex justify-content-center text-center"
              onClick={this.next}
            >
              <ArrowIcon />
            </span>
          </div>
        </div>

        <Slider ref={(c) => (this.slider = c)} {...settings}>
          {this.props.data.map((event, i) => {
            return (
              <Link
                to={`/events/${event._id}`}
                key={i}
                className="slider-item px-3 h-100"
              >
                <img className="w-100 h-100" src={event.image} alt="" />
                <div className="slider-item-info-section">
                  <h5 className="text-white">{event.eventName}</h5>
                  <h5 className="btn btn-sm btn-outline-info">
                    Mint your ticket now
                  </h5>
                </div>
              </Link>
            );
          })}
        </Slider>
      </div>
    );
  }
}
