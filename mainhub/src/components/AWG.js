import React, { Component } from "react";
import PropTypes from "prop-types";
import "./AWG.css";
import {
  Card,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner
} from "react-bootstrap";
import Dropzone from "react-dropzone";
import uploaderDefaultImage from "../images/upload-icon.png";
import productDefaultImage from "../images/club.png";
import API from "../utils/API";
import Auth from "../utils/Auth";

class AWG extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleDeleteShow = this.handleDeleteShow.bind(this);
    this.handleDeleteClose = this.handleDeleteClose.bind(this);
    this.handleEditShow = this.handleEditShow.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.state = {
      isLoading: false,
      showDeleteConfirmation: false,
      showEditWindow: false,
      editedClub: {},
      canEdit: props.canEdit
    };
  }
  render() {
    const { id, name, description, banner, link } = this.props;

    return (
      <div>
        <Card
          border="warning"
          style={{
            width: "35rem",
            // heiht: "50",
            margin: "10px"
          }}
        >
          <Card.Img
            variant="top"
            className="d-block w-100"
            src={banner !== "false" ? banner : productDefaultImage}
            height="150rem"
          />

          <Card.Title>{name}</Card.Title>
          <Card.Subtitle>{description}</Card.Subtitle>
          {/* <ul>
            <li>
              <a href={link}>Visit us</a>
              {""}
            </li>
          </ul> */}
          <Card.Footer>
            <Card.Link href={link}>Visit US</Card.Link>
            {this.state.canEdit ? (
              <>
                <Button variant="dark" onClick={this.handleEditShow}>
                  Edit
                </Button>
                <Button variant="danger" onClick={this.handleDeleteShow}>
                  Delete
                </Button>
              </>
            ) : (
              <></>
            )}
          </Card.Footer>
        </Card>
        {/* DELETE MODAL */}
        <Modal
          show={this.state.showDeleteConfirmation}
          onHide={this.handleDeleteClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Club?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You're about to delete this Club! Do you want to proceed?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleDeleteClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => this.deleteClub(id)}>
              {this.state.isLoading ? <Spinner animation="border" /> : "Yes"}
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
            <Modal.Title>Update this Club </Modal.Title>
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
                        this.state.editedClub.banner
                          ? this.state.editedClub.banner
                          : uploaderDefaultImage
                      }
                      alt="Product"
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
                defaultValue={name}
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
                defaultValue={description}
              />
            </InputGroup>
            {/* link */}
            <InputGroup className="mb-3">
              <FormControl
                name="link"
                onChange={this.change}
                placeholder="Club Link"
                aria-label="Club Link"
                defaultValue={link}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleEditClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => this.editClub(id, this.state.editedClub)}
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
  deleteClub(id) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`clubs/${id}`, { headers }).then(res => {
        this.props.updateClub();
        this.setState({ isLoading: false });
        this.handleDeleteClose();
      });
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
    const editedClub = this.state.editedClub;
    const name = event.target.name;
    editedClub[name] = event.target.value;
    this.setState({ editedClub: editedClub });
  };
  pictureUploader = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const editedClub = this.state.editedClub;
      editedClub.banner = reader.result;
      this.setState({ editedClub: editedClub });
    };
    reader.onerror = error => {
      console.log("Error uploading image: ", error);
    };
  };
  editClub(id, editedClub) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.put(`clubs/${id}`, editedClub, { headers }).then(res => {
        this.props.updateClub();
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

AWG.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  banner: PropTypes.string,
  link: PropTypes.string,
  isLoading: PropTypes.bool
};

export default AWG;
