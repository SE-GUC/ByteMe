import React, { Component } from "react";
import "./Mailing_list.css";
import Mailing from "../components/Mailing";
import { ListGroup, Modal, Button, Nav } from "react-bootstrap";

import API from "../utils/API";

import Auth from "../utils/Auth";
// First we create our class
class Mailing_list extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    // Next we establish our state
    this.state = {
      isLoading: true,
      mails: [],
      message: "",
      show: false,
      show2: false,
      error: "",
      msg: ""
    };
    this.updateMail = this.updateMail.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.handleClose2 = this.handleClose2.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleShow() {
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }
  handleClose2() {
    this.setState({ show2: false });
  }
  async handleSubmit(e) {
    e.preventDefault();
    for (var i = 0; i < this.state.mails.length; i++) {
      API.post("subscribers", {
        email: this.state.mails[i].email,
        message: this.state.message
      })
        .then(res => {
          this.setState({
            msg: "Inquiry sent successfully!",
            error: "",
            show: false,
            show2: true
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            error: err.response ? err.response.data.error : err.message
          });
        });
    }
  }
  render() {
    return (
      <div>
        <mail>
          <h1>Subscribers</h1>
          <ListGroup className="mmm">
            {this.state.mails.map(d => (
              <Mailing
                id={d._id}
                email={d.email}
                updateMail={this.updateMail}
              />
            ))}
          </ListGroup>
          <div className="sub">
            <input type="s" onClick={this.handleShow} value="Fill Email" />
          </div>
          {this.state.show ? (
            <Nav>
              <Modal
                className="pop"
                show={this.state.show}
                onHide={this.handleClose}
              >
                <Modal.Header className="pop2">
                  <h1>Type your message...</h1>
                </Modal.Header>
                <Modal.Body>
                  <label>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Write something.."
                    onChange={e => this.setState({ message: e.target.value })}
                    value={this.state.message}
                  />
                  <div className="sub">
                    <input
                      type="s"
                      onClick={e => this.handleSubmit(e)}
                      value="Send Email"
                    />
                  </div>
                </Modal.Body>
              </Modal>
              {this.state.show2 ? (
                <Nav>
                  <Modal
                    className="pop"
                    show={this.state.show2}
                    onhide={this.handleClose2}
                  >
                    <Modal.Body>
                      <h1>Email was sent successfully</h1>
                      <Button className="ddd" href="/">
                        Go to home page
                      </Button>
                    </Modal.Body>
                  </Modal>
                </Nav>
              ) : null}
            </Nav>
          ) : null}
        </mail>
      </div>
    );
  }

  async componentDidMount() {
    this.updateMail();
  }

  updateMail() {
    try {
      var token = Auth.getToken();
      API.get("mailing_list", {
        headers: {
          Authorization: token
        }
      }).then(res => {
        this.setState({ mails: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Mailing_list;
