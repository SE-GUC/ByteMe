import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import Dropzone from "react-dropzone";
import "./Product.css";
import iconDelete from "../icons/x.svg";
import iconEdit from "../icons/pencil.svg";
import API from "../utils/API";
import Auth from "../utils/Auth";

class Product extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleDeleteShow = this.handleDeleteShow.bind(this);
    this.handleDeleteClose = this.handleDeleteClose.bind(this);
    this.handleEditShow = this.handleEditShow.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.state = {
      showDeleteConfirmation: false,
      showEditWindow: false,
      editedProduct: {}
    };
  }
  render() {
    const { id, name, description, pic_ref, price } = this.props;
    return (
      <div>
        <Card style={{ width: "18rem", margin: "10px", height: "30rem" }}>
          <Button
            variant="info"
            className="product-edit-button"
            onClick={this.handleEditShow}
          >
            <img src={iconEdit} />
          </Button>
          <Button
            variant="danger"
            className="product-delete-button"
            onClick={this.handleDeleteShow}
          >
            <img src={iconDelete} />
          </Button>
          <Card.Img variant="top" src={pic_ref} />
          <Card.Body className="product-body">
            <Card.Title className="product-name">{name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted product-price">
              {price} EGP
            </Card.Subtitle>
            <Card.Text className="product-description">{description}</Card.Text>
            <Button variant="secondary" className="product-button">
              Add to Cart
            </Button>
          </Card.Body>
        </Card>
        {/* DELETE MODAL */}
        <Modal
          show={this.state.showDeleteConfirmation}
          onHide={this.handleDeleteClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Product?</Modal.Title>
          </Modal.Header>
          <Modal.Body>You're DELETING this product! are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleDeleteClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => this.deleteProduct(id)}>
              I know what i'm doing
            </Button>
          </Modal.Footer>
        </Modal>
        {/* EDIT MODAL */}
        <Modal
          show={this.state.showEditWindow}
          onHide={this.handleEditClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a new product</Modal.Title>
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
                        pic_ref
                          ? pic_ref
                          : "https://2.bp.blogspot.com/-2pUEov3AKFM/WAgBheupB6I/AAAAAAAA8GA/19L8_kh1IIghXbbtUy1VIouMcUP8AUhiwCLcB/s1600/upload-1118929_960_720.png"
                      }
                      alt="Product picture"
                    />
                  </div>
                </section>
              )}
            </Dropzone>
            {/* name */}
            <InputGroup className="mb-3">
              <FormControl
                name="name"
                onChange={this.change}
                placeholder="Product Name"
                aria-label="Product Name"
                defaultValue={name}
              />
            </InputGroup>
            {/* price */}
            <InputGroup className="mb-3">
              <FormControl
                name="price"
                onChange={this.change}
                placeholder="Product Price"
                aria-label="Product Price"
                defaultValue={price}
              />
              <InputGroup.Append>
                <InputGroup.Text>EGP</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {/* description */}
            <InputGroup className="mb-3">
              <FormControl
                name="description"
                onChange={this.change}
                as="textarea"
                rows="2"
                placeholder="Product description"
                aria-label="Product description"
                defaultValue={description}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleEditClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => this.editProduct(id, this.state.editedProduct)}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  handleDeleteClose() {
    this.setState({ showDeleteConfirmation: false });
  }
  handleDeleteShow() {
    this.setState({ showDeleteConfirmation: true });
  }
  deleteProduct(id) {
    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`products/${id}`, { headers }).then(res => {
        this.handleDeleteClose();
        this.props.updateProducts();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleEditClose() {
    this.setState({ showEditWindow: false });
  }
  handleEditShow() {
    this.setState({ showEditWindow: true });
  }
  change = event => {
    const editedProduct = this.state.editedProduct;
    const name = event.target.name;
    editedProduct[name] = event.target.value;
    this.setState({ editedProduct: editedProduct });
  };
  pictureUploader = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const editedProduct = this.state.editedProduct;
      editedProduct.pic_ref = reader.result;
      this.setState({ editedProduct: editedProduct });
    };
    reader.onerror = error => {
      console.log("Error uploading image: ", error);
    };
  };
  editProduct(id, editedProduct) {
    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.put(`products/${id}`, editedProduct, { headers }).then(res => {
        this.handleEditClose();
        this.props.updateProducts();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

Product.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.number,
  pic_ref: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Product;
