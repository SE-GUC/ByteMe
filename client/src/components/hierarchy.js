import Tree from "react-tree-graph";
import "react-tree-graph/dist/style.css";
import React, { Component } from "react";
import API from "../utils/API";
// import { Image } from "react-bootstrap";

class hierarchy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secretary_users: [],
      executive_users: [],
      uso_users: [],
      director_users: [],
      advocate_users: []
    };
  }

  render() {
    let data = {
      name: "Secretary Office",
      gProps: {
        onClick: () =>
          alert(
            `Secretary office: ${this.state.secretary_users.map(
              user => user.first_name
            )}`
          )
      },
      children: [
        {
          name: "Executive Office",
          gProps: {
            onClick: () =>
              alert(
                `Executive office: ${this.state.executive_users.map(
                  user => user.first_name
                )}`
              )
          },
          children: [
            {
              name: "USO",
              gProps: {
                onClick: () =>
                  alert(
                    `USO: ${this.state.uso_users.map(user => user.first_name)}`
                  )
              }
            },
            {
              name: "Director",
              gProps: {
                onClick: () =>
                  alert(
                    `Director: ${this.state.director_users.map(
                      user => user.first_name
                    )}`
                  )
              }
            },
            {
              name: "Advocates",
              gProps: {
                onClick: () =>
                  alert(
                    `Advocates: ${this.state.advocate_users.map(
                      user => user.first_name
                    )}`
                  )
              }
            }
          ]
        }
      ]
    };

    return (
      <Tree
        data={data}
        height={800}
        width={800}
        animated
        // svgProps={{
        //   className: "custom"
        // }}
        // gProps={{
        //   onClick: onClick
        // }}
        // circleProps={
        //     <Image src="holder.js/171x180" rounded />
        // }
      />
    );
  }
  async componentDidMount() {
    try {
      API.get("users/role/secretary_office").then(res => {
        this.setState({ secretary_users: res.data.data });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
    try {
      API.get("users/role/executive_office").then(res => {
        this.setState({ executive_users: res.data.data });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
    try {
      API.get("users/role/uso").then(res => {
        this.setState({ uso_users: res.data.data });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
    try {
      API.get("users/role/director").then(res => {
        this.setState({ director_users: res.data.data });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
    try {
      API.get("users/role/advocate").then(res => {
        this.setState({ advocate_users: res.data.data });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default hierarchy;
