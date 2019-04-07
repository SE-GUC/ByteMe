import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
//import "./Member.css";

class Member extends Component {
  render() {
    const {
      email,
      first_name,
      last_name,
      birth_date,
      guc_id,
      picture_ref,
      mun_role
    } = this.props;

    return (
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={picture_ref} />
        <Card.Body>
          <p>
            {first_name} {last_name}
          </p>
          <p>{email}</p>
          <p>{birth_date}</p>
          <p>{guc_id}</p>
          <p>{mun_role}</p>
        </Card.Body>
      </Card>
    );
  }
}

Member.propTypes = {
  email: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  birth_date: PropTypes.instanceOf(Date),
  guc_id: PropTypes.string,
  picture_ref: PropTypes.string,
  mun_role: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Member;
