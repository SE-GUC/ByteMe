import React, { Component } from "react";
import { Form, Button, Alert } from "react-bootstrap"
import API from "../utils/API";
import Auth from "../utils/Auth";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: "",
            message: ""
        }

        this.routeCahnge = (path) => {
            this.props.history.push(path)
        }

        this.login = () => {
            console.log(this.state)
            API.post("users/login", {
                email: this.state.email,
                password: this.state.password
            })
                .then(res => {
                    this.setState({
                        message: "Logged In!",
                        error: ""
                    })
                    Auth.authenticateUser(res.data)
                    this.context.router.replace("/")
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

export default Login;
