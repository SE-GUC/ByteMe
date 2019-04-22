import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  Modal,
  Form,
  FormGroup,
  FormControl
} from "react-bootstrap";
import Dropzone from "react-dropzone";
import uploaderDefaultImage from "../images/upload-icon.png";
import API from "../utils/API";
import Auth from "../utils/Auth";
import iconDelete from "../icons/x.svg";
import iconEdit from "../icons/pencil.svg";
class Achievement extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      show1: false,
      show3: false,

      user: this.props,
      isLoggedIn: this.props.isLoggedIn,
      description: "",
      title: ""
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleShow1 = this.handleShow1.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);

    this.handleShow3 = this.handleShow3.bind(this);
    this.handleClose3 = this.handleClose3.bind(this);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.update = this.update.bind(this);
  }

  handleUpdate = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async update(e) {
    e.preventDefault();
    this.setState({ show1: false });
    const { description, pic_ref } = this.state;
    const token = Auth.getToken();

    await API.put(
      `achievement/${this.props._id}`,
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

  async delete(e) {
    e.preventDefault();
    this.setState({ show3: false });
    const token = Auth.getToken();
    await API.delete(`achievement/${this.props._id}`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      window.location.replace("/aboutus");
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

  handleClose3() {
    this.setState({ show3: false });
  }

  handleShow3() {
    this.setState({ show3: true });
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
  async componentWillReceiveProps(props) {
    if (props.requestUser) {
      this.props.setUser(this.state.editedUser);
    }
    this.setState({
      user: props.user,
      isLoggedIn: props.isLoggedIn
    });
  }

  render() {
    const { description, pic_ref } = this.props;

    return (
      <Card>
        <Card.Title>
          {this.props.isLoggedIn &&
          this.props.user.mun_role === "secretary_office" ? (
            // this.props.user.mun_role === "secretary_office" ||this.props.user.awg_admin==="mun" ?
            <>
              <Button
                variant="info"
                className="product-edit-button"
                onClick={this.handleShow1}
              >
                <img src={iconEdit} alt="Edit page" />
              </Button>
              <Button
                variant="danger"
                className="product-delete-button"
                onClick={this.handleShow3}
              >
                <img src={iconDelete} alt="Delete page" />
              </Button>{" "}
            </>
          ) : (
            <></>
          )}
        </Card.Title>
        <Card.Body>
          <Card.Img width={50} height={500} src={pic_ref} alt="Card image" />
          {description}
        </Card.Body>
        {/* EDIT MODAL */}
        <Modal show={this.state.show1} onHide={this.handleClose1} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Achievement </Modal.Title>
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
                      alt="Product"
                    />
                  </div>
                </section>
              )}
            </Dropzone>

            <FormGroup className="mb-3">
              <Form.Label>Descsription</Form.Label>
              <FormControl
                name="description"
                as="textarea"
                rows="2"
                aria-label="Description"
                defaultValue={description}
                placeholder="Enter description"
                onChange={e => this.setState({ description: e.target.value })}
              />
            </FormGroup>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.update(e)}>
              Edit
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.show3} onHide={this.handleClose3}>
          <Modal.Header closeButton>
            <Modal.Title>
              Are you sure you want to delete this achievement ?
            </Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.delete(e)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    );
  }
}

Achievement.propTypes = {
  description: PropTypes.string,
  pic_ref: PropTypes.string,
  isLoading: PropTypes.bool,
  _id: PropTypes.number
};

export default Achievement;
