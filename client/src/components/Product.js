import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import "./Product.css";

class Product extends Component {
  render() {
    const { name, description, pic_ref, price } = this.props;

    return (
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={pic_ref} />
        <Card.Body>
          <Card.Title className="product-name">{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{price} EGP</Card.Subtitle>
          <Card.Text>{description}</Card.Text>
          <Button variant="primary" className="product-button">
            Add to Cart
          </Button>
        </Card.Body>
      </Card>
    );
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
