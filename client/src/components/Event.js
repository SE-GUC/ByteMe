import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  Badge,
  Modal,
  ButtonGroup,
  InputGroup,
  FormControl,
  Carousel
} from "react-bootstrap";
import "./Event.css";

class Event extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  // comingsoonOrRating(props) {
  //   const badge = props.comingSoon;
  //   if (badge) {
  //     return <Badge variant="success">Coming Soon</Badge>;
  //   }
  //   return <Badge variant="success">{props.rating} stars</Badge>;
  // }

  render() {
    const {
      id,
      comingSoon,
      title,
      brief,
      location,
      dateTime,
      description,
      photos,
      feedback,
      creator,
      rating
    } = this.props;

    return (
      <Card
        className="text-center"
        bg="warning"
        text="white"
        border="primary"
        style={{ width: "18rem" }}
      >
        <Card.Header>{title}</Card.Header>

        <Carousel>
          {photos.map(p => (
            <Carousel.Item>
              <img className="d-block w-100" src={p.link} alt="No Photos" />
            </Carousel.Item>
          ))}
        </Carousel>

        <Card.Body>
          <Card.Title className="mb-2 text-muted">{brief}</Card.Title>
          <Card.Subtitle>
            <Badge variant="success">{rating} stars</Badge>
            {/* <comingsoonOrRating badge={this.props.comingSoon} /> */}
          </Card.Subtitle>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            onClick={this.handleShow}
            className="event-button"
          >
            View details
          </Button>
        </Card.Footer>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Description</h4>
            <p>{description}</p>
            <h4>Location</h4>
            <p>{location}</p>
            <h4>Timing</h4>
            <p>{dateTime}</p>
            <h4>Creator</h4>
            <p>{creator}</p>
            <h4>Event Feedback</h4>
            {feedback.map(f => (
              <p>{f.content}</p>
            ))}
            <h4>Rate Event</h4>
            <p>
              <ButtonGroup className="mr-2" aria-label="First group">
                <Button>1</Button>
                <Button>2</Button>
                <Button>3</Button>
                <Button>4</Button>
                <Button>5</Button>
              </ButtonGroup>
            </p>
            <h4>Add Feedback</h4>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Your feedback"
                aria-label="Your feedback"
                aria-describedby="basic-addon2"
              />
              <InputGroup.Append>
                <Button variant="outline-secondary">Submit</Button>
              </InputGroup.Append>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            {/* <Button href={`/events/${_id}`}>Go to event page</Button> */}
          </Modal.Footer>
        </Modal>
      </Card>
    );
  }
}

Event.propTypes = {
  id: PropTypes.string,
  comingSoon: PropTypes.bool,
  title: PropTypes.string,
  brief: PropTypes.string,
  location: PropTypes.string,
  dateTime: PropTypes.instanceOf(Date),
  description: PropTypes.string,
  photos: PropTypes.arrayOf(PropTypes.string),
  feedback: PropTypes.arrayOf(PropTypes.string),
  creator: PropTypes.string,
  rating: PropTypes.number,
  isLoading: PropTypes.bool
};

export default Event;