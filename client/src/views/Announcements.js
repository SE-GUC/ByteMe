import React, { Component } from "react";
import Announcement from "../components/Announcement";
import "./Announcements.css";
import API from "../utils/API";
import { ListGroup } from "react-bootstrap";

// First we create our class
class Announcements extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    // Next we establish our state
    this.state = {
      isLoading: true,
      announcements: []
    };
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <announcements>
          <h1>Announcements</h1>

          <ListGroup>
            {this.state.announcements.map(announcement => (
              <Announcement date={announcement.date} info={announcement.info} />
            ))}
          </ListGroup>
        </announcements>
      </div>
    );
  }
  async componentDidMount() {
    try {
      API.get("announcements").then(res => {
        this.setState({ announcements: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Announcements;
