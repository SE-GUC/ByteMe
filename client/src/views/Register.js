import React, { Component } from "react";
import { Form, Button, Alert, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import API from "../utils/API";

import "../App.css";
import "./Register.css";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      passwordConfirm: "",
      first_name: "",
      last_name: "",
      birth_date: undefined,
      guc_id: "",
      is_private: false,

      error: "",
      message: ""
    };

    this.register = () => {
      if (this.state.password !== this.state.passwordConfirm)
        this.setState({
          error: "Passwords don't match"
        });
      else {
        API.post("users/register", {
          email: this.state.email,
          password: this.state.password,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          birth_date: this.state.birth_date,
          guc_id: this.state.guc_id,
          is_private: this.state.is_private
        })
          .then(res => {
            this.setState({
              message: "Registration Successfull!",
              error: ""
            });
          })
          .catch(err => {
            console.log(err);
            this.setState({
              error: err.response ? err.response.data.error : err.message
            });
          });
      }
    };

    this.change = event => {
      const newState = {};
      const name = event.target.name;
      newState[name] =
        name === "is_private" ? event.target.checked : event.target.value;
      this.setState(newState);
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
            <Link to="/login" class="alert-link">
              Go To Login.
            </Link>
          </Alert>
        ) : (
          <div />
        )}

        <Form className="register-form">
          <Form.Row>
            <Col>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                onChange={this.change}
              />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="First Name"
                name="first_name"
                onChange={this.change}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="last_name"
                onChange={this.change}
              />
            </Col>
          </Form.Row>

          <Form.Group>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.change}
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="passwordConfirm"
              onChange={this.change}
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              type="text"
              placeholder="GUC ID /00-0000/"
              name="guc_id"
              onChange={this.change}
            />
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Col xs="0">
                <Form.Label className="register-label">
                  Date of Birth
                </Form.Label>
              </Col>
              <Col>
                <Form.Control
                  className="register-label"
                  type="date"
                  name="birth_date"
                  onChange={this.change}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Row>
            <Col />
            <Col xs="2">
              <Form.Check
                className="register-check"
                label="Keep Me Private"
                type="checkbox"
                name="is_private"
                onChange={this.change}
              />
            </Col>
            <Col xs="0">
              <Button variant="primary" onClick={this.register}>
                Register
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </div>
    );
  }
}

export default Register;
