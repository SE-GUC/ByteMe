import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import "./AWG.css";

class AWG extends Component {
  render() {
    const { name, description, banner, link } = this.props;

    return (
      <Card className="card" style={{ width: "18rem" }}>
        <Card.Img class name=".img" variant="top" src={banner} />
        <Card.Body className="container">
          <Card.Title className="club-name">{name}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <ul>
            <li>
              <a href={link}>Visit us</a>
              {""}
            </li>
          </ul>
        </Card.Body>
      </Card>
    );
  }
}

AWG.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  banner: PropTypes.string,
  link: PropTypes.string,
  isLoading: PropTypes.bool
};

export default AWG;
