import React, { Component } from "react";
import Product from "../components/Product";
import "./Merchandise.css";
import API from "../utils/API";
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner
} from "react-bootstrap";
import iconAdd from "../icons/plus.svg";
import uploaderDefaultImage from "../images/upload-icon.png";
import Dropzone from "react-dropzone";
import Auth from "../utils/Auth";

class Merchandise extends Component {
  constructor(props) {
    super(props);
    this.updateProducts = this.updateProducts.bind(this);
    this.handleCreateShow = this.handleCreateShow.bind(this);
    this.handleCreateClose = this.handleCreateClose.bind(this);
    this.change = this.change.bind(this);
    this.pictureUploader = this.pictureUploader.bind(this);

    this.state = {
      isLoading: true,
      products: [],
      user: props.user,
      canEdit: false,
      showAddProductWindow: false,
      newProduct: {}
    };
    if (this.state.user) {
      if (
        this.state.user.is_admin ||
        this.state.user.mun_role === "secretary_office"
      ) {
        this.state.canEdit = true;
      }
    }
  }
  render() {
    return (
      <div>
        <h1 style={{ margin: "15px" }}>GUCMUN SWAG</h1>
        <div className="merchandise">
          <div className="product-group">
            {this.state.canEdit ? (
              <Button
                variant="warning"
                className="product-create-button"
                onClick={this.handleCreateShow}
              >
                <img src={iconAdd} alt="Create new Product" />
              </Button>
            ) : (
              <></>
            )}

            {this.state.products.map(product => (
              <Product
                id={product._id}
                name={product.name}
                pic_ref={product.pic_ref}
                description={product.description}
                price={product.price}
                updateProducts={this.updateProducts}
                canEdit={this.state.canEdit}
              />
            ))}
          </div>
        </div>
        {/* CREATE MODAL */}
        <Modal
          show={this.state.showAddProductWindow}
          onHide={this.handleCreateClose}
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
                          : uploaderDefaultImage
                      }
                      alt="Product"
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
                type="Number"
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
            <Button variant="secondary" onClick={this.handleCreateClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => this.createProduct(this.state.newProduct)}
            >
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "Add Product"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  async componentDidMount() {
    this.updateProducts();
  }
  async componentWillReceiveProps(props) {
    this.setState({ user: props.user });
    if (this.state.user) {
      if (
        this.state.user.is_admin ||
        this.state.user.mun_role === "secretary_office"
      ) {
        this.setState({ canEdit: true });
      }
    }
  }
  updateProducts() {
    try {
      this.setState({ isLoading: true });
      API.get("products").then(res => {
        this.setState({ products: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleCreateClose() {
    this.setState({ showAddProductWindow: false });
  }
  handleCreateShow() {
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
    };
    reader.onerror = error => {
      console.log("Error uploading image: ", error);
    };
  };
  createProduct(newProduct) {
    this.setState({ isLoading: true });
    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.post(`products`, newProduct, { headers }).then(res => {
        this.updateProducts();
        this.setState({ isLoading: false });
        this.handleCreateClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Merchandise;
