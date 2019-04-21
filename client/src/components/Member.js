import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Button, ButtonGroup, Container } from "react-bootstrap";
import API from "../utils/API";
import Auth from "../utils/Auth";
//import "./Member.css";

class Member extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      user: this.props.user,
      isLoggedIn: this.props.isLoggedIn,
      guc_id: ""
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  async delete(e, url, guc_id) {
    e.preventDefault();
    this.setState({ show: false });
    var pathArray = url.split("/");
    const secondLevelLocation = pathArray[2];
    const token = Auth.getToken();
    await API.delete(`page/${secondLevelLocation}/members/${guc_id}`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      this.props.updatePages();
      this.setState({ isLoading: false });
    });
  }

  async role(e, url, guc_id) {
    e.preventDefault();
    this.setState({ show: false });
    var x = guc_id;
    var pathArray = url.split("/");
    const secondLevelLocation = pathArray[2];
    const token = Auth.getToken();
    await API.put(
      `page/${secondLevelLocation}/members/set_role`,
      {
        guc_id: `${x}`
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      this.props.updatePages();
      this.setState({ isLoading: false });
    });
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  async componentWillReceiveProps(props) {
    if (props.requestUser) {
      this.props.setUser(this.state.editedUser);
    }
    this.setState({
      user: props.user,
      isLoggedIn: props.isLoggedIn
    });
  }

  render() {
    const {
      email,
      first_name,
      last_name,
      birth_date,
      guc_id,
      picture_ref,
      mun_role,
      url,
      role_to_control,
      page_name
    } = this.props;

    return (
      <Container style={{ width: "18rem", margin: "12px" }}>
        <Card
          style={{
            width: "18rem",
            margin: "10px",
            "background-color": "#003255"
          }}
        >
          <Card.Img
            src={
              picture_ref
                ? picture_ref
                : "https://www.watsonmartin.com/wp-content/uploads/2016/03/default-profile-picture.jpg"
            }
            alt="Generic placeholder"
          />
          <text style={{ color: "white", fontFamily: "GothamBook" }}>
            Name :{" "}
            {(first_name + " " + last_name)
              .split(" ")
              .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
              .join(" ")}
          </text>
          <text style={{ color: "white", fontFamily: "GothamBook" }}>
            {" "}
            Email : {email}
          </text>
          <text style={{ color: "white", fontFamily: "GothamBook" }}>
            {" "}
            Bith Date : {birth_date.toString().split("T")[0]}
          </text>
          <text style={{ color: "white", fontFamily: "GothamBook" }}>
            GUC ID :{guc_id}
          </text>
          <text style={{ color: "white", fontFamily: "Gothambook" }}>
            MUN Role :{" "}
            {mun_role
              .replace("_", " ")
              .split(" ")
              .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
              .join(" ")}
          </text>
          <Card.Footer style={{ height: "3rem", border: "none" }}>
            {this.props.isLoggedIn &&
              (this.props.user.mun_role === "secretary_office" ||
              this.props.user.mun_role === role_to_control ||
              this.props.user.mun_role === page_name ? (
                <ButtonGroup style={{ float: "right", height: "2rem" }}>
                  <Button
                    className="del"
                    style={{ border: "none" }}
                    variant="outline-light"
                    onClick={e => this.delete(e, url, guc_id)}
                  >
                    delete me
                  </Button>
                  {this.props.user.mun_role === role_to_control ||
                  this.props.user.mun_role === page_name ? (
                    <Button
                      className="role"
                      style={{ border: "none" }}
                      variant="outline-light"
                      onClick={e => this.role(e, url, guc_id)}
                    >
                      give me role
                    </Button>
                  ) : null}
                </ButtonGroup>
              ) : null)}
          </Card.Footer>
        </Card>
      </Container>
    );
  }
}

Member.propTypes = {
  email: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  birth_date: PropTypes.instanceOf(Date),
  guc_id: PropTypes.string,
  picture_ref: PropTypes.string,
  mun_role: PropTypes.string,
  isLoading: PropTypes.bool,
  url: PropTypes.string,
  page_name: PropTypes.string,
  role_to_control: PropTypes.string
};

export default Member;
