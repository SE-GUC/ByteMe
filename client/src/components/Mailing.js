import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Mailing.css";
import { ListGroup, Tab, Button, Modal, Spinner } from "react-bootstrap";
import iconDelete from "../icons/x.svg";
import API from "../utils/API";
import Auth from "../utils/Auth";

class Mailing extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDeleteShow = this.handleDeleteShow.bind(this);
    this.handleDeleteClose = this.handleDeleteClose.bind(this);
    this.state = {
      isLoading: false,
      showDeleteConfirmation: false
    };
  }
  render() {
    const { id, email } = this.props;

    return (
      <div>
        <div className="contain">
          <Tab.Container id="tab-container">
            <ListGroup.Item variant="warning">
              {email}
              <Button
                variant="danger"
                className="delete-button"
                onClick={this.handleDeleteShow}
              >
                <img src={iconDelete} alt="delete" />
              </Button>
            </ListGroup.Item>
          </Tab.Container>
        </div>
        {/* DELETE MODAL */}
        <Modal
          show={this.state.showDeleteConfirmation}
          onHide={this.handleDeleteClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete this Email?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You're about to delete this Email! Do you want to proceed?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleDeleteClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => this.deleteEmail(id)}>
              {this.state.isLoading ? <Spinner animation="border" /> : "Yes"}
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
  deleteEmail(id) {
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`mailing_list/${id}`, { headers }).then(res => {
        this.props.updateMail();
        this.setState({ isLoading: false });
        this.handleDeleteClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

Mailing.propTypes = {
  email: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Mailing;
