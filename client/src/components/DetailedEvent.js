import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  ButtonGroup,
  InputGroup,
  FormControl,
  Carousel,
  CardDeck,
  Badge
} from "react-bootstrap";
import "./DetailedEvent.css";
// import "../App.css";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   withRouter
// } from "react-router-dom";
// import API from "../utils/API";

class DetailedEvent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false
    };
  }

  comingsoonOrRating(props) {
    const badge = props.comingSoon;
    if (badge) {
      return <Badge variant="success">Coming Soon</Badge>;
    }
    return <Badge variant="success">{props.rating} stars</Badge>;
  }

  render() {
    const {
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
      <CardDeck>
        <Carousel>
          {photos.map(p => (
            <Carousel.Item>
              <img className="d-block w-100" src={p.link} alt="No Photos" />
            </Carousel.Item>
          ))}
        </Carousel>
        <Card
          className="text-center"
          bg="warning"
          text="black"
          border="primary"
          style={{ width: "18rem" }}
        >
          <Card.Body>
            <h4>Description</h4>
            <p>{description}</p>
            <h4>Location</h4>
            <p>{location}</p>
            <h4>Timing</h4>
            <p>{dateTime}</p>
            <h4>Creator</h4>
            <p>{creator}</p>
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
          </Card.Body>
        </Card>
      </CardDeck>
    );
  }
}

Event.propTypes = {
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

export default DetailedEvent;
