import React, { Component } from "react";
import PropTypes from "prop-types";
import { TimelineItem } from "vertical-timeline-component-for-react";
import Event from "./Event";
import "./Event.css";
import Collapsible from "react-collapsible";

class EventTimeline extends Component {
  render() {
    const { title, dateTime } = this.props;

    return (
      <TimelineItem
        // key="001"
        dateText={dateTime.toString().split("T")[0]}
        dateInnerStyle={{ background: "#003255", color: "#ffd700" }}
        style={{ color: "#003255" }}
        bodyContainerStyle={{
          background: "#ffd700",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0.5rem 0.5rem 2rem 0 rgba(0, 0, 0, 0.2)"
        }}
      >
        <Collapsible
          trigger={<h3>{title}</h3>}
          triggerStyle={{ color: "#003255" }}
        >
          <h4 style={{ color: "#003255" }}>{this.props.brief}</h4>
          <p>{this.props.description}</p>
        </Collapsible>
      </TimelineItem>
    );
  }
}

Event.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  brief: PropTypes.string,
  location: PropTypes.string,
  dateTime: PropTypes.instanceOf(Date),
  description: PropTypes.string,
  photos: PropTypes.arrayOf(PropTypes.string),
  feedback: PropTypes.arrayOf(PropTypes.string),
  creator: PropTypes.string,
  rating: PropTypes.number,
  isLoading: PropTypes.bool
};

export default EventTimeline;
