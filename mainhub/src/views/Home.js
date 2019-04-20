import React, { Component } from "react";
import "./Home.css";
import API from "../utils/API";
import logo from "../guc-logo.png";
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
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <br />
          <h1>Welcome to GUC main hub</h1>
        </header>
        {/* <SearchBar /> */}
      </div>
    );
  }
  // async componentDidMount() {

  // }
}

export default Home;
