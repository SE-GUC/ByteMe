import React, { Component } from "react";

class Circle extends Component {
  constructor(props, context) {
    super(props, context);
    this.circleStyle = {
      padding: 10,
      margin: 5,
      display: "inline-block",
      backgroundColor: this.props.bgColor,
      borderRadius: "50%",
      width: 40,
      height: 40,
      border: "1px solid #ccc"
    };
  }
  render() {
    return <div style={this.circleStyle} />;
  }
}

export default Circle;
