import React, { Component } from "react";
import { Container, Row, Col, Media, Form } from "react-bootstrap";

import "./User.css";
import "../App.css";

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            isEditing: false
        };

        this.save = () => {
            //save the edits made then
            this.props.save();
        }
    }

    async componentWillReceiveProps(props) {
        this.setState({
            user: props.user,
            isEditing: props.isEditing
        });

        console.log(props)
        if (props.requestSave) {
            this.save();
        }
    }

    render() {
        const {
            email,
            first_name,
            last_name,
            birth_date,
            guc_id,
            mun_role,
            picture_ref
        } = this.state.user;

        return (
            <Container className="user">
                <Row className="user-row">
                    <Media>
                        <img
                            width={128}
                            height={128}
                            className="mr-3"
                            src={
                                picture_ref
                                    ? picture_ref
                                    : "https://www.watsonmartin.com/wp-content/uploads/2016/03/default-profile-picture.jpg"
                            }
                            alt="Generic placeholder"
                        />
                        <Media.Body>
                            <h4>
                                {(first_name + " " + last_name)
                                    .split(" ")
                                    .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                                    .join(" ")}
                            </h4>
                        </Media.Body>
                    </Media>
                </Row>
                <Row className="user-row">
                    <Col className="user-header" xs={2}>EMAIL:</Col>
                    <Col className="user-other">
                        {this.state.isEditing ?
                            <Form.Control style={{ border: '0', padding: '0', margin: '0', color: 'white' }} plaintext type="email" placeholder="Email" onChange={this.change} />
                            : email}
                    </Col>
                </Row>
                <Row className="user-row">
                    <Col className="user-header" xs={2}>BIRTH DATE:</Col>
                    <Col className="user-other">{birth_date.toString().split("T")[0]}</Col>
                </Row>
                <Row className="user-row">
                    <Col className="user-header" xs={2}>GUC ID:</Col>
                    <Col className="user-other">{guc_id}</Col>
                </Row>

                {mun_role !== "none" ? (
                    <Row className="user-row">
                        <Col className="user-header" xs={2}>ROLE:</Col>
                        <Col className="user-other">{
                            mun_role.replace("_", " ").split(" ")
                                .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                                .join(" ")}
                        </Col>
                    </Row>
                ) :
                    <></>
                }

                {

                }
            </Container>
        );
    }
}

export default User;
