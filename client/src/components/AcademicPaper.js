import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
// import "./Event.css";

class AcademicPaper extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { name, date, link, year } = this.props;

    return (
      <Card className="text-center" border="primary" style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{year}</Card.Subtitle>

          <Card.Link href={link}>View Academic Paper</Card.Link>
        </Card.Body>
      </Card>
    );
  }
}

Event.propTypes = {
  name: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  link: PropTypes.string,
  year: PropTypes.number
};

export default AcademicPaper;
