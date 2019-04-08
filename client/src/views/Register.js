import React, { Component } from "react";
import { Form, Button, Alert, Col } from "react-bootstrap"
import { Link } from "react-router-dom"

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
        }

        this.register = () => {
            if (this.state.password !== this.state.passwordConfirm)
                this.setState({
                    error: "Passwords don't match"
                })
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
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            error: err.response ? err.response.data.error : err.message
                        })
                    })
            }
        }

        this.changePassword = event => {
            this.setState({
                password: event.target.value
            })
        }
        this.changePasswordConfirm = event => {
            this.setState({
                passwordConfirm: event.target.value
            })
        }
        this.changeEmail = event => {
            this.setState({
                email: event.target.value
            })
        }
        this.changeFirstName = event => {
            this.setState({
                first_name: event.target.value
            })
        }
        this.changeLastName = event => {
            this.setState({
                last_name: event.target.value
            })
        }
        this.changeGUCID = event => {
            this.setState({
                guc_id: event.target.value
            })
            console.log(event.target.value)
        }
        this.changeBirthDate = event => {
            this.setState({
                birth_date: event.target.value
            })
        }
        this.changePrivate = event => {
            this.setState({
                is_private: event.target.checked
            })
        }
    }
    render() {
        return (
            <div >
                {this.state.error ?
                    <Alert variant="danger">
                        {this.state.error}
                    </Alert>
                    : (
                        this.state.message ?
                            <Alert variant="success">
                                {this.state.message} <Link to="/login" class="alert-link">Go To Login.</Link>
                            </Alert>
                            : <div></div>
                    )}

                < Form className="register-form">
                    <Form.Row >
                        <Col>
                            <Form.Control type="email" placeholder="Email" onChange={this.changeEmail} />
                        </Col>
                    </Form.Row>

                    <Form.Row >
                        <Col>
                            <Form.Control type="text" placeholder="First Name" onChange={this.changeFirstName} />
                        </Col>
                        <Col>
                            <Form.Control type="text" placeholder="Last Name" onChange={this.changeLastName} />
                        </Col>
                    </Form.Row>

                    <Form.Group>
                        <Form.Control type="password" placeholder="Password" onChange={this.changePassword} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Control type="password" placeholder="Confirm Password" onChange={this.changePasswordConfirm} />
                    </Form.Group>

                    <Form.Group >
                        <Form.Control type="text" placeholder="GUC ID /00-0000/" onChange={this.changeGUCID} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Row >
                            <Col xs="0">
                                <Form.Label className="register-label">Date of Birth</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control className="register-label" type="date" onChange={this.changeBirthDate} />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Row>
                        <Col>
                        </Col>
                        <Col xs="2">
                            <Form.Check className="register-check" label="Keep Me Private" type="checkbox" onChange={this.changePrivate} />
                        </Col>
                        <Col xs="0">
                            <Button variant="primary" onClick={this.register}>Register</Button>
                        </Col>

                    </Form.Row>
                </Form >
            </div >
        );
    }
}

export default Register;
