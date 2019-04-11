import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

import logo from "./logo.svg";
import "./App.css";

import DetailedEvents from "./views/DetailedEvents";
import PortalLibrary from "./views/PortalLibrary";
import Announcements from "./views/Announcements";
import UserProfile from "./views/UserProfile";
import Merchandise from "./views/Merchandise";
import Register from "./views/Register";
import AboutUs from "./views/AboutUs";
import Contact from "./views/Contact";
import Events from "./views/Events";
import Pages from "./views/Pages";
import Login from "./views/Login";
import Home from "./views/Home";
import FAQs from "./views/FAQs";
import Club from "./views/Club";

import HeaderNavbar from "./components/HeaderNavbar";

import Auth from "./utils/Auth";
import API from "./utils/API";

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
      API.get("/users/profile", {
        headers: {
          Authorization: token
        }
      }).then(res => {
        this.setState({
          user: res.data.data
        });
        this.setState({
          isLoggedIn: true
        });
        //for some reason combining these into one setState ruins private user???????????????????
      });
    };

    this.logout = () => {
      this.setState({
        user: undefined,
        isLoggedIn: false
      });

      Auth.deauthenticateUser();
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
            <Route exact path="/register" component={Register} />
            <Route
              exact
              path="/merchandise"
              render={props => (
                <Merchandise user={this.state.user} {...props} />
              )}
            />
            <Route exact path="/events" component={Events} />

            <Route
              path="/profile/:gucid?"
              render={props => (
                <UserProfile
                  user={this.state.user}
                  login={this.login}
                  logout={this.logout}
                  {...props}
                />
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

