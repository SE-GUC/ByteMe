import React, { Component } from "react";
import FAQ from "../components/FAQ";
import "./FAQs.css";
import API from "../utils/API";
import {
  ListGroup,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner,
  Form
} from "react-bootstrap";
import Auth from "../utils/Auth";

// First we create our class
class FAQs extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    this.updateFAQs = this.updateFAQs.bind(this);
    this.handleCreateShow = this.handleCreateShow.bind(this);
    this.handleCreateClose = this.handleCreateClose.bind(this);
    this.change = this.change.bind(this);
    // Next we establish our state
    this.state = {
      isLoading: false,
      faqs: [],
      user: props.user,
      canEdit: false,
      showAddFAQWindow: false,
      newFAQ: {}
    };
    if (this.state.user) {
      if (this.state.user.is_admin) {
        this.state.canEdit = true;
      }
    }
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <faqs>
          <h1>FAQs</h1>
          {this.state.canEdit ? (
            <Button variant="warning" onClick={this.handleCreateShow}>
              Add FAQ
            </Button>
          ) : (
            <></>
          )}
          <ListGroup>
            {this.state.faqs.map(faq => (
              <FAQ
                id={faq._id}
                Question={faq.Question}
                Answer={faq.Answer}
                updateFAQs={this.updateFAQs}
                canEdit={this.state.canEdit}
              />
            ))}
          </ListGroup>
        </faqs>
        <Modal
          show={this.state.showAddFAQWindow}
          onHide={this.handleCreateClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a new FAQ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* question */}
            <InputGroup className="mb-3">
              <FormControl
                name="Question"
                onChange={this.change}
                placeholder="Question"
                aria-label="Question"
                autoComplete="off"
              />
            </InputGroup>
            {/* answer */}
            <InputGroup className="mb-3">
              <FormControl
                name="Answer"
                onChange={this.change}
                placeholder="Answer"
                aria-label="Answer"
                autoComplete="off"
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCreateClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => this.createFAQ(this.state.newFAQ)}
            >
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "Add FAQ"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  async componentDidMount() {
    this.updateFAQs();
  }
  async componentWillReceiveProps(props) {
    this.setState({ user: props.user });
    if (this.state.user) {
      if (this.state.user.is_admin) {
        this.setState({ canEdit: true });
      }
    }
  }
  updateFAQs() {
    try {
      API.get("faq").then(res => {
        this.setState({ faqs: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleCreateClose() {
    this.setState({ showAddFAQWindow: false });
  }
  handleCreateShow() {
    this.setState({ showAddFAQWindow: true });
  }
  change = event => {
    const newFAQ = this.state.newFAQ;
    const name = event.target.name;

    newFAQ[name] = event.target.value;
    this.setState({ newFAQ: newFAQ });
  };

  createFAQ(faq) {
    this.setState({ isLoading: true });

    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.post(`faq`, this.state.newFAQ, { headers }).then(res => {
        this.updateFAQs();
        this.setState({ isLoading: false });
        this.handleCreateClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default FAQs;
