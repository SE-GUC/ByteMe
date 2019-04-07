import React, { Component } from "react";
import AcademicPaper from "../components/AcademicPaper";
// import "./Events.css";
import API from "../utils/API";
//import { CardDeck } from "react-bootstrap";

// First we create our class
class PortalLibrary extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    // Next we establish our state
    this.state = {
      isLoading: true,
      academicPapers: []
    };
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        {/* <events> */}
        <h1>Portal Library</h1>
        {/* <CardDeck> */}
        {this.state.academicPapers.map(paper => (
          <AcademicPaper
            name={paper.name}
            date={paper.date}
            link={paper.link}
            year={paper.year}
          />
        ))}
        {/* </CardDeck> */}
        {/* </events> */}
      </div>
    );
  }
  async componentDidMount() {
    try {
      API.get("library").then(res => {
        this.setState({ academicPapers: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default PortalLibrary;
