import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";
import Merchandise from "./views/Merchandise";
import Home from "./views/Home";
import { Navbar } from "react-bootstrap";
import "./App.css";
import logo from "./logo.svg";
import Header from "./components/HeaderNavbar";

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
        <Header />
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
