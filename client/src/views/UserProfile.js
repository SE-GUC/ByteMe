import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Alert } from "react-bootstrap";

import User from "../components/User";
import MiniUser from "../components/MiniUser";


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
            console.log("here")
            this.setState({ user: res.data.data, err: "" });
            console.log(this.state.user)
          })
          .catch(err => {
            if (err.response)
              this.setState({ err: err.response.error, user: undefined });
            else this.setState({ err: err.message, user: undefined });
          });
      } else {
        API.get(`/users/${parsed.gucid}`)
          .then(res => {
            console.log(res.data)
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
      <User user={this.state.user} />
    ) : (
          <></>
        );
  }
}

export default withRouter(UserProfile);
