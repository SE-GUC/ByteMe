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
      requestSave: false
    };

    this.edit = () => {
      this.setState({ isEditing: true })
    }

    this.requestSave = () => {
      this.setState({ requestSave: true })
    }

    this.save = () => {
      this.setState({ requestSave: false, isEditing: false })
    }

    this.delete = () => {
      //display warning then delete user
    }
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
      })
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
            if (err.response)
              this.setState({ err: err.response.error, user: undefined });
            else this.setState({ err: err.message, user: undefined });
          });
      } else {
        API.get(`/users/${parsed.gucid}`)
          .then(res => {
            this.setState({ user: res.data.data, err: "" });
          })
          .catch(err => {
            if (err.response)
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
      ((this.props.user && (this.props.user.is_admin || this.props.user.guc_id === this.state.user.guc_id)) ?
        <>
          <User user={this.state.user} isEditing={this.state.isEditing} requestSave={this.state.requestSave} save={this.save} />
          <Form.Row className="profile-row">
            <Col></Col>
            <Col xs="1" className="profile-col">{this.state.isEditing ? <Button block variant="outline-warning" onClick={this.requestSave}>Save</Button> : <Button block variant="outline-warning" onClick={this.edit}>Edit</Button>}</Col>
            <Col xs="1" className="profile-col"><Button block variant="outline-danger" onClick={this.delete}>Delete</Button></Col>
          </Form.Row>

        </> :
        <User user={this.state.user} />
      )
    ) : (
          <></>
        );
  }
}

export default withRouter(UserProfile);
