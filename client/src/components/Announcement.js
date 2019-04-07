import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroup, Tab } from "react-bootstrap";
// import "./Product.css";

class Announcement extends Component {
    render() {
        const { date, info } = this.props;

        return (
            <Tab.Container id="faq-tab-container">
                <ListGroup.Item action href="#answer" variant="warning">
                    {info}

                    {
                        <Tab.Pane eventKey="#answer">
                            {/* <Sonnet /> */}
                            {date}
                        </Tab.Pane>
                    }
                </ListGroup.Item>
            </Tab.Container>
        );
    }
}

Announcement.propTypes = {
    date: PropTypes.instanceOf(Date),
    info: PropTypes.string
};

export default Announcement;