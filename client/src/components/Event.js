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
  Carousel,
  Spinner,
  Alert
} from "react-bootstrap";
import "./Event.css";
import Dropzone from "react-dropzone";
import iconDelete from "../icons/x.svg";
import iconEdit from "../icons/pencil.svg";
import uploaderDefaultImage from "../images/upload-icon.png";
import eventDefaultImage from "../images/event-icon.png";
import API from "../utils/API";
import Auth from "../utils/Auth";
import StarRatings from "react-star-ratings";

class Event extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleDeleteShow = this.handleDeleteShow.bind(this);
    this.handleDeleteClose = this.handleDeleteClose.bind(this);
    this.handleEditShow = this.handleEditShow.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      isLoading: false,
      showDeleteConfirmation: false,
      showEditWindow: false,
      editedEvent: {},
      canEdit: props.canEdit,
      newComment: ""
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    const {
      _id,
      comingSoon,
      title,
      brief,
      location,
      dateTime,
      description,
      photos,
      comments,
      rates,
      creator,
      rating
    } = this.props;

    console.log(comments + "coms")

    return (
      <div>
        <Card
          className="text-center"
          // bg="warning"
          text="white"
          style={{
            width: "18rem",
            backgroundColor: "#003255",
            margin: "10px",
            height: "35rem"
          }}
        >
          <Card.Header className="event-title">{title}</Card.Header>
          {this.state.canEdit ? (
            <>
              <Button
                variant="info"
                className="event-edit-button"
                onClick={this.handleEditShow}
              >
                <img src={iconEdit} alt="Edit event" />
              </Button>
              <Button
                variant="danger"
                className="event-delete-button"
                onClick={this.handleDeleteShow}
              >
                <img src={iconDelete} alt="Delete product" />
              </Button>
            </>
          ) : (
            <></>
          )}

          {photos.length === 0 ? (
            <div>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={eventDefaultImage}
                    alt="No Photos"
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          ) : (
            <div>
              <Carousel>
                {photos.map(p => (
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src={p.link}
                      alt="Event Photos"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          )}

          <Card.Body>
            <Card.Title className="event-brief">{brief}</Card.Title>
            <Card.Subtitle>
              {comingSoon ? (
                <p style={{ color: "#ffd700" }}>Coming Soon</p>
              ) : rating ? (
                <StarRatings
                  rating={rating}
                  starRatedColor="#ffd700"
                  starDimension="15px"
                  starSpacing="5px"
                  numberOfStars={5}
                  name="rating"
                />
              ) : (
                <p style={{ color: "#ffd700" }}>Not Rated</p>
              )}
            </Card.Subtitle>
            <Card.Text className="mb-2 text-muted">{description}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="secondary"
              className="event-button"
              onClick={this.handleShow}
            >
              View details
            </Button>
          </Card.Footer>

          <Modal show={this.state.show} onHide={this.handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Description</h4>
              <h5 style={{ color: "#003255" }}>{description}</h5>
              <h4>Location</h4>
              <h5>{location}</h5>
              <h4>Date</h4>
              <h5>{dateTime.toString().split("T")[0]}</h5>
              <h4>Time</h4>
              <h5>{dateTime.toString().split("T")[1]}</h5>
              <h4>Creator</h4>
              <h5>{creator}</h5>

              {comingSoon ? (
                <></>
              ) : (
                <>
                  <h4>Event Feedback</h4>
                  {comments && comments.length === 0 ? (
                    <h5>No feedback</h5>
                  ) : (
                    <>
                      {comments.map(c => (
                        <h5>{c.comment}</h5>
                      ))}
                    </>
                  )}
                  <h4>Rate Event</h4>
                  <h5>
                    <ButtonGroup className="mr-2" aria-label="First group">
                      <Button onClick={() => this.rateOne(_id)}>1</Button>
                      <Button onClick={() => this.rateTwo(_id)}>2</Button>
                      <Button onClick={() => this.rateThree(_id)}>3</Button>
                      <Button onClick={() => this.rateFour(_id)}>4</Button>
                      <Button onClick={() => this.rateFive(_id)}> 5</Button>
                    </ButtonGroup>
                  </h5>
                  <h4>Add Feedback</h4>
                  <InputGroup className="mb-3">
                    <FormControl
                      name="writeComment"
                      onChange={this.changeComment}
                      placeholder="Your feedback"
                      aria-label="Your feedback"
                      aria-describedby="basic-addon2"
                    />
                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          this.commentEvent(_id, this.state.newComment)
                        }
                      >
                        Submit
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                {this.state.isLoading ? (
                  <Spinner animation="border" />
                ) : (
                  "Close"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </Card>

        {/* DELETE MODAL */}
        <Modal
          show={this.state.showDeleteConfirmation}
          onHide={this.handleDeleteClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Event?</Modal.Title>
          </Modal.Header>
          <Modal.Body>You're DELETING this event! are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleDeleteClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => this.deleteEvent(_id)}>
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "I know what i'm doing"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
        {/* EDIT MODAL */}
        <Modal
          show={this.state.showEditWindow}
          onHide={this.handleEditClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* image */}
            {/* <Dropzone
              onDrop={acceptedFiles => this.pictureUploader(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <img
                      className="event-picture-picker"
                      src={
                        this.state.editedPhotos.photos
                          ? this.state.editedPhotos.photos
                          : uploaderDefaultImage
                      }
                      alt="Event"
                    />
                  </div>
                </section>
              )}
            </Dropzone> */}
            {/* Title */}
            <h6>Event Title</h6>
            <InputGroup className="mb-3">
              <FormControl
                name="title"
                onChange={this.change}
                placeholder="Event Title"
                aria-label="Event Title"
                defaultValue={title}
              />
            </InputGroup>
            {/* brief */}
            <h6>Event Brief</h6>
            <InputGroup className="mb-3">
              <FormControl
                name="brief"
                onChange={this.change}
                placeholder="Event brief"
                aria-label="Event brief"
                defaultValue={brief}
              />
            </InputGroup>
            {/* location */}
            <h6>Event Location</h6>
            <InputGroup className="mb-3">
              <FormControl
                name="location"
                onChange={this.change}
                placeholder="Event location"
                aria-label="Event location"
                defaultValue={location}
              />
            </InputGroup>

            {/* dateTime */}
            <h6>Event Timing</h6>
            <InputGroup className="mb-3">
              <FormControl
                name="dateTime"
                onChange={this.change}
                placeholder="Event Timing"
                aria-label="Event Timing"
                defaultValue={dateTime}
              />
            </InputGroup>

            {/* description */}
            <h6>Event Description</h6>
            <InputGroup className="mb-3">
              <FormControl
                name="description"
                onChange={this.change}
                as="textarea"
                rows="4"
                placeholder="Event Description"
                aria-label="Event Description"
                defaultValue={description}
              />
            </InputGroup>

            {/* creator */}
            <h6>Event Creator</h6>
            <InputGroup className="mb-3">
              <FormControl
                name="creator"
                onChange={this.change}
                placeholder="Event Creator"
                aria-label="Event Creator"
                defaultValue={creator}
              />
            </InputGroup>
            {/* feedback */}
            <h6>Event Feedback</h6>
            {comments.length === 0 ? (
              <h6>No feedback</h6>
            ) : (
              <>
                {comments.map(c => (
                  <h6>
                    {c.comment}{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      // className="event-delete-button"
                      onClick={() => this.deleteComment(_id, c._id)}
                    >
                      Delete Comment
                    </Button>
                  </h6>
                ))}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleEditClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => this.editEvent(_id, this.state.editedEvent)}
            >
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  handleDeleteClose() {
    this.setState({ showDeleteConfirmation: false });
  }
  handleDeleteShow() {
    this.setState({ showDeleteConfirmation: true });
  }
  deleteEvent(_id) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`events/${_id}`, { headers }).then(res => {
        this.props.updateEvents();
        this.setState({ isLoading: false });
        this.handleDeleteClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  deleteComment(event_id, comment_id) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`events/${event_id}/${comment_id}/deletecomment`, {
        headers
      }).then(res => {
        this.setState({ isLoading: false });
        this.handleEditClose();
        this.props.updateEvents();
        // this.handleDeleteClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  commentEvent(_id, newComment) {
    try {
      this.setState({ isLoading: true });
      API.post(`events/${_id}/addcomment`, { comment: newComment }).then(
        res => {
          this.setState({ isLoading: false });
          this.handleClose();
          this.props.updateEvents();
        }
      );
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleEditClose() {
    this.setState({ showEditWindow: false });
  }
  handleEditShow() {
    this.setState({ showEditWindow: true });
  }
  change = event => {
    const editedEvent = this.state.editedEvent;
    const name = event.target.name;
    editedEvent[name] = event.target.value;
    this.setState({ editedEvent: editedEvent });
  };
  changeComment = event => {
    this.setState({ newComment: event.target.value });
  };
  pictureUploader = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const editedEvent = this.state.editedEvent;
      editedEvent.photos = reader.result;
      this.setState({ editedEvent: editedEvent });
    };
    reader.onerror = error => {
      console.log("Error uploading image: ", error);
    };
  };
  rateOne(_id) {
    try {
      this.setState({ isLoading: true });
      API.post(`events/${_id}/addrate`, { rate: 1 }).then(res => {
        this.handleClose();
        this.props.updateEvents();
        this.setState({ isLoading: false });
        // return (
        //   <Alert variant="success">You rated this event with 1 star</Alert>
        // );
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  rateTwo(_id) {
    try {
      this.setState({ isLoading: true });
      API.post(`events/${_id}/addrate`, { rate: 2 }).then(res => {
        this.handleClose();
        this.props.updateEvents();
        this.setState({ isLoading: false });
        // return (
        //   <Alert variant="success">You rated this event with 1 star</Alert>
        // );
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  rateThree(_id) {
    try {
      this.setState({ isLoading: true });
      API.post(`events/${_id}/addrate`, { rate: 3 }).then(res => {
        this.handleClose();
        this.props.updateEvents();
        this.setState({ isLoading: false });
        // return (
        //   <Alert variant="success">You rated this event with 1 star</Alert>
        // );
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  rateFour(_id) {
    try {
      this.setState({ isLoading: true });
      API.post(`events/${_id}/addrate`, { rate: 4 }).then(res => {
        this.handleClose();
        this.props.updateEvents();
        this.setState({ isLoading: false });
        // return (
        //   <Alert variant="success">You rated this event with 1 star</Alert>
        // );
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  rateFive(_id) {
    try {
      this.setState({ isLoading: true });
      API.post(`events/${_id}/addrate`, { rate: 5 }).then(res => {
        this.handleClose();
        this.props.updateEvents();
        this.setState({ isLoading: false });
        // return (
        //   <Alert variant="success">You rated this event with 1 star</Alert>
        // );
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  editEvent(_id, editedEvent) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.put(`events/${_id}`, editedEvent, { headers }).then(res => {
        this.props.updateEvents();
        this.setState({ isLoading: false });
        this.handleEditClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  async componentWillReceiveProps(props) {
    this.setState({ canEdit: props.canEdit });
  }
}

Event.propTypes = {
  _id: PropTypes.string,
  comingSoon: PropTypes.bool,
  title: PropTypes.string,
  brief: PropTypes.string,
  location: PropTypes.string,
  dateTime: PropTypes.instanceOf(Date),
  description: PropTypes.string,
  photos: PropTypes.arrayOf(PropTypes.string),
  comments: PropTypes.arrayOf(PropTypes.string),
  rates: PropTypes.arrayOf(PropTypes.number),
  creator: PropTypes.string,
  rating: PropTypes.number,
  isLoading: PropTypes.bool
};

export default Event;
