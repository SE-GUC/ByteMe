import React, { Component } from "react";
import { Form, Button, Alert, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import API from "../utils/API";

import "../App.css";
import "./Login.css";

class ResetPass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passwordConfirm: "",
            password: "",
            error: "",
            message: "",
        };

        this.change = () => {
            if (this.state.password !== this.state.passwordConfirm) {
                this.setState({ error: "Passwords don't match", message: "" })
            }
            else {
                API.put("users/resetpass",
                    { resetPassLink: this.props.match.params.id, newPassword: this.state.password })
                    .then(res => {
                        this.setState({ error: "", message: "Password reset" })
                    })
                    .catch(err => {
                        this.setState({ error: err.message, message: "" })
                    })
            }
        }



        this.changePassword = event => {
            this.setState({
                password: event.target.value
            });
        };
        this.changePasswordConfirm = event => {
            this.setState({
                passwordConfirm: event.target.value
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
                        <Link to="/login" className="alert-link">
                            Go To Login.
                        </Link>
                    </Alert>
                ) : <></>}

                <Form className="login-form">
                    <Form.Group>
                        <Form.Row>
                            <Col xs="2">
                                <Form.Label className="login-label">Password</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    placeholder="New password"
                                    onChange={this.changePassword}
                                />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Col xs="2">
                                <Form.Label className="login-label">Confirm Password</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="password"
                                    placeholder="Confrim new password"
                                    onChange={this.changePasswordConfirm}
                                />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Col />
                            <Col xs="0">
                                <Button variant="primary" onClick={this.change}>
                                    Change
                                </Button>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default ResetPass;
