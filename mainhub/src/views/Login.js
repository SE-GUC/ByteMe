import React, { Component } from "react";
import { Form, Button, Alert, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import API from "../utils/API";
import Auth from "../utils/Auth";

import "../App.css";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
      message: "",
      forgotMessage: ""
    };

    this.routeCahnge = path => {
      this.props.history.push(path);
    };

    this.forgotPassword = () => {
      if (this.state.email === "")
        this.setState({
          error: "Please enter your email then click forgot password again."
        });
      else {
        API.put("users/forgotpass", { email: this.state.email })
          .then(res => {
            console.log(res);
            this.setState({
              error: "",
              forgotMessage: res.data.message,
              message: ""
            });
          })
          .catch(err => {
            if (err.response.data)
              this.setState({
                forgotMessage: "",
                error: err.response.data.message,
                message: ""
              });
            else
              this.setState({
                forgotMessage: "",
                error: err.message,
                message: ""
              });
          });
      }
    };

    this.login = () => {
      API.post("users/login", {
        email: this.state.email,
        password: this.state.password
      })
        .then(res => {
          this.setState({
            message: "Logged In!",
            error: ""
          });
          Auth.authenticateUser(res.data.data);
          this.props.login();
        })
        .catch(err => {
          console.log(err);
          this.setState({
            error: err.response ? err.response.data.error : err.message
          });
        });
    };

    this.changePassword = event => {
      this.setState({
        password: event.target.value
      });
    };
    this.changeEmail = event => {
      this.setState({
        email: event.target.value
      });
    };
  }
  render() {
    return (
      <div>
        {this.state.error ? (
          <Alert variant="danger">{this.state.error}</Alert>
        ) : this.state.message ? (
          <Alert variant="success">
            {this.state.message}{" "}
            <Link to="/profile" className="alert-link">
              Go To Profile.
            </Link>
          </Alert>
        ) : this.state.forgotMessage ? (
          <Alert variant="success">{this.state.forgotMessage} </Alert>
        ) : (
          <></>
        )}

        <Form className="login-form">
          <Form.Group>
            <Form.Row>
              <Col xs="1">
                <Form.Label className="login-label">Email</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  placeholder="Enter email"
                  onChange={this.changeEmail}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Col xs="1">
                <Form.Label className="login-label">Password</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={this.changePassword}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Col />
              <Col xs="0">
                <Button variant="primary" onClick={this.login}>
                  Login
                </Button>
              </Col>
              <Col xs="0">
                <Button
                  block
                  variant="outline-secondary"
                  onClick={this.forgotPassword}
                >
                  Forgot Password
                </Button>
              </Col>
            </Form.Row>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default Login;
