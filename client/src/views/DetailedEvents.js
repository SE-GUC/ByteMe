import React, { Component } from "react";
import DetailedEvent from "../components/DetailedEvent";
import "./DetailedEvents.css";
import API from "../utils/API";
import { CardDeck } from "react-bootstrap";

// First we create our class
class DetailedEvents extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    // Next we establish our state
    this.state = {
      isLoading: true,
      events: []
    };
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <events>
          <h1>Events</h1>
          <CardDeck>
            {this.state.events.map(event => (
              <DetailedEvent
                _id={event._id}
                comingSoon={event.comingSoon}
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
          </CardDeck>
        </events>
      </div>
    );
  }
  async componentDidMount() {
    try {
      var pathArray = this.props.location.pathname.split("/");
      const secondLevelLocation = pathArray[2];
      API.get(`events/${secondLevelLocation}`).then(res => {
        this.setState({ events: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default DetailedEvents;