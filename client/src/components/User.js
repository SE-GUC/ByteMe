import React, { Component } from "react";
import { Container, Row, Col, Media } from "react-bootstrap";

import "./User.css";
import "../App.css";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user
    };
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
        <Row>
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
              <h5>
                {(first_name + " " + last_name)
                  .split(" ")
                  .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                  .join(" ")}
              </h5>
            </Media.Body>
          </Media>
        </Row>
        <Row>
          <Col className="header" xs={2}>
            EMAIL:
          </Col>
          <Col className="other">{email}</Col>
        </Row>
        <Row>
          <Col className="header" xs={2}>
            BIRTH DATE:
          </Col>
          <Col className="other">{birth_date.toString().split("T")[0]}</Col>
        </Row>
        <Row>
          <Col className="header" xs={2}>
            GUC ID:
          </Col>
          <Col className="other">{guc_id}</Col>
        </Row>
        <Row>
          <Col className="header" xs={2}>
            EMAIL:
          </Col>
          <Col className="other">{email}</Col>
        </Row>
        {mun_role !== "none" ? (
          <Row>
            <Col className="header" xs={2}>
              ROLE:
            </Col>
            <Col className="other">{email}</Col>
          </Row>
        ) : (
          <></>
        )}
      </Container>
    );
  }
}

export default User;
