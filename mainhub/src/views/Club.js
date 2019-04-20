import React, { Component } from "react";
import AWG from "../components/AWG";
import "./Club.css";
import API from "../utils/API";
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner
} from "react-bootstrap";
// import uploaderDefaultImage from "../../../client/src/images/upload-icon.png";
import Dropzone from "react-dropzone";
import Auth from "../utils/Auth";
// First we create our class
class Club extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    // Next we establish our state

    this.updateClub = this.updateClub.bind(this);
    this.handleCreateShow = this.handleCreateShow.bind(this);
    this.handleCreateClose = this.handleCreateClose.bind(this);
    this.change = this.change.bind(this);
    this.pictureUploader = this.pictureUploader.bind(this);
    this.state = {
      isLoading: true,
      clubs: [],
      user: props.user,
      canEdit: false,
      showAddClubWindow: false,
      newClub: {}
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
        <h1 style={{ margin: "15px" }}>AWGs</h1>
        <div className="clubs">
          <div className="clubs-group">
            {this.state.canEdit ? (
              <Button
                variant="warning"
                className="club-create-button"
                onClick={this.handleCreateShow}
              >
                Add Club
                {/* <img src={iconAdd} alt="Add club" /> */}
              </Button>
            ) : (
              <></>
            )}
            {this.state.clubs.map(A => (
              <AWG
                id={A._id}
                name={A.name}
                description={A.description}
                banner={A.banner}
                link={A.link}
                updateClub={this.updateClub}
                canEdit={this.state.canEdit}
              />
            ))}
          </div>
        </div>
        {/* CREATE MODAL */}
        <Modal
          show={this.state.showAddClubWindow}
          onHide={this.handleCreateClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a Club to the hub</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* image */}
            <Dropzone
              onDrop={acceptedFiles => this.pictureUploader(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <img
                      className="club-picture-picker"
                      src={
                        this.state.newClub.banner
                          ? this.state.newClub.banner
                          : "No Image"
                      }
                      alt="Club"
                    />
                  </div>
                </section>
              )}
            </Dropzone>
            {/* name */}
            <InputGroup className="mb-3">
              <FormControl
                name="name"
                onChange={this.change}
                placeholder="Club Name"
                aria-label="Club Name"
              />
            </InputGroup>

            {/* description */}
            <InputGroup className="mb-3">
              <FormControl
                name="description"
                onChange={this.change}
                as="textarea"
                rows="2"
                placeholder="Club description"
                aria-label="Club description"
              />
            </InputGroup>
            {/* price */}
            <InputGroup className="mb-3">
              <FormControl
                name="link"
                onChange={this.change}
                placeholder="Club link"
                aria-label="Club link"
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCreateClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => this.createClub(this.state.newClub)}
            >
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "Add Club"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  async componentDidMount() {
    this.updateClub();
  }
  async componentWillReceiveProps(props) {
    this.setState({ user: props.user });
    if (this.state.user) {
      if (this.state.user.is_admin) {
        this.setState({ canEdit: true });
      }
    }
  }
  updateClub() {
    try {
      this.setState({ isLoading: true });
      API.get("clubs").then(res => {
        this.setState({ clubs: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleCreateClose() {
    this.setState({ showAddClubWindow: false });
  }
  handleCreateShow() {
    this.setState({ showAddClubWindow: true });
  }
  change = e => {
    const newClub = this.state.newClub;
    const name = e.target.name;
    newClub[name] = e.target.value;
    this.setState({ newClub: newClub });
  };
  pictureUploader = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const newClub = this.state.newClub;
      newClub.banner = reader.result;
      this.setState({ newClub: newClub });
    };
    reader.onerror = error => {
      console.log("Error uploading image: ", error);
    };
  };
  createClub(newClub) {
    this.setState({ isLoading: true });
    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.post("clubs", newClub, { headers }).then(res => {
        this.updateClub();
        this.setState({ isLoading: false });
        this.handleCreateClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Club;
