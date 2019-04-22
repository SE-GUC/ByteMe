import React, { Component } from "react";
import "./Home.css";
import { Timeline } from "vertical-timeline-component-for-react";
import Auth from "../utils/Auth";
import API from "../utils/API";
import EventTimeline from "../components/EventTimeline";
import iconDelete from "../icons/x.svg";
import iconAdd from "../icons/plus.svg";
import { Button, Modal, Form } from "react-bootstrap";
import SearchBar from "../components/SearchBar";

import logo from "../logo.svg";
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      events: [],
      show: false,
      canEdit: false,
      show1: false,
      show2: false,
      show3: false,
      showI: false,
      showT: false,
      links: [],
      guc_id: "",
      role: "",
      canAdd: false,
      isSDKInitialized: false
    };
    if (this.state.user) {
      if (
        this.state.user.mun_role === "secretary_office" ||
        this.state.user.awg_admin === "mun"
      ) {
        this.state.canEdit = true;
      }
    }
    /*
    if (this.state.links.length === 1) {
      this.state.canAdd = true;
    }
*/
    this.handleShow = this.handleShow.bind(this);
    this.handleShow3 = this.handleShow3.bind(this);
    this.handleClose3 = this.handleClose3.bind(this);
    this.handleShow2 = this.handleShow2.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);
    this.handleShow1 = this.handleShow1.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);

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
    const { guc_id, role } = this.state;

    const token = Auth.getToken();

    await API.put(
      `page/give_admin/${guc_id}`,
      {
        role
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      window.location.replace(`/home`);
      this.setState({ isLoading: false });
    });
  }
  handleAdd = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async add(e) {
    e.preventDefault();

    const { link } = this.state;
    const token = Auth.getToken();
    await API.post(
      `/form`,
      {
        link
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      window.location.replace(`/home`);
      this.setState({ isLoading: false, canAdd: false });
    });
  }

  async delete(e) {
    e.preventDefault();
    const token = Auth.getToken();
    await API.delete(`form/${this.state.links[0]._id}`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      window.location.replace("/home");
      this.setState({ isLoading: false, canAdd: true });
    });
  }

  handleShow1() {
    this.setState({ show1: true });
  }

  handleClose1() {
    this.setState({ show1: false });
  }

  handleShow() {
    this.setState({ show: !this.state.show });
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

  render() {
    return (
      <div>
        <SearchBar />
        {this.state.isLoading ? (
          <div>
            <br />
            <br />
            <br />
            <header className="Home-header">
              <img src={logo} className="Home-logo" alt="logo" />
              <br />
              <h1>Welcome to GUCMUN</h1>
              <h5>Loading...</h5>
            </header>
          </div>
        ) : (
          <div>
            <Timeline lineColor={"#ffd700"} collapsible className="home">
              {this.state.events.map(event => (
                <EventTimeline
                  title={event.title}
                  brief={event.brief}
                  dateTime={event.dateTime}
                  description={event.description}
                />
              ))}
            </Timeline>
            {this.props.isLoggedIn &&
              (this.props.user.mun_role === "secretary_office" ||
              this.props.user.awg_admin === "mun" ? (
                <Button
                  variant="warning"
                  className="buttonP"
                  onClick={this.handleShow1}
                >
                  Give admin
                </Button>
              ) : null)}

            <div className="register">
              {this.props.isLoggedIn &&
                (this.props.user.mun_role === "secretary_office" ||
                this.props.user.awg_admin === "mun" ? (
                  <div>
                    {this.state.links[0] ? (
                      <Button
                        variant="warning"
                        className="buttonP"
                        onClick={this.handleShow3}
                      >
                        <img src={iconDelete} alt="Delete page" />
                      </Button>
                    ) : (
                      <Button
                        variant="warning"
                        className="buttonP"
                        onClick={this.handleShow2}
                      >
                        <img src={iconAdd} alt="Add new Member" />
                      </Button>
                    )}
                  </div>
                ) : null)}

              {this.state.links.map(link => (
                <input
                  type="submit"
                  onClick={this.handleShow}
                  value="Register to our current event"
                />
              ))}
            </div>
            <Modal show={this.state.show1} onHide={this.handleClose1}>
              <Modal.Header closeButton>
                <Modal.Title>GIVE ADMIN</Modal.Title>
              </Modal.Header>
              <br />
              <Form.Group controlId="editedPage">
                <Form.Label>GUC ID</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter Guc ID "
                  onChange={e => this.setState({ guc_id: e.target.value })}
                />
                <br />
                <Form.Label>Role To Be Given</Form.Label>
                <Form.Control
                  type="description"
                  placeholder="Enter Role"
                  onChange={e => this.setState({ role: e.target.value })}
                />
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={e => this.update(e)}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.show2} onHide={this.handleClose2}>
              <Modal.Header closeButton>
                <Modal.Title>Add google form link</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* name */}
                <label>Link</label>
                <textarea
                  id="link"
                  name="Google form link "
                  placeholder="Google form link"
                  onChange={e => this.setState({ link: e.target.value })}
                  value={this.state.link}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={e => this.add(e)}>
                  ADD
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.show3} onHide={this.handleClose3}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Are you sure you want to delete this registration link ?
                </Modal.Title>
              </Modal.Header>

              <Modal.Footer>
                <Button variant="secondary" onClick={e => this.delete(e)}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            <div className="register">
              {this.state.show ? (
                <iframe
                  src={this.state.links[0].link}
                  title="iframe"
                  width="640"
                  height="640"
                  frameborder="0"
                  marginheight="0"
                  marginwidth="0"
                >
                  Loading...
                </iframe>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });
      API.get("events").then(res => {
        console.log(res.data.data);
        this.setState({ isLoading: false, events: res.data.data });

        API.get(`form`).then(res => {
          this.setState({ links: res.data.data, isLoading: false });
        });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Home;
