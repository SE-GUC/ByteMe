import React, { Component } from "react";
import AcademicPaper from "../components/AcademicPaper";

import API from "../utils/API";
import {
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner,
  CardDeck,
  Tab,
  Tabs
} from "react-bootstrap";
import iconAdd from "../icons/plus.svg";
import Auth from "../utils/Auth";
import "./PortalLibrary.css";

// First we create our class
class PortalLibrary extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    this.updatePapers = this.updatePapers.bind(this);
    this.handleCreateShow = this.handleCreateShow.bind(this);
    this.handleCreateClose = this.handleCreateClose.bind(this);
    this.change = this.change.bind(this);

    this.state = {
      isLoading: true,
      academicPapers: [],
      user: props.user,
      canEdit: false,
      showAddPaperWindow: false,
      searchKey: "",
      newPaper: {},
      key: "all"
    };
    if (this.state.user) {
      if (
        this.state.user.awg_admin === "mun" ||
        this.state.user.mun_role === "secretary_office"
      ) {
        this.state.canEdit = true;
      }
    }

    this.changeSearchKey = event => {
      this.setState({ searchKey: event.target.value });
    };

    this.search = () => {
      try {
        this.setState({ isLoading: true });
        API.get(`library/${this.state.searchKey}`).then(res => {
          this.setState({ academicPapers: res.data.data, isLoading: false });
        });
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
      }
    };
  }
  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <InputGroup>
          <FormControl
            placeholder="What are you looking for?"
            onChange={this.changeSearchKey}
            plaintext
            style={{
              color: "white",
              textAlign: "center",
              backgroundColor: "#05375A"
            }}
          />
          <InputGroup.Append>
            <Button
              style={{
                color: "#05375A",
                border: "#05375A",
                borderRadius: "0",
                fontWeight: "600",
                textAlign: "center",
                backgroundColor: "#ffd700"
              }}
              variant="warning"
              onClick={this.search}
            >
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <h1 style={{ margin: "15px" }}>
          Portal Library{" "}
          {this.state.isLoading ? <Spinner animation="border" /> : ""}
        </h1>
        <div className="papers">
          <Tabs
            className="lib-tabs"
            id="controlled-tab-library"
            activeKey={this.state.key}
            onSelect={key => {
              this.setState({ key });
            }}
            defaultActiveKey="all"
          >
            <Tab eventKey="all" title="All" />
            {this.state.academicPapers.map(paper => (
              <Tab eventKey={paper.year} title={paper.year} />
            ))}
          </Tabs>
          <CardDeck className="paper-group">
            {this.state.canEdit ? (
              <Button
                variant="warning"
                className="paper-create-button"
                onClick={this.handleCreateShow}
              >
                <img src={iconAdd} alt="Create new Paper" />
              </Button>
            ) : (
              <></>
            )}
            {this.state.academicPapers.map(paper =>
              paper.year === this.state.key || this.state.key === "all" ? (
                <AcademicPaper
                  id={paper._id}
                  name={paper.name}
                  date={paper.date}
                  link={paper.link}
                  year={paper.year}
                  updatePapers={this.updatePapers}
                  canEdit={this.state.canEdit}
                />
              ) : (
                <></>
              )
            )}
          </CardDeck>
        </div>
        {/* CREATE MODAL */}
        <Modal
          show={this.state.showAddPaperWindow}
          onHide={this.handleCreateClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a new paper</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* name */}
            <InputGroup className="mb-3">
              <FormControl
                name="name"
                onChange={this.change}
                placeholder="Paper Name"
                aria-label="Paper Name"
                autoComplete="off"
              />
            </InputGroup>
            {/* date */}
            <InputGroup className="mb-3">
              <FormControl
                name="date"
                type="date"
                onChange={this.change}
                placeholder="Paper date"
                aria-label="Paper date"
                autoComplete="off"
              />
            </InputGroup>
            {/* link */}
            <InputGroup className="mb-3">
              <FormControl
                name="link"
                onChange={this.change}
                placeholder="Paper link"
                aria-label="Paper link"
                autoComplete="off"
              />
            </InputGroup>
            {/* year */}
            <InputGroup className="mb-3">
              <FormControl
                name="year"
                type="number"
                onChange={this.change}
                placeholder="Paper year"
                aria-label="Paper year"
                autoComplete="off"
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCreateClose}>
              Close
            </Button>
            <Button variant="success" onClick={() => this.createPaper()}>
              {this.state.isLoading ? (
                <Spinner animation="border" />
              ) : (
                "Add Paper"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    this.updatePapers();
  }
  async componentWillReceiveProps(props) {
    this.setState({ user: props.user });
    if (this.state.user) {
      if (
        this.state.user.awg_admin === "mun" ||
        this.state.user.mun_role === "secretary_office"
      ) {
        this.setState({ canEdit: true });
      }
    }
  }
  updatePapers() {
    try {
      this.setState({ isLoading: true });
      if (this.state.key === "all") {
        API.get("library").then(res => {
          this.setState({ academicPapers: res.data.data, isLoading: false });
        });
      } else {
        API.get(`library/filter/${this.state.key}`).then(res => {
          this.setState({ academicPapers: res.data.data, isLoading: false });
        });
      }
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  handleCreateClose() {
    this.setState({ showAddPaperWindow: false });
  }
  handleCreateShow() {
    this.setState({ showAddPaperWindow: true });
  }
  change = event => {
    const newPaper = this.state.newPaper;
    const name = event.target.name;

    newPaper[name] = event.target.value;
    this.setState({ newPaper: newPaper });
  };

  createPaper() {
    this.setState({ isLoading: true });

    //Send
    try {
      const token = Auth.getToken();
      const headers = {
        Authorization: `${token}`
      };
      API.post(`library`, this.state.newPaper, { headers }).then(res => {
        this.updatePapers();
        this.setState({ isLoading: false });
        this.handleCreateClose();
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default PortalLibrary;
