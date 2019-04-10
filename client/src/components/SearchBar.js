import React, { Component } from "react";
import { Button, InputGroup, FormControl, CardDeck } from "react-bootstrap";
import SearchResults from "./searchResults"
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

    this.changeSearchKey = event => {
      this.setState({
        searchkey: event.target.value
      });
      try {
        setTimeout(() => {
          API.post("search", { searchkey: this.state.searchkey })
            .then(res => {
              this.setState({
                searchResults_clubs: res.data.clubs,
                searchResults_events: res.data.events,
                searchResults_announcementss: res.data.announcements,
                searchResults_users: res.data.users
              });
            })
        }, 1000);
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
      }

    };
  }

  render() {
    return (
      <div>
        <FormControl
          placeholder="What are you looking for?"
          onChange={this.changeSearchKey}
        />
        {
          this.state.searchkey === "" ?
            <></>
            : <SearchResults
              clubs={this.state.searchResults_clubs}
              events={this.state.searchResults_events}
              announcements={this.state.searchResults_announcementss}
              users={this.state.searchResults_users}
            />
        }
        <h1>{this.state.searchkey}</h1>
      </div>
    );
  }
}

export default SearchBar;
