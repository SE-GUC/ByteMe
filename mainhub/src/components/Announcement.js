import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ListGroup,
  Tab,
  Button,
  Modal,
  FormControl,
  Spinner,
  InputGroup
} from "react-bootstrap";
import API from "../utils/API";
import Auth from "../utils/Auth";
class Announcement extends Component {
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
      editedAnnouncement: {},
      canEdit: props.canEdit
    };
  }
  render() {
    const { id, date, info } = this.props;

    return (
      <div>
        <Tab.Container id="faq-tab-container">
          <ListGroup.Item action href="#answer" variant="warning">
            {info}

            {
              <Tab.Pane eventKey="#answer">
                {/* <Sonnet /> */}
                {date}
              </Tab.Pane>
            }
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
          </ListGroup.Item>
        </Tab.Container>
        {/* DELETE MODAL */}
        <Modal
          show={this.state.showDeleteConfirmation}
          onHide={this.handleDeleteClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Announcement?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You're DELETING this announcement! are you sure?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleDeleteClose}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => this.deleteAnnouncement(id)}
            >
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
            <Modal.Title>Update announcement</Modal.Title>
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
                defaultValue={info}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleEditClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() =>
                this.editAnnouncement(id, this.state.editedAnnouncement)
              }
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
  deleteAnnouncement(id) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`announcements/${id}`, { headers }).then(res => {
        this.props.updateAnnouncements();
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
    const editedAnnouncement = this.state.editedAnnouncement;
    const name = event.target.name;
    editedAnnouncement[name] = event.target.value;
    this.setState({ editedAnnouncement: editedAnnouncement });
  };

  editAnnouncement(id, editedAnnouncement) {
    try {
      this.setState({ isLoading: true });
      const editedAnnouncement = this.state.editedAnnouncement;

      editedAnnouncement["date"] = Date.now();
      this.setState({ editedAnnouncement: editedAnnouncement });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.put(`announcements/${id}`, editedAnnouncement, { headers }).then(
        res => {
          this.props.updateAnnouncements();
          this.setState({ isLoading: false });
          this.handleEditClose();
        }
      );
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  async componentWillReceiveProps(props) {
    this.setState({
      canEdit: props.canEdit
    });
  }
}

Announcement.propTypes = {
  date: PropTypes.instanceOf(Date),
  info: PropTypes.string
};

export default Announcement;
