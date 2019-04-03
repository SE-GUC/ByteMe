import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import "./App.css";
import logo from "./logo.svg";
import Merchandise from "./views/Merchandise";
import Home from "./views/Home";

class App extends Component {
  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
        <Navbar bg="blue" variant="dark" sticky="top">
          <Navbar.Brand href="/">GUCMUN</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="announcements">Announcements</Nav.Link>
            <NavDropdown title="Councils" id="basic-nav-dropdown">
              {/* neb2a n7ot for loop t-generate council dropdown items */}
              <NavDropdown.Item href="#action/3.1">
                Council hena
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2">
                Council tany
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.3">
                Council talet
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="events">Events</Nav.Link>
            <Nav.Link href="library">Library</Nav.Link>
            <Nav.Link href="merchandise">Merchandise</Nav.Link>
            <Nav.Link href="faq">FAQ</Nav.Link>
          </Nav>
          {/* neb2a n7ot if t-check law logged in */}
          <Navbar.Text>
            Signed in as: <a href="#login">Omar Hussein</a>
          </Navbar.Text>
        </Navbar>
        {/* <Merchandise /> */}
        <Router>
          <Switch>
            <Route exact path="/" component={withRouter(Home)} />
            <Route path="/merchandise" component={withRouter(Merchandise)} />
          </Switch>
        </Router>
        <Navbar bg="black" fixed="bottom">
          <Navbar.Brand href="/home" className="mr-auto">
            <img
              src={logo}
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          © 2019 GUCMUN
        </Navbar>{" "}
      </div>
    );
  }
}

export default App;
