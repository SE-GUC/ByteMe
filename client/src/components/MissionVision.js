import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form } from "react-bootstrap";
import "./MissionVision.css";
import API from "../utils/API";
import Auth from "../utils/Auth";
import iconEdit from "../icons/pencil.svg";
class MissionVision extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,

      user: this.props.user,
      isLoggedIn: this.props.isLoggedIn,
      brief: ""
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleShow1 = this.handleShow1.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.update = this.update.bind(this);
  }
  handleUpdate = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async update(e, url) {
    e.preventDefault();
    this.setState({ show1: false });
    const { brief } = this.state;
    const token = Auth.getToken();

    await API.put(
      `mission_vision/${this.props._id}`,
      {
        brief
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      window.location.replace(`/aboutus`);
      this.setState({ isLoading: false });
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClose1() {
    this.setState({ show1: false });
  }

  handleShow1() {
    this.setState({ show1: true });
  }
  async componentWillReceiveProps(props) {
    if (props.requestUser) {
      this.props.setUser(this.state.editedUser);
    }
    this.setState({
      user: props.user,
      isLoggedIn: props.isLoggedIn
    });
  }

  render() {
    const { brief } = this.props;

    return (
      <div>
        {this.props.isLoggedIn &&
          (this.props.user.mun_role === "secretary_office" ||
          this.props.user.awg_admin === "mun" ? (
            <div className="dod">
              <Button
                variant="warning"
                className="club-create-button"
                onClick={this.handleShow1}
              >
                <img src={iconEdit} alt="Edit page" />
              </Button>
            </div>
          ) : null)}
        <div className="brief-p">
          {brief}
          <Modal show={this.state.show1} onHide={this.handleClose1}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Mission&Vision</Modal.Title>
            </Modal.Header>
            <br />
            <Form.Group controlId="editedPage">
              <Form.Label>Description</Form.Label>
              <br />
              <Form.Control
                type="name"
                placeholder="Enter the new description "
                defaultValue={brief}
                onChange={e => this.setState({ brief: e.target.value })}
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={e => this.update(e)}>
                Edit
              </Button>
            </Modal.Footer>
          </Modal>
          <br />
        </div>
      </div>
    );
  }
}

MissionVision.propTypes = {
  brief: PropTypes.string,
  isLoading: PropTypes.bool,
  _id: PropTypes.number
};

export default MissionVision;
