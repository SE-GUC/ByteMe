import React, { Component } from "react";
import { Container, Row, Media } from "react-bootstrap";
import eventDefaultImage from "../images/event-icon.png";
import "./User.css";
import "../App.css";

class MiniEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: this.props.event
    };
  }

  async componentWillReceiveProps(props) {
    this.state = {
      event: this.props.event
    };
  }

  render() {
    const { title, brief, description, photos } = this.state.event;

    return (
      <Container className="user">
        <Row className="user-row">
          <Media>
            <img
              width={50}
              height={50}
              className="mr-3"
              src={photos.length === 0 ? eventDefaultImage : photos[0].link}
              alt="Generic placeholder"
            />
            <Media.Body>
              <h5>{title}</h5>
              <h6>{brief}</h6>
              <h6>{description}</h6>
            </Media.Body>
          </Media>
        </Row>
      </Container>
    );
  }
}

export default MiniEvent;
