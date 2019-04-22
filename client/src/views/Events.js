import React, { Component } from "react";
import Event from "../components/Event";
import "./Events.css";
import API from "../utils/API";
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner,
  CardDeck
} from "react-bootstrap";
import iconAdd from "../icons/plus.svg";
import uploaderDefaultImage from "../images/upload-icon.png";
import Dropzone from "react-dropzone";
import Auth from "../utils/Auth";

// First we create our class
class Events extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);

    this.updateEvents = this.updateEvents.bind(this);
    this.handleCreateShow = this.handleCreateShow.bind(this);
    this.handleCreateClose = this.handleCreateClose.bind(this);
    this.change = this.change.bind(this);
    this.pictureUploader = this.pictureUploader.bind(this);
    // Next we establish our state
    this.state = {
      isLoading: true,
      events: [],
      user: props.user,
      canEdit: false,
      showAddEventWindow: false,
      newEvent: {},
      newPhotos: [],
      newEventId: ""
    };
    if (this.state.user) {
      if (
        this.state.user.awg_admin === "mun" ||
        this.state.user.mun_role === "secretary_office"
      ) {
        this.state.canEdit = true;
      }
    }
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <h1 style={{ margin: "2%" }}>
          EVENTS {this.state.isLoading ? <Spinner animation="border" /> : ""}
        </h1>
        <div className="eventss">
          <CardDeck className="event-group">
            {this.state.canEdit ? (
              <Button
                variant="warning"
                className="event-create-button"
                onClick={this.handleCreateShow}
              >
                <img src={iconAdd} alt="Create new Event" />
              </Button>
            ) : (
              <></>
            )}

            {this.state.events.map(event => (
              <Event
                _id={event._id}
                comingSoon={event.comingSoon}
                title={event.title}
                brief={event.brief}
                location={event.location}
                dateTime={event.dateTime}
                description={event.description}
                photos={event.photos}
                comments={event.comments}
                rates={event.rates}
                creator={event.creator}
                rating={event.rating}
                updateEvents={this.updateEvents}
                canEdit={this.state.canEdit}
              />
            ))}
          </CardDeck>
        </div>

        <Modal
          show={this.state.showAddEventWindow}
          onHide={this.handleCreateClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a new event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* image */}
            <Dropzone
              onDrop={acceptedFiles =>
                acceptedFiles.forEach(a => this.pictureUploader(a))
              }
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <img
                      className="event-picture-picker"
                      src={
                        this.state.newPhotos.length === 0
                          ? uploaderDefaultImage
                          : this.state.newPhotos
                      }
                      alt="Event"
                    />
                  </div>
                </section>
              )}
            </Dropzone>
            {/* Title */}
            <InputGroup className="mb-3">
              <FormControl
                name="title"
                onChange={this.change}
                placeholder="Event title"
                aria-label="Event title"
                autoComplete="off"
              />
            </InputGroup>
            {/* Brief */}
            <InputGroup className="mb-3">
              <FormControl
                name="brief"
                onChange={this.change}
                placeholder="Event brief"
                aria-label="Event Brief"
                autoComplete="off"
              />
            </InputGroup>
            {/* location */}
            <InputGroup className="mb-3">
              <FormControl
                name="location"
                onChange={this.change}
                placeholder="Event location"
                aria-label="Event location"
                autoComplete="off"
              />
            </InputGroup>

            {/* dateTime */}
            <InputGroup className="mb-3">
              <FormControl
                name="dateTime"
                type="date"
                onChange={this.change}
                placeholder="Event Timing"
                aria-label="Event Timing"
                autoComplete="off"
              />
            </InputGroup>

            {/* description */}
            <InputGroup className="mb-3">
              <FormControl
                name="description"
                onChange={this.change}
                as="textarea"
                rows="4"
                placeholder="Event Description"
                aria-label="Event Description"
                autoComplete="off"
              />
            </InputGroup>

            {/* creator */}
            <InputGroup className="mb-3">
              <FormControl
                name="creator"
                onChange={this.change}
                placeholder="Event Creator"
                aria-label="Event Creator"
                autoComplete="off"
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCreateClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() =>
                this.createEvent(this.state.newEvent, this.state.newPhotos)
              }
            >
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "Add Events"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    this.updateEvents();
  }
  async componentWillReceiveProps(props) {
    this.setState({ user: props.user });
    if (this.state.user) {
      if (
        this.state.user.is_admin ||
        this.state.user.mun_role === "secretary_office"
      ) {
        this.setState({ canEdit: true });
      }
    }
  }
  updateEvents() {
    try {
      this.setState({ isLoading: true });
      API.get("events").then(res => {
        this.setState({ events: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleCreateClose() {
    this.setState({ showAddEventWindow: false });
  }
  handleCreateShow() {
    this.setState({ showAddEventWindow: true });
  }
  change = event => {
    const newEvent = this.state.newEvent;
    const name = event.target.name;
    newEvent[name] = event.target.value;
    this.setState({ newEvent: newEvent });
  };
  pictureUploader = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const newPhotos = this.state.newPhotos;
      newPhotos.push(reader.result);
      this.setState({ newPhotos: newPhotos });
    };
    reader.onerror = error => {
      console.log("Error uploading image: ", error);
    };
  };
  async createEvent(newEvent, newPhotos) {
    this.setState({ isLoading: true });
    const token = Auth.getToken();
    const headers = {
      Authorization: `${token}`
    };
    try {
      await API.post(`events/addevent`, newEvent, { headers }).then(res => {
        this.setState({ newEventId: res.data.data._id });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }

    try {
      newPhotos.map(
        async p =>
          await API.post(
            `events/${this.state.newEventId}/addphoto`,
            { link: `${p}` },
            {
              headers
            }
          )
      );
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }

    this.updateEvents();
    this.setState({ isLoading: false });
    this.handleCreateClose();
  }
}

export default Events;
