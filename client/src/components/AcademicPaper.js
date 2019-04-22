import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  Modal,
  FormControl,
  Spinner,
  InputGroup
} from "react-bootstrap";
import API from "../utils/API";
import Auth from "../utils/Auth";
import iconDelete from "../icons/x.svg";
import iconEdit from "../icons/pencil.svg";
import "./AcademicPaper.css";

class AcademicPaper extends Component {
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
      editedPaper: {},
      canEdit: props.canEdit
    };
  }
  render() {
    const { id, name, date, year, link } = this.props;

    return (
      <div>
        <Card
          className="text-center"
          border="primary"
          style={{ width: "18rem" }}
        >
          {this.state.canEdit ? (
            <>
              <Button
                variant="info"
                className="paper-edit-button"
                onClick={this.handleEditShow}
              >
                <img src={iconEdit} alt="Edit paper" />
              </Button>
              <Button
                variant="danger"
                className="paper-delete-button"
                onClick={this.handleDeleteShow}
              >
                <img src={iconDelete} alt="Delete paper" />
              </Button>
            </>
          ) : (
            <></>
          )}
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{year}</Card.Subtitle>

            <Card.Footer>
              {" "}
              <a href={link} target="_blank" rel="noopener noreferrer">
                View Academic Paper
              </a>
            </Card.Footer>
          </Card.Body>
        </Card>
        {/* DELETE MODAL */}
        <Modal
          show={this.state.showDeleteConfirmation}
          onHide={this.handleDeleteClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Paper?</Modal.Title>
          </Modal.Header>
          <Modal.Body>You're DELETING this paper! are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleDeleteClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => this.deletePaper(id)}>
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
            <Modal.Title>Update a paper</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* name */}
            <InputGroup className="mb-3">
              <FormControl
                name="name"
                onChange={this.change}
                placeholder="Paper Name"
                aria-label="Paper Name"
                defaultValue={name}
              />
            </InputGroup>
            {/* date */}
            <InputGroup className="mb-3">
              <FormControl
                name="date"
                type="date"
                onChange={this.change}
                placeholder="Paper Price"
                aria-label="Paper Price"
                defaultValue={date}
              />
            </InputGroup>
            {/* link */}
            <InputGroup className="mb-3">
              <FormControl
                name="link"
                onChange={this.change}
                placeholder="Paper link"
                aria-label="Paper link"
                autoComplete="off"
                value={link}
              />
            </InputGroup>
            {/* year */}
            <InputGroup className="mb-3">
              <FormControl
                name="year"
                onChange={this.change}
                placeholder="Paper year"
                aria-label="Paper year"
                autoComplete="off"
                value={year}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleEditClose}>
              Close
            </Button>
            <Button variant="success" onClick={() => this.editPaper(id)}>
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
  deletePaper(id) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`library/${id}`, { headers }).then(res => {
        this.props.updatePapers();
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
    const editedPaper = this.state.editedPaper;
    const name = event.target.name;
    editedPaper[name] = event.target.value;
    this.setState({ editedPaper: editedPaper });
  };

  editPaper(id) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.put(`library/${id}`, this.state.editedPaper, { headers }).then(
        res => {
          this.props.updatePapers();
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

Event.propTypes = {
  name: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  link: PropTypes.string,
  year: PropTypes.number
};

export default AcademicPaper;
