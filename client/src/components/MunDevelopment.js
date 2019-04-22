import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, Container } from "react-bootstrap";
import "./MunDevelopment.css";
import API from "../utils/API";
import Auth from "../utils/Auth";
import iconDelete from "../icons/x.svg";
import iconEdit from "../icons/pencil.svg";
class MunDevelopment extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      show1: false,
      show2: false,
      show3: false,
      user: this.props.user,
      isLoggedIn: this.props.isLoggedIn,
      brief: "",
      checked1: false,
      checked2: false,
      checked3: false
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleShow1 = this.handleShow1.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);

    this.handleShow3 = this.handleShow3.bind(this);
    this.handleClose3 = this.handleClose3.bind(this);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.update = this.update.bind(this);
  }
  handleUpdate = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async update(e) {
    e.preventDefault();
    this.setState({ show1: false });
    const { brief } = this.state;
    const token = Auth.getToken();

    await API.put(
      `mun_development/${this.props._id}`,
      {
        brief
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      window.location.replace(`/development`);
      this.setState({ isLoading: false });
    });
  }

  async delete(e) {
    e.preventDefault();
    this.setState({ show3: false });
    const token = Auth.getToken();
    await API.delete(`mun_development/${this.props._id}`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      window.location.replace("/development");
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

  handleClose3() {
    this.setState({ show3: false });
  }

  handleShow3() {
    this.setState({ show3: true });
  }

  render() {
    const { brief } = this.props;

    return (
      <div>
        <Container className="development-div">
          <div>
            <ul>
              <li>{brief}</li>
            </ul>
            {this.props.isLoggedIn &&
              (this.props.user.mun_role === "secretary_office" ||
              this.props.user.awg_admin === "mun" ? (
                <div className="dod">
                  <Button
                    variant="info"
                    className="buttonP"
                    onClick={this.handleShow1}
                  >
                    <img src={iconEdit} alt="Edit page" />
                  </Button>
                  <Button
                    variant="danger"
                    className="buttonP"
                    onClick={this.handleShow3}
                  >
                    <img src={iconDelete} alt="Delete page" />
                  </Button>
                </div>
              ) : null)}
          </div>
          <br />
          <br />
        </Container>
        <Modal show={this.state.show1} onHide={this.handleClose1} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Development</Modal.Title>
          </Modal.Header>
          <br />
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows="5"
              type="description"
              placeholder="Enter the new description"
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
        <Modal show={this.state.show3} onHide={this.handleClose3}>
          <Modal.Header closeButton>
            <Modal.Title>
              Are you sure you want to delete this point?
            </Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.delete(e)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <br />
      </div>
    );
  }
}

MunDevelopment.propTypes = {
  brief: PropTypes.string,
  url: PropTypes.string,
  isLoading: PropTypes.bool,
  _id: PropTypes.number
};

export default MunDevelopment;
