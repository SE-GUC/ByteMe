import React, { Component } from "react";
import "./AboutUs.css";
import Hierarchy from "./Hierarchy.js";
import MissionVision from "../components/MissionVision";
import Achievement from "../components/Achievement";
import Dropzone from "react-dropzone";
import uploaderDefaultImage from "../images/upload-icon.png";
import iconAdd from "../icons/plus.svg";
import { Button, Modal, FormGroup, FormControl } from "react-bootstrap";
import API from "../utils/API";
import Auth from "../utils/Auth";
import { Slide } from "react-slideshow-image";

// First we create our class
class AboutUs extends Component {
  constructor(props) {
    super(props);

    // Next we establish our state
    this.state = {
      isLoading: true,
      missions: [],
      achievements: [],
      show: false
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleAdd = this.handleAdd.bind(this);
    this.add = this.add.bind(this);
  }
  handleAdd = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async add(e) {
    e.preventDefault();
    this.setState({ show2: false });
    const { pic_ref, description } = this.state;

    const token = Auth.getToken();
    await API.post(
      `achievement/`,
      {
        description,
        pic_ref
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      window.location.replace(`/aboutus`);
      this.setState({ isLoading: false });
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  pictureUploader = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({ pic_ref: reader.result });
    };
    reader.onerror = error => {
      console.log("Error uploading image: ", error);
    };
  };

  render() {
    const properties = {
      duration: 5000,
      transitionDuration: 500,
      infinite: true,
      indicators: true,
      arrows: true
    };
    return (
      <div>
        <h1 style={{ margin: "2%" }}>OUR HEIRARCHY</h1>
        <br />
        <div className="hierarchy">
          <Hierarchy />
        </div>
        <br />
        <br />
        <h1>Our Mission & Vision </h1>
        {this.state.missions.map(mission => (
          <MissionVision
            isLoggedIn={this.props.isLoggedIn}
            user={this.props.user}
            loc={this.props.location}
            logout={this.props.logout}
            brief={mission.brief}
            _id={mission._id}
          />
        ))}

        <br />
        <h1>
          Our Achievements{" "}
          {this.props.isLoggedIn &&
            (this.props.user.mun_role === "secretary_office" ||
            this.props.user.awg_admin === "mun" ? (
              <Button
                variant="warning"
                className="product-create-button"
                onClick={this.handleShow}
              >
                <img src={iconAdd} alt="Add new Member" />
              </Button>
            ) : null)}
        </h1>

        <div className="slide-container">
          <Slide {...properties}>
            {this.state.achievements.map(achievement => (
              <Achievement
                isLoggedIn={this.props.isLoggedIn}
                user={this.props.user}
                logout={this.props.logout}
                description={achievement.description}
                pic_ref={achievement.pic_ref}
                _id={achievement._id}
              />
            ))}
          </Slide>
        </div>
        <div>
          <Modal show={this.state.show} onHide={this.handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add Achievement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* image */}
              <Dropzone
                onDrop={acceptedFiles => this.pictureUploader(acceptedFiles[0])}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img
                        className="product-picture-picker"
                        src={
                          this.state.pic_ref
                            ? this.state.pic_ref
                            : uploaderDefaultImage
                        }
                        alt="achievement"
                      />
                    </div>
                  </section>
                )}
              </Dropzone>
              {/* name */}
              <FormGroup className="mb-3">
                <br />
                <FormControl
                  name="name"
                  placeholder="Description"
                  aria-label="Description"
                  as="textarea"
                  rows="2"
                  defaultValue={this.state.description}
                  onChange={e => this.setState({ description: e.target.value })}
                />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={e => this.add(e)}>
                ADD
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });

      API.get("mission_vision").then(res => {
        this.setState({ missions: res.data.data, isLoading: false });
      });

      API.get("achievement").then(res => {
        this.setState({ achievements: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default AboutUs;
