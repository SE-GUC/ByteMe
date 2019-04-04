import React, { Component } from "react";
import { Form, Button, Alert } from "react-bootstrap"
import API from "../utils/API";

class Merchandise extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: "",
            message: ""
        }

        this.login = () => {
            console.log(this.state)
            API.post("users/login", {
                email: this.state.email,
                password: this.state.password
            })
                .then(res => {
                    console.log(res)
                    if (res.data.error) {
                        this.setState(
                            {
                                error: res.data.error,
                                message: ""
                            }
                        )
                    }
                    if (res.data.data) {
                        this.setState({
                            message: "Logged In!",
                            error: ""
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        error: err.response ? err.response.data.error : err.message
                    })
                })
        }

        this.changePassword = event => {
            this.setState({
                password: event.target.value
            })
        }
        this.changeEmail = event => {
            this.setState({
                email: event.target.value
            })
        }
    }
    render() {
        return (
            <div>
                {this.state.error ?
                    <Alert variant="danger">
                        {this.state.error}
                    </Alert>
                    : (
                        this.state.message ?
                            <Alert variant="success">
                                {this.state.message}
                            </Alert>
                            : <div></div>
                    )}
                < Form >
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={this.changeEmail} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.changePassword} />
                    </Form.Group>

                    <Button variant="primary" onClick={this.login}>
                        Login
                </Button>
                </Form >
            </div>
        );
    }
}

export default Merchandise;
