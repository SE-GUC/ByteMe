import React, { Component } from "react";
import { Button, InputGroup, FormControl, CardDeck } from "react-bootstrap";
import "./searchResults";
import API from "../utils/API";

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchkey: "",
      searchResults_clubs: [],
      searchResults_events: [],
      searchResults_announcementss: [],
      searchResults_users: []
    };
    this.showResults = async () => {
      try {
        API.post("search", { searchkey: this.state.searchkey }).then(res => {
          this.setState({
            searchResults_clubs: res.data.clubs,
            searchResults_events: res.data.events,
            searchResults_announcementss: res.data.announcements,
            searchResults_users: res.data.users
          });
        });
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
      }
      return (
        <searchResults
          clubs={this.state.searchResults_clubs}
          events={this.state.searchResults_events}
          announcements={this.state.searchResults_announcementss}
          users={this.state.searchResults_users}
        />
      );
    };

    this.changeSearchKey = event => {
      this.setState({
        searchkey: event.target.value
      });
    };
  }

  render() {
    return (
      <div>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="What you're looking for?"
            onChange={this.changeSearchKey}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={this.showResults}>
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  }
}

export default SearchBar;
