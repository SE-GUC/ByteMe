import React, { Component } from "react";
import "./AboutUs.css";
import Dropzone from "react-dropzone";
import uploaderDefaultImage from "../images/upload-icon.png";
import productDefaultImage from "../images/product-icon.png";
import Photo from "../components/Photo";
import { Button, Modal, Form,FormGroup,
  InputGroup,
  FormControl } from "react-bootstrap";
import API from "../utils/API";
import Auth from "../utils/Auth";
import iconAdd from "../icons/plus.svg";
import { Slide } from "react-slideshow-image";

// First we create our class
class Gallery extends Component {
  constructor(props, context) {
    super(props, context);

    // Next we establish our state
    this.state = {
      isLoading: true,
      photos: [],
      show: false,
      user: this.props,
      isLoggedIn: this.props.isLoggedIn,
      description: "",
      title: "",
      pic_ref: ""
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
    const { pic_ref, title, description } = this.state;

    const token = Auth.getToken();
    const addedPhoto = await API.post(
      `gallery/`,
      {
        title,
        description,
        pic_ref
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      window.location.replace(`/gallery`);
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
      this.state.pic_ref = reader.result;
      this.setState({ pic_ref: this.state.pic_ref });
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
        <br />
        <h1>OUR GALLERY  {this.props.isLoggedIn &&
            (this.props.user.mun_role === "secretary_office" ||
            this.props.user.awg_admin === "mun" ? (
              <Button
                variant="warning"
                className="club-create-button"
                onClick={this.handleShow}
              >
                <img src={iconAdd} alt="Add new Member" />
              </Button>
            ) : null)}</h1>
        <div className="slide-container">
         
          <Slide {...properties}>
            {this.state.photos.map(photo => (
              <Photo
                isLoggedIn={this.props.isLoggedIn}
                user={this.props.user}
                logout={this.props.logout}
                description={photo.description}
                pic_ref={photo.pic_ref}
                title={photo.title}
                _id={photo._id}
              />
            ))}
          </Slide>
        </div>
        <Modal show={this.state.show} onHide={this.handleClose} centered>
          <Modal.Header closeButton> 
          <Modal.Title closeButton>Add photo to gallery</Modal.Title></Modal.Header>
           
          
          <Dropzone
            onDrop={acceptedFiles => this.pictureUploader(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <img
                    className="club-picture-picker"
                    src={
                      this.state.pic_ref
                        ? this.state.pic_ref
                        : uploaderDefaultImage
                    }
                    alt="cc"
                  />
                </div>
              </section>
            )}
          </Dropzone>
          <br />

          <FormGroup className="mb-3">
          <Form.Label>Title</Form.Label>
          <br/>
              <FormControl
                name="name"
                placeholder="Title"
                aria-label="Title"
                onChange={e => this.setState({ title: e.target.value })}
              />
            </FormGroup>
               
          
               <FormGroup className="mb-3">
          <Form.Label>Description</Form.Label>
          <br/>
              <FormControl
                name="name"
                placeholder="Description"
                aria-label="Description"
                as="textarea"
                rows="2"
                onChange={e => this.setState({ description: e.target.value })}
              />
            
            </FormGroup>
          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.add(e)}>
              ADD
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });

      API.get("gallery").then(res => {
        this.setState({ photos: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Gallery;
