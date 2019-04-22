import React, { Component } from "react";
import {
  Navbar,
  NavDropdown,
  Nav,
  Modal,
  Form,
  Button,
  FormControl
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../App.css";
import API from "../utils/API";
import Auth from "../utils/Auth";

class AwgHeaderNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <Navbar bg="blue" variant="dark" sticky="top">
        <Navbar.Brand to="/">GUC AWGs</Navbar.Brand>

        <Nav className="mr-auto">
          <LinkContainer to="/home">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/announcements">
            <Nav.Link>Announcements</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/faq">
            <Nav.Link>FAQ</Nav.Link>
          </LinkContainer>
        </Nav>

        {this.props.isLoggedIn ? (
          <Nav>
            <LinkContainer to="/profile">
              <Nav.Link>
                {(this.props.user.first_name + " " + this.props.user.last_name)
                  .split(" ")
                  .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                  .join(" ") /*toTitleCase *kinda */}
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/home">
              <Nav.Link onClick={this.props.logout}>Logout</Nav.Link>
            </LinkContainer>
          </Nav>
        ) : (
            <Nav>
              <LinkContainer to="/register">
                <Nav.Link>Register</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            </Nav>
          )}
      </Navbar>
    );
  }
}

export default AwgHeaderNavbar;
