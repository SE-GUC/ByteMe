import React, { Component } from "react";
import Announcement from "../components/Announcement";
import "./Announcements.css";
import API from "../utils/API";
import {
  ListGroup,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner,
  Form
} from "react-bootstrap";
import Auth from "../utils/Auth";
import iconAdd from "../icons/plus.svg";
// First we create our class
class Announcements extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    this.updateAnnouncements = this.updateAnnouncements.bind(this);
    this.handleCreateShow = this.handleCreateShow.bind(this);
    this.handleCreateClose = this.handleCreateClose.bind(this);
    this.change = this.change.bind(this);
    // Next we establish our state
    this.state = {
      isLoading: true,
      announcements: [],
      user: props.user,
      canEdit: false,
      showAddAnnouncementWindow: false,
      newAnnouncement: {}
    };
    if (this.state.user) {
      if (this.state.user.is_admin) {
        this.state.canEdit = true;
      }
    }
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <announcements>
          <h1>
            Announcements{" "}
            {this.state.isLoading ? <Spinner animation="border" /> : ""}
          </h1>
          {this.state.canEdit ? (
            <Button variant="warning"  onClick={this.handleCreateShow}>
             Add Announcement </Button>
          ) : (
            <></>
          )} 
          <ListGroup>
            {this.state.announcements.map(announcement => (
              <Announcement
                id={announcement._id}
                date={announcement.date}
                info={announcement.info}
                updateAnnouncements={this.updateAnnouncements}
                canEdit={this.state.canEdit}
              />
            ))}
          </ListGroup>
        </announcements>
        <Modal
          show={this.state.showAddAnnouncementWindow}
          onHide={this.handleCreateClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a new announcement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* info */}
            <InputGroup className="mb-3">
              <FormControl
                name="info"
                onChange={this.change}
                as="textarea"
                rows="4"
                placeholder="Announcement info"
                aria-label="Announcement info"
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
                this.createAnnouncement(this.state.newAnnouncement)
              }
            >
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "Add Announcement"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    this.updateAnnouncements();
  }
  async componentWillReceiveProps(props) {
    this.setState({ user: props.user });
    if (this.state.user) {
      if (this.state.user.is_admin) {
        this.setState({ canEdit: true });
      }
    }
  }
  updateAnnouncements() {
    try {
      API.get("announcements").then(res => {
        this.setState({ announcements: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleCreateClose() {
    this.setState({ showAddAnnouncementWindow: false });
  }
  handleCreateShow() {
    this.setState({ showAddAnnouncementWindow: true });
  }
  change = event => {
    const newAnnouncement = this.state.newAnnouncement;
    const name = event.target.name;

    newAnnouncement[name] = event.target.value;
    this.setState({ newAnnouncement: newAnnouncement });
  };

  createAnnouncement(announcement) {
    this.setState({ isLoading: true });
    const newAnnouncement = this.state.newAnnouncement;

    newAnnouncement["date"] = Date.now();
    this.setState({ newAnnouncement: newAnnouncement });

    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.post(`announcements`, this.state.newAnnouncement, { headers }).then(
        res => {
          this.updateAnnouncements();
          this.setState({ isLoading: false });
          this.handleCreateClose();
        }
      );
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Announcements;
