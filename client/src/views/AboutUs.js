import React, { Component } from "react";
import "./AboutUs.css";

import { Slide } from "react-slideshow-image";

// First we create our class
class AboutUs extends Component {
  render() {
    const slideImages = [
      "https://s3.amazonaws.com/libapps/customers/49/images/unflag.gif",
      "data:image/jpeg;base64,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",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrhzwXPSZ65rfrodx4gXSKNe3bNOxAu7U_NkHedWyW0NBXbNGI"
    ];

    const properties = {
      duration: 5000,
      transitionDuration: 500,
      infinite: true,
      indicators: true,
      arrows: true
    };
    return (
      <div>
        <h1>Our Mission & Vision</h1>
        <p>
          We see ourselves as representatives of the United Nations, and do our
          best to help in development in different fields.{" "}
        </p>
        <h1>Our Achievements</h1>
        <div className="slide-container">
          <Slide {...properties}>
            <div className="each-slide">
              <div
                className="img"
                style={{ backgroundImage: `url(${slideImages[0]})` }}
              >
                <span className="ddd">Slide 1</span>
              </div>
            </div>
            <div className="each-slide">
              <div
                className="img"
                style={{ backgroundImage: `url(${slideImages[1]})` }}
              >
                <span className="ddd">Slide 2</span>
              </div>
            </div>
            <div className="each-slide">
              <div
                className="img"
                style={{ backgroundImage: `url(${slideImages[2]})` }}
              >
                <span className="ddd">Slide 3</span>
              </div>
            </div>
          </Slide>
        </div>
      </div>
    );
  }
}

export default AboutUs;
