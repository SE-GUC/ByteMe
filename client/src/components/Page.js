import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Button, Modal, Form } from "react-bootstrap";
import "./Page.css";
import API from "../utils/API";
import Auth from "../utils/Auth";
import iconDelete from "../icons/x.svg";
import iconEdit from "../icons/pencil.svg";
import iconAdd from "../icons/plus.svg";
class Page extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      show1: false,
      show2: false,
      show3: false,
      user: this.props.user,
      isLoggedIn: this.props.isLoggedIn,
      name: "",
      description: "",
      role_to_control: "",
      guc_id: "",
      role: "",
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,

      checked5: false,
      checked6: false
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleShow1 = this.handleShow1.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);

    this.handleShow2 = this.handleShow2.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);

    this.handleShow3 = this.handleShow3.bind(this);
    this.handleClose3 = this.handleClose3.bind(this);

    this.one = this.one.bind(this);
    this.two = this.two.bind(this);
    this.three = this.three.bind(this);
    this.four = this.four.bind(this);

    this.five = this.five.bind(this);
    this.six = this.six.bind(this);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.update = this.update.bind(this);

    this.handleAdd = this.handleAdd.bind(this);
    this.add = this.add.bind(this);
  }
  handleUpdate = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async update(e) {
    e.preventDefault();
    this.setState({ show1: false });
    const { name, description, role_to_control } = this.state;
    const token = Auth.getToken();

    await API.put(
      `page/${this.props._id}`,
      {
        name,
        description,
        role_to_control
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      this.props.updatePages();
      window.location.replace(`${this.props._id}`);
      this.setState({ isLoading: false });
    });
  }
  handleAdd = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async add(e) {
    e.preventDefault();
    this.setState({ show2: false });
    const { guc_id, role } = this.state;
    const token = Auth.getToken();
    await API.post(
      `page/${this.props._id}/members/${role}`,
      {
        guc_id
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      this.props.updatePages();
      window.location.replace(`${this.props._id}`);
      this.setState({ isLoading: false });
    });
  }

  async delete(e) {
    e.preventDefault();
    this.setState({ show3: false });
    const token = Auth.getToken();
    await API.delete(`page/${this.props._id}`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      window.location.replace("/home");
      this.setState({ isLoading: false });
    });
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClose1() {
    this.setState({ show1: false });
  }

  handleShow1() {
    this.setState({ show1: true });
  }

  handleClose2() {
    this.setState({ show2: false });
  }

  handleShow2() {
    this.setState({ show2: true });
  }

  handleClose3() {
    this.setState({ show3: false });
  }

  handleShow3() {
    this.setState({ show3: true });
  }
  async componentWillReceiveProps(props) {
    if (props.requestUser) {
      this.props.setUser(this.state.editedUser);
    }
    this.setState({
      user: props.user,
      isLoggedIn: props.isLoggedIn
    });
  }

  one() {
    this.setState({
      checked1: true,
      checked2: false,
      checked3: false,
      checked4: false,
      role_to_control: "council"
    });
  }
  two() {
    this.setState({
      checked1: false,
      checked2: true,
      checked3: false,
      checked4: false,
      role_to_control: "committee"
    });
  }
  three() {
    this.setState({
      checked1: false,
      checked2: false,
      checked3: true,
      checked4: false,
      role_to_control: "office"
    });
  }
  four() {
    this.setState({
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: true,
      role_to_control: "general_assembly"
    });
  }
  five() {
    this.setState({
      checked5: true,
      checked6: false,
      role: `${this.props.name}`
    });
  }
  six() {
    this.setState({
      checked5: false,
      checked6: true,
      role: `${this.props.name}_member`
    });
  }
  render() {
    const { name, description, url, role_to_control } = this.props;
    return (
      <Card className="card-style">
        <Card.Img
          width={50}
          height={500}
          src="https://pbs.twimg.com/media/DbUtG2LW4AIotFv.jpg"
          alt="Card image"
        />
        <Card.ImgOverlay>
          {this.props.isLoggedIn &&
            (this.props.user.mun_role === "secretary_office" ||
            this.props.user.mun_role === role_to_control ||
            this.props.user.mun_role === name ? (
              <div className="dod">
                <Button
                  variant="info"
                  className="buttonP"
                  onClick={this.handleShow2}
                >
                  <img src={iconAdd} alt="Add new Member" />
                </Button>
                <Button
                  variant="warning"
                  className="buttonP"
                  onClick={this.handleShow1}
                >
                  <img src={iconEdit} alt="Edit page" />
                </Button>
                <Button
                  variant="danger"
                  className="buttonP"
                  onClick={this.handleShow3}
                >
                  <img src={iconDelete} alt="Delete page" />
                </Button>
              </div>
            ) : null)}
          <br />

          <br />
          <Card.Title className="page-name">
            <h1 className="pageeeee">
              {" "}
              {name
                .replace("_", " ")
                .split(" ")
                .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                .join(" ")}
            </h1>
          </Card.Title>
          <Card.Text className="page-desc">
            <h2 className="tex">
              What We Do ?<br />
            </h2>
            {description}
          </Card.Text>
        </Card.ImgOverlay>
        <Modal show={this.state.show3} onHide={this.handleClose3}>
          <Modal.Header closeButton>
            <Modal.Title>
              Are you sure you want to delete this page ?
            </Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.delete(e)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.show2} onHide={this.handleClose2}>
          <Modal.Header closeButton>
            <Modal.Title>Add Member</Modal.Title>
          </Modal.Header>
          <Form.Group controlId="newMember">
            <Form.Label>GUC ID</Form.Label>
            <Form.Control
              type="id"
              placeholder="Enter GUC ID like xx-xxxxx "
              value={this.state.guc_id}
              onChange={e => this.setState({ guc_id: e.target.value })}
            />
          </Form.Group>
          <Form.Label>Set his role</Form.Label>
          <Form.Check
            className="cbx"
            inline
            name="c"
            id="1"
            label="Head"
            type="radio"
            checked={this.state.checked5}
            onChange={this.five}
          />
          <Form.Check
            className="cbx"
            inline
            name="com"
            id="2"
            label="Member"
            type="radio"
            checked={this.state.checked6}
            onChange={this.six}
          />
          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.add(e)}>
              ADD
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.show1} onHide={this.handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Page</Modal.Title>
          </Modal.Header>
          <h5>all fields are required to be updated</h5>
          <br />
          <Form.Group controlId="editedPage">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter the new name "
              onChange={e => this.setState({ name: e.target.value })}
            />
            <br />
            <Form.Label>Type</Form.Label>
            <Form.Group>
              <Form.Check
                className="cbx"
                inline
                name="c"
                id="1"
                label="Council"
                type="radio"
                checked={this.state.checked1}
                onChange={this.one}
              />
              <Form.Check
                className="cbx"
                inline
                name="com"
                id="2"
                label="Committee"
                type="radio"
                checked={this.state.checked2}
                onChange={this.two}
              />
              <Form.Check
                className="cbx"
                inline
                name="o"
                id="3"
                label="Office"
                type="radio"
                checked={this.state.checked3}
                onChange={this.three}
              />
              <Form.Check
                className="cbx"
                inline
                name="o"
                id="3"
                label="General Aseembly"
                type="radio"
                checked={this.state.checked4}
                onChange={this.four}
              />
            </Form.Group>
            <br />
            <br />
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows="10"
              type="description"
              placeholder="Enter description"
              onChange={e => this.setState({ description: e.target.value })}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.update(e)}>
              Edit
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    );
  }
}

Page.propTypes = {
  name: PropTypes.string,
  _id: PropTypes.string,
  role_to_control: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  loc: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool
};

export default Page;
