import React, { Component } from "react";
import Product from "../components/Product";
import "./Merchandise.css";
import API from "../utils/API";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import iconAdd from "../icons/plus.svg";

// First we create our class
class Merchandise extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    this.updateProducts = this.updateProducts.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    // Next we establish our state
    this.state = {
      isLoading: true,
      products: [],
      user: props.user,
      isEditing: false,
      showAddProductWindow: false
    };
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <h1 style={{ margin: "15px" }}>GUCMUN SWAG</h1>
        <div className="merchandise">
          <div className="product-group">
            <Button
              variant="warning"
              className="product-create-button"
              onClick={this.handleShow}
            >
              <img src={iconAdd} />
            </Button>
            {this.state.products.map(product => (
              <Product
                id={product._id}
                name={product.name}
                pic_ref={product.pic_ref}
                description={product.description}
                price={product.price}
                updateProducts={this.updateProducts}
              />
            ))}
          </div>
        </div>
        <Modal
          show={this.state.showAddProductWindow}
          onHide={this.handleClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a new product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* name */}
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Product Name"
                aria-label="Product Name"
              />
            </InputGroup>
            {/* price */}
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>EGP</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Product Price"
                aria-label="Product Price"
              />
              <InputGroup.Append>
                <InputGroup.Text>.00</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {/* description */}
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Product description"
                aria-label="Product description"
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={this.handleClose}>
              I know what i'm doing
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  async componentDidMount() {
    this.updateProducts();
  }
  updateProducts() {
    try {
      API.get("products").then(res => {
        this.setState({ products: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleClose() {
    this.setState({ showAddProductWindow: false });
  }
  handleShow() {
    this.setState({ showAddProductWindow: true });
  }
}

export default Merchandise;
