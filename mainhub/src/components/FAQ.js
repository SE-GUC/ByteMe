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

class FAQ extends Component {
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
      editedFAQ: {},
      canEdit: props.canEdit
    };
  }
  render() {
    const { id, Question, Answer } = this.props;

    return (
      <div>
        <Tab.Container id="faq-tab-container">
          <ListGroup.Item action href="#answer" variant="warning">
            {Question}

            {<Tab.Pane eventKey="#answer">{Answer}</Tab.Pane>}
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
        <Modal
          show={this.state.showDeleteConfirmation}
          onHide={this.handleDeleteClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete FAQ?</Modal.Title>
          </Modal.Header>
          <Modal.Body>You're DELETING this FAQ! are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleDeleteClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => this.deleteFAQ(id)}>
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
            <Modal.Title>Update FAQ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Question */}
            <InputGroup className="mb-3">
              <FormControl
                name="Question"
                onChange={this.change}
                placeholder="Question"
                aria-label="Question"
                defaultValue={Question}
              />
            </InputGroup>
            {/* Answer */}
            <InputGroup className="mb-3">
              <FormControl
                name="Answer"
                onChange={this.change}
                placeholder="Answer"
                aria-label="Answer"
                defaultValue={Answer}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleEditClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => this.editFAQ(id, this.state.editedFAQ)}
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
  deleteFAQ(id) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`faq/${id}`, { headers }).then(res => {
        this.props.updateFAQs();
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
    const editedFAQ = this.state.editedFAQ;
    const name = event.target.name;
    editedFAQ[name] = event.target.value;
    this.setState({ editedFAQ: editedFAQ });
  };

  editFAQ(id, editedFAQ) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.put(`faq/${id}`, editedFAQ, { headers }).then(res => {
        this.props.updateFAQs();
        this.setState({ isLoading: false });
        this.handleEditClose();
        console.log(res.data);
      });
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

FAQ.propTypes = {
  Question: PropTypes.string,
  Answer: PropTypes.string
};

export default FAQ;
