import React, { Component } from "react";
import { Navbar, NavDropdown, Nav, Modal, Form, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../App.css";
import API from "../utils/API";
import Auth from "../utils/Auth";

class HeaderNavbar extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      councils: [],
      show: false,
      name: "",
      description: "",
      role_to_control: "",
      checked1: false,
      checked2: false,
      checked3: false
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.add = this.add.bind(this);

    this.one = this.one.bind(this);
    this.two = this.two.bind(this);
    this.three = this.three.bind(this);
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  handleAdd = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async add(e, url) {
    e.preventDefault();
    this.setState({ show: false });
    const { name, description, role_to_control } = this.state;
    const token = Auth.getToken();
    await API.post(
      "page",
      {
        name,
        role_to_control,
        description
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      window.location.replace(`/pages/${res.data.data._id}`);
      this.setState({ isLoading: false });
    });
  }
  async componentDidMount() {
    API.get("/page").then(res => {
      this.setState({ councils: res.data.data });
    });
  }
  one() {
    this.setState({
      checked1: true,
      checked2: false,
      checked3: false,
      role_to_control: "council"
    });
  }
  two() {
    this.setState({
      checked1: false,
      checked2: true,
      checked3: false,
      role_to_control: "committee"
    });
  }
  three() {
    this.setState({
      checked1: false,
      checked2: false,
      checked3: true,
      role_to_control: "office"
    });
  }
  render() {
    return (
      <Navbar bg="blue" variant="dark" sticky="top">
        <Navbar.Brand to="/home">GUCMUN</Navbar.Brand>

        <Nav className="mr-auto">
          <LinkContainer to="/home">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/aboutus">
            <Nav.Link>About Us</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/gallery">
            <Nav.Link>Gallery</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/development">
            <Nav.Link>Development</Nav.Link>
          </LinkContainer>

          <NavDropdown title="Councils" id="basic-nav-dropdown">
            {this.state.councils.map((council, index) => {
              return (
                <div>
                  <LinkContainer to={`/pages/${council._id}`}>
                    <NavDropdown.Item>{council.name}</NavDropdown.Item>
                  </LinkContainer>
                  {index !== this.state.councils.length - 1 ? (
                    <NavDropdown.Divider />
                  ) : (
                    <div />
                  )}
                </div>
              );
            })}
          </NavDropdown>
          <LinkContainer to="/events">
            <Nav.Link>Events</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/library">
            <Nav.Link>Library</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/merchandise">
            <Nav.Link>Merchandise</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/ContactUs">
            <Nav.Link>Contact Us</Nav.Link>
          </LinkContainer>
        </Nav>
        {this.props.isLoggedIn &&
        (this.props.user.mun_role === "secretary_office" ||
          this.props.user.awg_admin === "mun") ? (
          <Button className="council" variant="link" onClick={this.handleShow}>
            <Nav.Link style={{ color: "white" }}>Add Council</Nav.Link>
          </Button>
        ) : null}
        {this.props.isLoggedIn ? (
          <Nav>
            {this.props.user.awg_admin === "mun" ||
            this.props.user.mun_role === "secretary_office" ? (
              <Nav>
                <LinkContainer to="/mailing_list">
                  <Nav.Link>Subscribers</Nav.Link>
                </LinkContainer>
              </Nav>
            ) : null}

            <LinkContainer to="/profile">
              <Nav.Link>
                {(this.props.user.first_name + " " + this.props.user.last_name)
                  .split(" ")
                  .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                  .join(" ") /*toTitleCase *kinda */}
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/home">
              <Nav.Link onClick={this.props.logout}>Logout</Nav.Link>
            </LinkContainer>
          </Nav>
        ) : (
          <Nav>
            <LinkContainer to="/register">
              <Nav.Link>Register</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          </Nav>
        )}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header className="head" closeButton>
            <Modal.Title> Info.</Modal.Title>
          </Modal.Header>
          <Form.Group controlId="editedPage">
            <Form.Label> Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter the new name for the Office/Council/Committee"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
            <br />

            <Form.Label> Type</Form.Label>
            <br />
            <Form.Check
              inline
              label="Council"
              type="radio"
              checked={this.state.checked1}
              value={this.state.role_to_control}
              onChange={this.one}
            />
            <Form.Check
              inline
              label="Committee"
              type="radio"
              checked={this.state.checked2}
              value={this.state.role_to_control}
              onChange={this.two}
            />
            <Form.Check
              inline
              label="Office"
              type="radio"
              checked={this.state.checked3}
              value={this.state.role_to_control}
              onChange={this.three}
            />
            <br />
            <br />
            <Form.Label> What We Do ?</Form.Label>
            <Form.Control
              as="textarea"
              rows="10"
              type="description"
              placeholder="Enter a short brief of what we do"
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </Form.Group>
          <Modal.Footer className="foot">
            <Button variant="secondary" onClick={e => this.add(e)}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Navbar>
    );
  }
}

export default HeaderNavbar;
