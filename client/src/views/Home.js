import React, { Component } from "react";
import "./Home.css";
import { Timeline } from "vertical-timeline-component-for-react";
import API from "../utils/API";
import EventTimeline from "../components/EventTimeline";
import SearchBar from "../components/SearchBar";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }
  render() {
    return (
      <div>
        <Timeline lineColor={"#ffd700"} collapsible className="home">
          {this.state.events.map(event => (
            <EventTimeline
              id={event.id}
              title={event.title}
              brief={event.brief}
              location={event.location}
              dateTime={event.dateTime}
              description={event.description}
              photos={event.photos}
              feedback={event.feedback}
              creator={event.creator}
              rating={event.rating}
            />
          ))}
        </Timeline>

        <SearchBar />
      </div>
    );
  }
  async componentDidMount() {
    try {
      API.get("events").then(res => {
        this.setState({ events: res.data.data });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Home;
