import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AwgHeaderNavbar from "./components/AwgHeaderNavbar";
import AwgBottomNavBar from "./components/AwgBottomNavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Navbar, Modal, Nav } from "react-bootstrap";
import Announcements from "./views/Announcements";
import UserProfile from "./views/UserProfile";
import ResetPass from "./views/ResetPass";
import Register from "./views/Register";
import Login from "./views/Login";
import FAQs from "./views/FAQs";
import Club from "./views/Club";
import Home from "./views/Home";
import Auth from "./utils/Auth";
import API from "./utils/API";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      user: undefined
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

  // async componentDidMount() {

  // }

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
              <AwgHeaderNavbar
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
              render={props => <><Home user={this.state.user} {...props} /> <Club user={this.state.user} {...props}/></>}
            />

            <Route
              exact
              path="/home"
              render={props => <><Home user={this.state.user} {...props} /><Club user={this.state.user} {...props}/></>}
            />
            <Route
              exact
              path="/faq"
              render={props => <FAQs user={this.state.user} {...props} />}
            />
            <Route
              exact
              path="/announcements"
              render={props => (
                <Announcements user={this.state.user} {...props} />
              )}
            />

            <Route
              exact
              path="/login"
              render={props => <Login login={this.login} {...props} />}
            />
            <Route exact path="/register" component={Register} />

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
        <AwgBottomNavBar />
      </div>
    );
  }
}

export default App;
