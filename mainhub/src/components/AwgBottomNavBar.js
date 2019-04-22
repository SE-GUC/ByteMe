import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

class AwgBottomNavbar extends Component {
  render() {
    return (
      <Navbar bg="black" bottom="sticky">
        <Navbar.Brand href="/mun" className="mr-auto">
          <img
            src="https://image.flaticon.com/icons/png/512/37/37232.png"
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        © 2019 GUCAWGs
      </Navbar>
    );
  }
}

export default AwgBottomNavbar;
