import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";
import { Navbar } from "react-bootstrap";

import Home from "./views/Home";
import Merchandise from "./views/Merchandise";
import Login from "./views/Login";
import Events from "./views/Events";

import HeaderNavbar from "./components/HeaderNavbar";

import API from "./utils/API";
import Auth from "./utils/Auth";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      user: undefined
    };

    this.login = () => {
      var token = Auth.getToken();
      console.log(`token = ${token}`);
      API.get("/users/profile", {
        headers: {
          Authorization: token
        }
      })
        .then(res => {
          this.setState({ user: res.data.data });
          this.setState({ isLoggedIn: true });
          console.log(`App.state.user ${this.state.user}`);
        })
        .catch(err => {
          console.log(err);
        });
    };
    this.logout = () => {
      this.setState({
        user: undefined,
        isLoggedIn: false
      });
    };
  }
  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
        <Router>
          <Route
            path="/"
            render={props => (
              <HeaderNavbar
                isLoggedIn={this.state.isLoggedIn}
                user={this.state.user}
                logout={this.logout}
                {...props}
              />
            )}
          />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route
              exact
              path="/login"
              render={props => <Login login={this.login} {...props} />}
            />
            <Route exact path="/merchandise" component={Merchandise} />
            <Route exact path="/events" component={Events} />
          </Switch>
        </Router>
        <Navbar bg="black">
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
