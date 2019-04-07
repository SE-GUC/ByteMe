import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import "./Page.css";

class Page extends Component {
  render() {
    const { name, role_to_control, description, members } = this.props;

    return (
      <Card className="by">

        <Card.Img
          className="img"
          src="https://www.solidbackgrounds.com/images/1920x1080/1920x1080-yellow-solid-color-background.jpg"
          alt="Card image"
        />
        <Card.ImgOverlay>
          <Card.Title className="title">{name}</Card.Title>
          <Card.Text className="text">{description}</Card.Text>
        </Card.ImgOverlay>
      </Card>
    );
  }
}

Page.propTypes = {
  name: PropTypes.string,
  role_to_control: PropTypes.string,
  description: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool
};

export default Page;
