import React, { Component } from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import SearchResults from "./searchResults";
import API from "../utils/API";

import "./SearchBar.css";

import LoadingGif from "../images/Loading.gif";

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchkey: "",
      // searchResults_clubs: undefined,
      searchResults_events: undefined,
      // searchResults_announcementss: undefined,
      searchResults_users: undefined,
      searchClicked: false,
      message: "",
      loading: false
    };

    this.changeSearchKey = event => {
      this.setState({
        searchkey: event.target.value,
        searchClicked: false
      });
      if (event.target.value === "")
        this.setState({
          // searchResults_announcementss: undefined,
          // searchResults_clubs: undefined,
          searchResults_events: undefined,
          searchResults_users: undefined,
          loading: false
        });
    };

    this.search = () => {
      console.log("ouch!");
      try {
        this.setState({ loading: true, searchClicked: true });
        API.post("search", { searchkey: this.state.searchkey }).then(
          async res => {
            this.setState({
              // searchResults_clubs: res.data.clubs,
              searchResults_events: res.data.events,
              // searchResults_announcementss: res.data.announcements,
              searchResults_users: res.data.users,
              message: res.data.message
            });
            //await sleep(1000)
            this.setState({ loading: false });
          }
        );
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
      }
    };
  }

  render() {
    return (
      <div>
        <InputGroup>
          <FormControl
            placeholder="What are you looking for?"
            onChange={this.changeSearchKey}
            plaintext
            style={{
              color: "white",
              textAlign: "center",
              backgroundColor: "#05375A"
            }}
          />
          <InputGroup.Append>
            <Button
              style={{
                color: "#05375A",
                border: "#05375A",
                borderRadius: "0",
                fontWeight: "600",
                textAlign: "center",
                backgroundColor: "#ffd700"
              }}
              variant="warning"
              onClick={this.search}
            >
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
        {this.state.searchkey === "" || !this.state.searchClicked ? (
          <></>
        ) : this.state.loading ? (
          <div className="results-div">
            <img height="140" src={LoadingGif} alt="Loading" />
          </div>
        ) : (
          <div className="results-div">
            <SearchResults
              // clubs={this.state.searchResults_clubs}
              events={this.state.searchResults_events}
              // announcements={this.state.searchResults_announcementss}
              users={this.state.searchResults_users}
              message={this.state.message}
            />
          </div>
        )}
      </div>
    );
  }
}

export default SearchBar;
