import React, { Component } from "react";
import "./Home.css";
import API from "../utils/API";
import logo from "../guc-logo.png";
import SearchBar from "../components/SearchBar"
import { Button, Modal, ModalFooter, Navbar } from "react-bootstrap";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user
    };
  }

  render() {
    return (
      <div>
        <SearchBar />
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <br />
          <h1>Welcome to GUC main hub</h1>
        </header>
      </div>
    );
  }
  // async componentDidMount() {

  // }
}

export default Home;
