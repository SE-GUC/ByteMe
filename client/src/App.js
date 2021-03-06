﻿import { BrowserRouter as Router, Route } from "react-router-dom";
import { Navbar, Modal, Nav } from "react-bootstrap";
import React, { Component } from "react";

import logo from "./logo.svg";
import "./App.css";

import PortalLibrary from "./views/PortalLibrary";
import Mailing_list from "./views/Mailing_list";
import UserProfile from "./views/UserProfile";
import Merchandise from "./views/Merchandise";
import ResetPass from "./views/ResetPass";
import Register from "./views/Register";
import Gallery from "./views/Gallery";
import AboutUs from "./views/AboutUs";
import Contact from "./views/Contact";
import Social from "./views/Social";
import Events from "./views/Events";
import MunDev from "./views/MunDev";
import Pages from "./views/Pages";
import Login from "./views/Login";
import Home from "./views/Home";

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
      events: [],
      email: "",
      show: false,
      error: ""
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
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
      window.location.reload();
    };

    if (Auth.isUserAuthenticated()) this.login();
  }
  handleClose() {
    this.setState({ show: false });
  }
  handleShow = e => {
    e.preventDefault();
    this.setState({ show: true });
  };
  validateForm() {
    let formIsValid = true;
    if (this.state.email === "") {
      formIsValid = false;
      this.setState({ error: "*Please enter your email." });
    }

    if (this.state.email !== "") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(this.state.email)) {
        formIsValid = false;
        this.setState({ error: "*Please enter valid email." });
      } else {
        formIsValid = true;
        this.setState({ error: "" });
      }
    }
    return formIsValid;
  }

  async componentDidMount() {
    API.get("/page").then(res => {
      this.setState({ councils: res.data.data });
    });

    API.get("/events").then(res => {
      this.setState({ events: res.data.data });
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      const { email } = this.state;
      await API.post("mailing_list", {
        email
      });
      this.setState({ show: false, email: "" });
    }
  }

  render() {
    return (
      <div id="default-div">
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
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
            <Route
              exact
              path="/"
              render={props => (
                <Home
                  isLoggedIn={this.state.isLoggedIn}
                  user={this.state.user}
                  logout={this.logout}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/home"
              render={props => (
                <Home
                  isLoggedIn={this.state.isLoggedIn}
                  user={this.state.user}
                  logout={this.logout}
                  {...props}
                />
              )}
            />
            {this.state.councils.map(council => {
              return (
                <Route
                  exact
                  path={`/pages/${council._id}`}
                  render={props => (
                    <Pages
                      isLoggedIn={this.state.isLoggedIn}
                      user={this.state.user}
                      logout={this.logout}
                      {...props}
                    />
                  )}
                />
              );
            })}
            <Route
              exact
              path="/library"
              render={props => (
                <PortalLibrary user={this.state.user} {...props} />
              )}
            />
            <Route
              exact
              path="/aboutus"
              render={props => (
                <AboutUs
                  isLoggedIn={this.state.isLoggedIn}
                  user={this.state.user}
                  logout={this.logout}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/development"
              render={props => (
                <MunDev
                  isLoggedIn={this.state.isLoggedIn}
                  user={this.state.user}
                  logout={this.logout}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/gallery"
              render={props => (
                <Gallery
                  isLoggedIn={this.state.isLoggedIn}
                  user={this.state.user}
                  logout={this.logout}
                  {...props}
                />
              )}
            />
            <Route exact path="/ContactUs" component={Contact} />
            <Route exact path="/Social" component={Social} />
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
            <Route
              exact
              path="/events"
              render={props => <Events user={this.state.user} {...props} />}
            />
            <Route exact path="/mailing_list" component={Mailing_list} />
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
            <Route path="/resetpass/:id" component={ResetPass} />
          </div>
        </Router>
        <div>
          <Navbar bg="black" sticky="bottom">
            <Navbar.Brand href="/home" className="mr-auto">
              <img
                src={logo}
                width="50"
                height="50"
                className="d-inline-block align-top"
                alt="GUCMUN logo"
              />
            </Navbar.Brand>
            <Nav>
              <input
                type="submit"
                onClick={e => this.handleShow(e)}
                value="Subscribe to our newsletter"
                style={{ margin: "1%" }}
              />
            </Nav>
            <Nav style={{ color: "black", margin: "1%", fontSize: "50%" }}>
              Easter Egg
            </Nav>
            {this.state.show ? (
              <Nav>
                <Modal
                  className="pop"
                  show={this.state.show}
                  onHide={this.handleClose}
                >
                  <Modal.Body>
                    <h1>Subscribe here!</h1>
                    <label>Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Your email"
                      value={this.state.email}
                      onChange={e => this.setState({ email: e.target.value })}
                    />
                    <div className="errorMsg">{this.state.error}</div>
                    <div className="sub">
                      <input
                        type="submit"
                        onClick={e => this.handleSubmit(e)}
                        value="Done"
                      />
                    </div>
                  </Modal.Body>
                </Modal>
              </Nav>
            ) : null}
            © 2019 GUCMUN
          </Navbar>
        </div>
      </div>
    );
  }
}

export default App;
