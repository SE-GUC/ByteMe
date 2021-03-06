import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Alert, Button, Form, Col } from "react-bootstrap";

import User from "../components/User";

import API from "../utils/API";
import Auth from "../utils/Auth";

import "./UserProfile.css";

const queryString = require("query-string");

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      err: "",
      isEditing: false,
      editingErr: "",
      message: "",
      otherLoading: false,
      requestUser: false,
      editLoading: false
    };

    this.edit = () => {
      this.setState({ isEditing: true });
    };

    this.requestUser = () => {
      this.setState({ requestUser: true });
    };

    this.save = editedUser => {
      this.setState({ requestUser: false, editLoading: true });
      if (editedUser.password === editedUser.confirm_password) {
        delete editedUser.confirm_password;

        const token = Auth.getToken();
        API.put(`users/${this.props.location.search}`, editedUser, {
          headers: {
            Authorization: token
          }
        })
          .then(res => {
            this.setState({
              requestUser: false,
              isEditing: false,
              editingErr: "",
              editLoading: false
            });
            this.props.login();
          })
          .catch(err => {
            console.log(err.response);
            if (err.response.data)
              this.setState({
                editingErr: err.response.data.error,
                editLoading: false
              });
            else {
              if (err.response.status === 413)
                this.setState({
                  editingErr:
                    "That image is too large, try an image that is below 5MB"
                });
              else
                this.setState({ editingErr: err.message, editLoading: false });
            }
          });
      } else {
        this.setState({
          editingErr: "Passwords Don't Match",
          editLoading: false
        });
      }
    };

    this.cancel = () => {
      this.setState({ requestUser: false, isEditing: false, editingErr: "" });
    };

    this.giveAdmin = () => {
      const token = Auth.getToken();
      const parsed = queryString.parse(this.props.location.search);
      this.setState({ otherLoading: true })
      API.put(`/users/giveAdmin`,
        { guc_id: parsed.gucid },
        {
          headers: {
            Authorization: token
          }
        })
        .then(res => {
          this.setState({ err: "", message: res.data.message, otherLoading: false })
        })
        .catch(err => {
          console.log(err.response);
          if (err.response.data)
            this.setState({ err: err.response.data.error, message: "", otherLoading: false });
          else this.setState({ err: err.message, message: "", otherLoading: false });
        });
    }

    this.forefitAdmin = () => {
      const token = Auth.getToken();
      this.setState({ otherLoading: true })
      API.put(`/users/forefitAdmin`, {},
        {
          headers: {
            Authorization: token
          }
        })
        .then(res => {
          this.setState({ err: "", message: res.data.message, otherLoading: false })
          this.props.login()
        })
        .catch(err => {
          console.log(err.response);
          if (err.response.data)
            this.setState({ err: err.response.data.error, message: "", otherLoading: false });
          else this.setState({ err: err.message, message: "", otherLoading: false });
        });
    }

    this.delete = () => {
      const prompts = [
        `Deleting ${
        this.props.location.search === "" ? "your" : "this"
        } profile is permanent. There is no going back!`,
        `This means ${
        this.props.location.search === "" ? "leaving" : "removing"
        } forever!`,
        "Are you absolutely 100% certain you want this?"
      ];
      const randInt = Math.floor(Math.random() * prompts.length);
      console.log(randInt);
      if (window.confirm(prompts[randInt])) {
        const token = Auth.getToken();
        API.delete(`users/${this.props.location.search}`, {
          headers: {
            Authorization: token
          }
        })
          .then(res => {
            if (this.props.location.search === "") {
              this.props.logout();
              //redirect to home
            } else {
              this.setState({ err: "Profile Deleted" });
            }
          })
          .catch(err => {
            console.log(err.response);
            if (err.response.data)
              this.setState({ editingErr: err.response.data.error });
            else this.setState({ editingErr: err.message });
          });
      }
    };
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  async componentWillReceiveProps(props) {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.gucid) {
      this.setState({
        user: undefined
      });
      if (this.props.user && this.props.user.is_admin) {
        const token = Auth.getToken();
        API.get(`/users/asAdmin/${parsed.gucid}`, {
          headers: {
            Authorization: token
          }
        })
          .then(res => {
            this.setState({ user: res.data.data, err: "" });
          })
          .catch(err => {
            if (err.response.data)
              this.setState({ err: err.response.data.error, user: undefined });
            else this.setState({ err: err.message, user: undefined });
          });
      } else {
        API.get(`/users/${parsed.gucid}`)
          .then(res => {
            console.log(res.data);
            this.setState({ user: res.data.data, err: "" });
          })
          .catch(err => {
            if (err.response.data)
              this.setState({
                err: err.response.data.error
                  ? err.response.data.error
                  : err.response.data.message,
                user: undefined
              });
            else this.setState({ err: err.message, user: undefined });
          });
      }
    } else {
      this.setState({
        user: props.user,
        err: ""
      });
    }
  }

  render() {
    return this.state.err !== "" ? (
      <Alert variant="danger"> {this.state.err} </Alert>
    ) : this.state.user ? (
      this.props.user &&
        (this.props.user.is_admin ||
          this.props.user.guc_id === this.state.user.guc_id) ? (
          <>
            {this.state.editingErr !== "" ? (
              <Alert variant="danger">{this.state.editingErr}</Alert>
            ) : (
                <></>
              )}
            {this.state.message !== "" ? (
              <Alert variant="info">{this.state.message}</Alert>
            ) : (
                <></>
              )}
            <User
              user={this.state.user}
              isEditing={this.state.isEditing}
              requestUser={this.state.requestUser}
              setUser={this.save}
            />

            <Form.Row className="profile-row">
              <Col />
              {this.state.isEditing ? (
                <Col xs="1" className="profile-col">
                  <Button block variant="outline-warning" onClick={this.cancel}>
                    Cancel
                </Button>
                </Col>
              ) : (
                  <></>
                )}

              <Col xs="1" className="profile-col">
                {this.state.isEditing ? (
                  this.state.editLoading ? (
                    // <img height="40" src={LoadingGif} alt="Loading" />
                    <p>Loading</p>
                  ) : (
                      <Button
                        block
                        variant="outline-warning"
                        onClick={this.requestUser}
                      >
                        Save
                  </Button>
                    )
                ) : (
                    <Button block variant="outline-warning" onClick={this.edit}>
                      Edit
                </Button>
                  )}
              </Col>
              <Col xs="1" className="profile-col">
                <Button block variant="outline-danger" onClick={this.delete}>
                  Delete
              </Button>
              </Col>
              <Col xs="0" className="profile-col">
                {this.props.user.is_admin ?
                  this.props.user.guc_id === this.state.user.guc_id ?
                    <Button block variant="outline-danger" onClick={this.forefitAdmin}>
                      {this.state.otherLoading ? "Forefitting ..." : "Forefit Admin"}
                    </Button>
                    : <Button block variant="outline-info" onClick={this.giveAdmin}>
                      {this.state.otherLoading ? "Giving ..." : "Give Admin"}
                    </Button>
                  : <></>
                }
              </Col>
            </Form.Row>

            {this.state.isEditing ? (
              <Alert variant="warning">
                Only edit fields you want changed! Fields left empty will stay as
                they are.
            </Alert>
            ) : (
                <></>
              )}
          </>
        ) : (
          <User user={this.state.user} />
        )
    ) : (
          <></>
        );
  }
}

export default withRouter(UserProfile);
