import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Alert } from "react-bootstrap"

import User from "../components/User"

import API from "../utils/API";

const queryString = require('query-string')

class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: props.user,
            err: ""
        }
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    async componentDidMount() {
        this.state = {
            user: this.props.user,
            err: ""
        }
        console.log(`UserProfile.props.location.search = ${this.props.location.search}`)
        console.log(`UserProfile.state.user = ${this.state.user}`)
        const parsed = queryString.parse(this.props.location.search)

        if (parsed.gucid) {
            if (this.state.user && this.state.user.is_admin) {
                API.get(`/users/asAdmin/${parsed.gucid}`)
                    .then(res => {
                        this.setState({ user: res.data.data, err: "" })
                    })
                    .catch(err => {
                        if (err.response)
                            this.setState({ err: err.response.error })
                        else
                            this.setState({ err: err.message })
                    })
            } else {
                API.get(`/users/${parsed.gucid}`)
                    .then(res => {
                        this.setState({ user: res.data.data, err: "" })
                    })
                    .catch(err => {
                        if (err.response)
                            this.setState({ err: err.response.data.error ? err.response.data.error : err.response.data.message })
                        else
                            this.setState({ err: err.message })
                    })
            }
        }
    }

    render() {
        console.log(this.state.err)
        return (
            this.state.user ?
                <User user={this.state.user} /> :
                this.state.err !== "" ?
                    <Alert variant="danger"> {this.state.err} </Alert> :
                    <Alert variant="danger"> Oops! Looks like something went wrong. </Alert>
        );
    }
}

export default withRouter(UserProfile);