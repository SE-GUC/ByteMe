import React, { Component } from "react";
import Product from "../components/Product";
import "./Merchandise.css";
import API from "../utils/API";
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner,
  Form,
  CardDeck
} from "react-bootstrap";
import iconAdd from "../icons/plus.svg";
import uploaderDefaultImage from "../images/upload-icon.png";
import Dropzone from "react-dropzone";
import Auth from "../utils/Auth";
import { TwitterPicker } from "react-color";

class Merchandise extends Component {
  constructor(props) {
    super(props);
    this.updateProducts = this.updateProducts.bind(this);
    this.handleCreateShow = this.handleCreateShow.bind(this);
    this.handleCreateClose = this.handleCreateClose.bind(this);
    this.change = this.change.bind(this);
    this.pictureUploader = this.pictureUploader.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.addColor = this.addColor.bind(this);
    this.clearColors = this.clearColors.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);

    this.state = {
      isLoading: true,
      products: [],
      user: props.user,
      canEdit: false,
      showAddProductWindow: false,
      newProduct: { sizes: [], colors: [] },
      colorsPicked: [],
      colorPicked: "#000000",
      newProductSizes: []
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
          <CardDeck className="product-group">
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
                colors={product.colors}
                sizes={product.sizes}
                updateProducts={this.updateProducts}
                canEdit={this.state.canEdit}
              />
            ))}
          </CardDeck>
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
                autoComplete="off"
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
                autoComplete="off"
              />
              <InputGroup.Append>
                <InputGroup.Text>EGP</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {/* Color */}
            <InputGroup className="mb-3">
              <FormControl
                name="color"
                onChange={this.change}
                placeholder="Available Colors"
                aria-label="Available Colors"
                autoComplete="off"
                value={this.state.colorsPicked.join(",")}
              />
            </InputGroup>
            <div style={{ display: "flex", "flex-direction": "row" }}>
              <TwitterPicker
                className="mb-3"
                onChange={this.handleColorChange}
              />
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  "margin-top": "-20px"
                }}
              >
                <Button
                  style={{
                    background: this.state.colorPicked
                  }}
                  className="color-picking-button"
                  onClick={() => this.addColor(this.state.colorPicked)}
                >
                  Add Color!
                </Button>
                <Button
                  className="color-picking-button"
                  variant="light"
                  onClick={() => this.clearColors()}
                >
                  Clear Colors
                </Button>{" "}
              </div>
            </div>
            {/* newProductSizes */}
            <div style={{ display: "flex", "flex-direction": "row" }}>
              {["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(size => (
                <div key={`checkbox-${size}`} className="mb-3 mr-3">
                  <Form.Check
                    custom
                    type="checkbox"
                    name={size}
                    onChange={this.handleSizeChange}
                    id={`custom-checkbox-${size}`}
                    label={size}
                  />{" "}
                </div>
              ))}
            </div>
            {/* description */}
            <InputGroup className="mb-3">
              <FormControl
                name="description"
                onChange={this.change}
                as="textarea"
                rows="2"
                placeholder="Product description"
                aria-label="Product description"
                autoComplete="off"
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
    if (name === "color") {
      return;
    }
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
  createProduct(product) {
    this.setState({ isLoading: true });
    const newProduct = {
      ...product,
      sizes: this.state.newProductSizes.filter(Boolean),
      colors: this.state.colorsPicked.filter(Boolean)
    };
    //Send
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
  handleColorChange(color, event) {
    this.setState({ colorPicked: color.hex });
  }
  addColor(color) {
    var colorsPicked = this.state.colorsPicked;
    colorsPicked.push(color);
    this.setState({ colorsPicked: colorsPicked });
  }
  clearColors() {
    this.setState({ colorsPicked: [] });
  }
  handleSizeChange = event => {
    if (event.target.checked) {
      const newProductSizes = this.state.newProductSizes;
      const name = event.target.name;
      newProductSizes.push(name);
      this.setState({ newProductSizes: newProductSizes });
    } else {
      const newProductSizes = this.state.newProductSizes;
      const name = event.target.name;
      for (var i = newProductSizes.length - 1; i >= 0; i--) {
        if (newProductSizes[i] === name) {
          newProductSizes.splice(i, 1);
        }
      }
      this.setState({ newProductSizes: newProductSizes });
    }
  };
}

export default Merchandise;
