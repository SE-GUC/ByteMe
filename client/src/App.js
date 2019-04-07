﻿import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";
import { Navbar } from "react-bootstrap";
import Pages from "./views/Pages";
import Home from "./views/Home";
import Merchandise from "./views/Merchandise";
import Login from "./views/Login";
import Events from "./views/Events";

import DetailedEvents from "./views/DetailedEvents";
import FAQs from "./views/FAQs";
import Announcements from "./views/Announcements";
import Club from "./views/Club";
import Contact from "./views/Contact";

import PortalLibrary from "./views/PortalLibrary";
import AboutUs from "./views/AboutUs";
import UserProfile from "./views/UserProfile";

import HeaderNavbar from "./components/HeaderNavbar";

import API from "./utils/API";
import Auth from "./utils/Auth";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      user: undefined,

      councils: [],
      events: []
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

      Auth.deauthenticateUser()
    };

    if (Auth.isUserAuthenticated()) this.login();
  }

  async componentDidMount() {
    API.get("/page").then(res => {
      this.setState({ councils: res.data.data });
    });


    API.get("/events").then(res => {
      this.setState({ events: res.data.data });
    });
  }

  render() {
    return (
      <div id="default-div">
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

          <div className="content-div">
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            {this.state.councils.map(council => {
              return (
                <Route exact path={`/pages/${council._id}`} component={Pages} />
              );
            })}
            {this.state.events.map(event => {
              return (
                <Route
                  exact
                  path={`/events/${event._id}`}
                  component={DetailedEvents}
                />
              );
            })}
            <Route exact path="/library" component={PortalLibrary} />
            <Route exact path="/aboutus" component={AboutUs} />
            <Route exact path="/faq" component={FAQs} />
            <Route exact path="/announcements" component={Announcements} />
            <Route exact path="/clubs" component={Club} />
            <Route exact path="/ContactUs" component={Contact} />
            <Route
              exact
              path="/login"
              render={props => <Login login={this.login} {...props} />}
            />
            <Route exact path="/merchandise" component={Merchandise} />
            <Route exact path="/events" component={Events} />

            <Route
              path="/profile/:gucid?"
              render={props => (
                <UserProfile user={this.state.user} {...props} />
              )}
            />
          </div>
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
