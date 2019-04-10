import React, { Component } from "react";
import Product from "../components/Product";
import "./Merchandise.css";
import API from "../utils/API";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import iconAdd from "../icons/plus.svg";
import Dropzone from "react-dropzone";
import Auth from "../utils/Auth";

// First we create our class
class Merchandise extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    this.updateProducts = this.updateProducts.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.change = this.change.bind(this);
    this.pictureUploader = this.pictureUploader.bind(this);

    // Next we establish our state
    this.state = {
      isLoading: true,
      products: [],
      user: props.user,
      isEditing: false,
      showAddProductWindow: false,
      newProduct: {}
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
                        this.state.newProduct.pic_ref
                          ? this.state.newProduct.pic_ref
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
              />
            </InputGroup>
            {/* price */}
            <InputGroup className="mb-3">
              <FormControl
                name="price"
                onChange={this.change}
                placeholder="Product Price"
                aria-label="Product Price"
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
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => this.createProduct(this.state.newProduct)}
            >
              Add product
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
  change = event => {
    const newProduct = this.state.newProduct;
    const name = event.target.name;
    newProduct[name] = event.target.value;
    this.setState({ newProduct: newProduct });
  };
  pictureUploader = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const newProduct = this.state.newProduct;
      newProduct.pic_ref = reader.result;
      this.setState({ newProduct: newProduct });
      console.log(newProduct);
    };
    reader.onerror = error => {
      console.log("Error uploading image: ", error);
    };
  };
  createProduct(newProduct) {
    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.post(`products`, newProduct, { headers }).then(res => {
        this.handleClose();
        this.updateProducts();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Merchandise;
