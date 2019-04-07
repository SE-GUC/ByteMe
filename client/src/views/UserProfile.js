import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Alert } from "react-bootstrap";

import User from "../components/User";

import API from "../utils/API";
import Auth from "../utils/Auth";

const queryString = require("query-string");

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      err: ""
    };
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  async componentWillReceiveProps(props) {
    this.setState({
      user: props.user,
      err: ""
    });

    const parsed = queryString.parse(this.props.location.search);
    if (parsed.gucid) {
      if (this.state.user && this.state.user.is_admin) {
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
    }
  }

  render() {
    return this.state.user ? (
      <User user={this.state.user} />
    ) : this.state.err !== "" ? (
      <Alert variant="danger"> {this.state.err} </Alert>
    ) : (
      <></>
    );
  }
}

export default withRouter(UserProfile);
