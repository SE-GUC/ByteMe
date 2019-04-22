import React, { Component } from "react";

import "./Contact.css";

import API from "../utils/API";
import { Modal } from "react-bootstrap";
// First we create our class
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      message: "",
      error1: "",
      error2: "",
      error3: "",
      error4: "",
      show: false
    };

    this.handleClose = this.handleClose.bind(this);
    this.submituserForm = this.submituserForm.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }
  submituserForm(e) {
    e.preventDefault();
    if (this.validateForm()) {
      API.post("forms", {
        fname: this.state.fname,
        lname: this.state.lname,
        email: this.state.email,
        message: this.state.message
      });
      this.setState({
        show: true,
        fname: "",
        lname: "",
        email: "",
        message: "",
        error1: "",
        error2: "",
        error3: "",
        error4: ""
      });
    }
  }

  validateForm() {
    let formIsValid = true;

    if (this.state.fname === "") {
      formIsValid = false;
      this.setState({ error1: "*Please enter your firstname." });
    }

    if (this.state.fname !== "") {
      if (!this.state.fname.match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        this.setState({ error1: "*Please enter alphabet characters only." });
      } else {
        this.setState({ error1: "" });
      }
    }
    if (this.state.lname === "") {
      formIsValid = false;
      this.setState({ error2: "*Please enter your lastname." });
    } else {
      this.setState({ error1: "" });
    }

    if (this.state.lname !== "") {
      if (!this.state.lname.match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        this.setState({ error2: "*Please enter alphabet characters only." });
      } else {
        formIsValid = true;
        this.setState({ error2: "" });
      }
    }
    if (this.state.email === "") {
      formIsValid = false;
      this.setState({ error3: "*Please enter your email." });
    }

    if (this.state.email !== "") {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(this.state.email)) {
        formIsValid = false;
        this.setState({ error3: "*Please enter valid email." });
      } else {
        formIsValid = true;
        this.setState({ error3: "" });
      }
    }
    if (this.state.message === "") {
      formIsValid = false;
      this.setState({ error4: "*Please enter your message." });
    }

    return formIsValid;
  }

  render() {
    return (
      <div className="App">
        <h1>CONTACT US</h1>
        <div>
          <form action="#">
            <label>First Name</label>
            <input
              type="text"
              id="fname"
              name="firstname"
              placeholder="Your name.."
              value={this.state.fname}
              onChange={e => this.setState({ fname: e.target.value })}
            />{" "}
            <div className="errorMsg">{this.state.error1}</div>
            <label>Last Name</label>
            <input
              type="text"
              id="lname"
              name="lastname"
              placeholder="Your last name.."
              value={this.state.lname}
              onChange={e => this.setState({ lname: e.target.value })}
            />{" "}
            <div className="errorMsg">{this.state.error2}</div>
            <label>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />{" "}
            <div className="errorMsg">{this.state.error3}</div>
            <label>Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write something.."
              onChange={e => this.setState({ message: e.target.value })}
              value={this.state.message}
            />{" "}
            <div className="errorMsg">{this.state.error4}</div>
            <input
              type="submit"
              onClick={e => this.submituserForm(e)}
              value="Submit"
            />
          </form>
        </div>
        {this.state.show ? (
          <>
            <Modal show={this.state.show} onHide={this.handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Thank You.</Modal.Title>
              </Modal.Header>
            </Modal>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default Contact;
