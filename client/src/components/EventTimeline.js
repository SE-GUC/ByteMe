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
        dateText={dateTime}
        dateInnerStyle={{ background: "#003255", color: "#ffd700" }}
        style={{ color: "#003255" }}
      >
        <Collapsible trigger={title} triggerStyle={{ color: "#003255" }}>
          <Event
            id={this.props.id}
            title={this.props.title}
            brief={this.props.brief}
            location={this.props.location}
            dateTime={this.props.dateTime}
            description={this.props.description}
            photos={this.props.photos}
            feedback={this.props.feedback}
            creator={this.props.creator}
            rating={this.props.rating}
          />
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
