import React, { Component } from "react";
import { Container, Row, Media } from "react-bootstrap";
import eventDefaultImage from "../images/event-icon.png";
import "./User.css";
import "../App.css";

class MiniClub extends Component {
    constructor(props) {
        super(props);

        this.state = {
            club: this.props.club
        };
    }

    async componentWillReceiveProps(props) {
        this.setState({
            club: this.props.club
        });
    }

    render() {
        const { name, banner, description } = this.state.club;

        return (
            <Container className="user">
                <Row className="user-row">
                    <Media>
                        <img
                            width={50}
                            height={50}
                            className="mr-3"
                            src={banner}
                            alt="Club Banner"
                        />
                        <Media.Body>
                            <h5>{name}</h5>
                            <h6>{description}</h6>
                        </Media.Body>
                    </Media>
                </Row>
            </Container>
        );
    }
}

export default MiniClub;
