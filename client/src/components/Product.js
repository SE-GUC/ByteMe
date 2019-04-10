import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Button, Modal } from "react-bootstrap";
import "./Product.css";
import iconDelete from "../icons/x.svg";
import API from "../utils/API";
import Auth from "../utils/Auth";

class Product extends Component {
  constructor(props, context) {
    super(props, context);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      showDeleteConfirmation: false
    };
  }
  render() {
    const { id, name, description, pic_ref, price } = this.props;

    return (
      <div>
        <Card style={{ width: "18rem", margin: "10px", height: "30rem" }}>
          <Button
            variant="danger"
            className="product-delete-button"
            onClick={this.handleShow}
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
        <Modal
          show={this.state.showDeleteConfirmation}
          onHide={this.handleClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Product?</Modal.Title>
          </Modal.Header>
          <Modal.Body>You're DELETING this product! are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={this.deleteProduct}>
              I know what i'm doing
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  handleClose() {
    this.setState({ showDeleteConfirmation: false });
  }
  handleShow() {
    this.setState({ showDeleteConfirmation: true });
  }
  deleteProduct() {
    console.log("in");
    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `Bearer ${token}`
      };
      API.delete(`products/${this.id}`, { headers }).then(res => {
        console.log("deleted");
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
