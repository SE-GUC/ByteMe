import React, { Component } from "react";
import MunDevelopment from "../components/MunDevelopment";
import "./MunDev.css";
import API from "../utils/API";
import Auth from "../utils/Auth";
import iconAdd from "../icons/plus.svg";
import { Button, Modal, Form } from "react-bootstrap";

// First we create our class
class MunDev extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    this.updateDev = this.updateDev.bind(this);
    // Next we establish our state
    this.state = {
      show: false,
      isLoading: true,
      devs: [],
      brief: ""
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleAdd = this.handleAdd.bind(this);
    this.add = this.add.bind(this);
  }

  handleAdd = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async add(e) {
    e.preventDefault();
    this.setState({ show2: false });
    const { brief } = this.state;
    const token = Auth.getToken();
    const addedPhoto = await API.post(
      `mun_development/`,
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

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <h1 style={{ color: "black", fontFamily: "GothamBook" }}>
          {" "}
          OUR DEVELOPMENT {this.props.isLoggedIn &&
          (this.props.user.mun_role === "secretary_office" ||
          this.props.user.awg_admin === "mun" ? (
            <Button
              className="club-create-button"
              variant="link"
              onClick={this.handleShow}
            >
              <img src={iconAdd} alt="Add new Member" />
            </Button>
          ) : null)}
        </h1>
      
        {this.state.devs.map(dev => (
          <MunDevelopment
            isLoggedIn={this.props.isLoggedIn}
            user={this.props.user}
            loc={this.props.location}
            logout={this.props.logout}
            brief={dev.brief}
            _id={dev._id}
            updateDev={this.updateDev}
          />
        ))}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Development</Modal.Title>
          </Modal.Header>
          <br />
          <Form.Group controlId="editedPage">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows="10"
              type="description"
              placeholder="Enter description"
              value={this.state.description}
              onChange={e => this.setState({ brief: e.target.value })}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.add(e)}>
              ADD
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  async componentDidMount() {
    this.updateDev();
  }

  updateDev() {
    try {
      this.setState({ isLoading: true });

      API.get(`mun_development`).then(res => {
        this.setState({ devs: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default MunDev;
