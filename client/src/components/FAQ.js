import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroup, Tab } from "react-bootstrap";
// import "./Product.css";

class FAQ extends Component {
  render() {
    const { Question, Answer } = this.props;

    return (
      <Tab.Container id="faq-tab-container">
        <ListGroup.Item action href="#answer" variant="warning">
          {Question}

          {
            <Tab.Pane eventKey="#answer">
              {/* <Sonnet /> */}
              {Answer}
            </Tab.Pane>
          }
        </ListGroup.Item>
      </Tab.Container>
    );
  }
}

FAQ.propTypes = {
  Question: PropTypes.string,
  Answer: PropTypes.string
};

export default FAQ;