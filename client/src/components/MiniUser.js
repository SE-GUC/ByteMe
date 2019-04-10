import React, { Component } from "react";
import { Container, Row, Media } from "react-bootstrap";

import "./User.css";
import "../App.css";

class MiniUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user
        };
    }

    async componentWillReceiveProps(props) {
        this.state = {
            user: this.props.user
        };
    }

    render() {
        const {
            email,
            first_name,
            last_name,
            picture_ref
        } = this.state.user;

        return (
            <Container className="user">
                <Row className="user-row">
                    <Media>
                        <img
                            width={50}
                            height={50}
                            className="mr-3"
                            src={
                                picture_ref
                                    ? picture_ref
                                    : "https://www.watsonmartin.com/wp-content/uploads/2016/03/default-profile-picture.jpg"
                            }
                            alt="Generic placeholder"
                        />
                        <Media.Body>
                            <h5>
                                {(first_name + " " + last_name)
                                    .split(" ")
                                    .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                                    .join(" ")}
                            </h5>
                            <h6 className="miniuser-mail">
                                {email}
                            </h6>
                        </Media.Body>

                    </Media>
                </Row>
            </Container>
        );
    }
}

export default MiniUser;
