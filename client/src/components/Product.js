import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner,
  ButtonGroup,
  Form
} from "react-bootstrap";
import Dropzone from "react-dropzone";
import "./Product.css";
import iconDelete from "../icons/x.svg";
import iconEdit from "../icons/pencil.svg";
import uploaderDefaultImage from "../images/upload-icon.png";
import productDefaultImage from "../images/product-icon.png";
import API from "../utils/API";
import Auth from "../utils/Auth";
import Circle from "./Circle";
import { TwitterPicker } from "react-color";

class Product extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleDeleteShow = this.handleDeleteShow.bind(this);
    this.handleDeleteClose = this.handleDeleteClose.bind(this);
    this.handleEditShow = this.handleEditShow.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.addColor = this.addColor.bind(this);
    this.clearColors = this.clearColors.bind(this);
    this.sizeExists = this.sizeExists.bind(this);

    this.state = {
      isLoading: false,
      showDeleteConfirmation: false,
      showEditWindow: false,
      editedProduct: { sizes: [], colors: [] },
      canEdit: props.canEdit,
      colorPicked: "#000000",
      colorsPicked: props.colors,
      newProductSizes: props.sizes
    };
  }
  render() {
    const { id, name, description, pic_ref, price } = this.props;
    const allSizesInOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

    return (
      <div>
        <Card style={{ width: "18rem", margin: "10px" }}>
          {this.state.canEdit ? (
            <>
              <Button
                variant="info"
                className="product-edit-button"
                onClick={this.handleEditShow}
              >
                <img src={iconEdit} alt="Edit product" />
              </Button>
              <Button
                variant="danger"
                className="product-delete-button"
                onClick={this.handleDeleteShow}
              >
                <img src={iconDelete} alt="Delete product" />
              </Button>
            </>
          ) : (
            <></>
          )}

          <Card.Img
            variant="top"
            src={pic_ref !== "false" ? pic_ref : productDefaultImage}
          />
          <Card.Body className="product-body">
            <Card.Title className="product-name">{name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted product-price">
              {price} EGP
            </Card.Subtitle>
            <Card.Text className="product-description">{description}</Card.Text>

            <Card.Text className="product-headers-text">Colors</Card.Text>
            <div
              style={{
                display: "flex",
                "flex-direction": "row",
                "justify-content": "center"
              }}
            >
              {this.state.colorsPicked.map(color => (
                <Circle bgColor={color} />
              ))}
            </div>
            <Card.Text className="product-headers-text">Sizing</Card.Text>
            <div
              style={{
                display: "flex",
                "flex-direction": "row",
                "justify-content": "center"
              }}
            >
              <ButtonGroup size="lg" aria-label="First group">
                {this.state.newProductSizes
                  .slice()
                  .sort(
                    (a, b) =>
                      allSizesInOrder.indexOf(a) - allSizesInOrder.indexOf(b)
                  )
                  .map(size => (
                    <Button variant="secondary">{size}</Button>
                  ))}
              </ButtonGroup>
            </div>
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
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "I know what i'm doing"
              )}
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
            <Modal.Title>Update a product</Modal.Title>
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
                        this.state.editedProduct.pic_ref
                          ? this.state.editedProduct.pic_ref
                          : pic_ref !== "false"
                          ? pic_ref
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
                defaultValue={name}
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
                defaultValue={price}
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
                    checked={this.sizeExists(size) ? true : false}
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
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "Save Changes"
              )}
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
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.delete(`products/${id}`, { headers }).then(res => {
        this.props.updateProducts();
        this.setState({ isLoading: false });
        this.handleDeleteClose();
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
    const newProduct = {
      ...editedProduct,
      sizes: this.state.newProductSizes.filter(Boolean),
      colors: this.state.colorsPicked.filter(Boolean)
    };
    try {
      this.setState({ isLoading: true });
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.put(`products/${id}`, newProduct, { headers }).then(res => {
        this.props.updateProducts();
        this.setState({ isLoading: false });
        this.handleEditClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  async componentWillReceiveProps(props) {
    this.setState({
      canEdit: props.canEdit
    });
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
  sizeExists(name) {
    const newProductSizes = this.state.newProductSizes;
    for (var i = 0; i < newProductSizes.length; i++) {
      if (newProductSizes[i] === name) {
        return true;
      }
    }
    return false;
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
