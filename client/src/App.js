import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";
import { Navbar } from "react-bootstrap";

import Home from "./views/Home";
import Merchandise from "./views/Merchandise";
import Login from "./views/Login"
import HeaderNavbar from "./components/HeaderNavbar";

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
        <HeaderNavbar />
        {/* <Merchandise /> */}
        <Router>
          <Switch>
            <Route exact path="/" component={withRouter(Home)} />
            <Route exact path="/home" component={withRouter(Home)} />
            <Route exact path="/login" component={withRouter(Login)} />
            <Route exact path="/merchandise" component={withRouter(Merchandise)} />
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
