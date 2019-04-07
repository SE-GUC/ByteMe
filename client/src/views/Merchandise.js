import React, { Component } from "react";
import Product from "../components/Product";
import "./Merchandise.css";
import API from "../utils/API";

// First we create our class
class Merchandise extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    // Next we establish our state
    this.state = {
      isLoading: true,
      products: []
    };
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <h1 style={{ margin: "15px" }}>GUCMUN SWAG</h1>
        <div className="merchandise">
          <div className="product-group">
            {this.state.products.map(product => (
              <Product
                name={product.name}
                pic_ref={product.pic_ref}
                description={product.description}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  async componentDidMount() {
    try {
      API.get("products").then(res => {
        this.setState({ products: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Merchandise;
