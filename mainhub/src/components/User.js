import React, { Component } from "react";
import { Container, Row, Col, Media, Form } from "react-bootstrap";
import Dropzone from "react-dropzone";

import "./User.css";
import "../App.css";

// import defImage from "../../../client/src/images/default-profile-picture.jpg";
// import uplImage from "../../../client/src/images/upload-icon.png";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      isEditing: false,
      editedUser: {}
    };

    this.change = event => {
      const editedUser = this.state.editedUser;
      const name = event.target.name;

      editedUser[name] =
        name === "is_private" ? event.target.checked : event.target.value;

      if (event.target.name !== "is_private" && event.target.value === "")
        delete editedUser[name];

      this.setState({ editedUser: editedUser });
    };

    this.getBase64 = file => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const editedUser = this.state.editedUser;
        editedUser.picture_ref = reader.result;
        this.setState({ editedUser: editedUser });
        console.log(editedUser);
      };
      reader.onerror = error => {
        console.log("Error: ", error);
      };
    };
  }

  async componentWillReceiveProps(props) {
    if (props.requestUser) {
      this.props.setUser(this.state.editedUser);
    }
    this.setState({
      user: props.user,
      isEditing: props.isEditing,
      editedUser: {}
    });
  }

  render() {
    const {
      email,
      first_name,
      last_name,
      birth_date,
      guc_id,
      mun_role,
      picture_ref
    } = this.state.user;

    return (
      <Container className="user">
        <Row className="user-row">
          <Media>
            {this.state.isEditing ? (
              <Dropzone
                onDrop={acceptedFiles => this.getBase64(acceptedFiles[0])}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div className="user-dropzone-div" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img
                        width={128}
                        height={128}
                        className="mr-3"
                        src={
                          this.state.editedUser.picture_ref
                            ? this.state.editedUser.picture_ref
                            : "No photo"
                        }
                        alt="Display Pic"
                      />
                    </div>
                  </section>
                )}
              </Dropzone>
            ) : (
              <img
                width={128}
                height={128}
                className="mr-3"
                src={picture_ref ? picture_ref : "No Photo"}
                alt="Display Pic"
              />
            )}
            <Media.Body>
              {this.state.isEditing ? (
                <h4>
                  <Form.Control
                    name="first_name"
                    style={{
                      border: "0",
                      padding: "0",
                      paddingLeft: "6%",
                      margin: "0"
                    }}
                    plaintext
                    type="text"
                    placeholder="First name"
                    onChange={this.change}
                  />
                  <Form.Control
                    name="last_name"
                    style={{
                      border: "0",
                      padding: "0",
                      paddingLeft: "6%",
                      margin: "0"
                    }}
                    plaintext
                    type="text"
                    placeholder="Last name"
                    onChange={this.change}
                  />
                </h4>
              ) : (
                <h4>
                  {(first_name + " " + last_name)
                    .split(" ")
                    .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                    .join(" ")}
                </h4>
              )}
            </Media.Body>
          </Media>
        </Row>
        <Row className="user-row">
          <Col className="user-header" xs={2}>
            EMAIL:
          </Col>
          <Col className="user-other">
            {this.state.isEditing ? (
              <Form.Control
                name="email"
                style={{
                  border: "0",
                  padding: "0",
                  margin: "0",
                  color: "white"
                }}
                plaintext
                type="email"
                placeholder="Email"
                onChange={this.change}
              />
            ) : (
              email
            )}
          </Col>
        </Row>
        <Row className="user-row">
          <Col className="user-header" xs={2}>
            BIRTH DATE:
          </Col>
          <Col className="user-other">
            {this.state.isEditing ? (
              <Form.Control
                name="birth_date"
                style={{
                  border: "0",
                  padding: "0",
                  margin: "0",
                  color: "white"
                }}
                plaintext
                type="date"
                placeholder="Birth date"
                onChange={this.change}
              />
            ) : (
              birth_date.toString().split("T")[0]
            )}
          </Col>
        </Row>
        {this.state.isEditing ? (
          <div>
            <Row className="user-row">
              <Col className="user-header" xs={2}>
                PASSWORD:
              </Col>
              <Col className="user-other">
                <Form.Control
                  name="password"
                  style={{
                    border: "0",
                    padding: "0",
                    margin: "0",
                    color: "white"
                  }}
                  plaintext
                  type="password"
                  placeholder="New password"
                  onChange={this.change}
                />
              </Col>
            </Row>
            <Row className="user-row">
              <Col className="user-header" xs={2}>
                PASSWORD:
              </Col>
              <Col className="user-other">
                <Form.Control
                  name="confirm_password"
                  style={{
                    border: "0",
                    padding: "0",
                    margin: "0",
                    color: "white"
                  }}
                  plaintext
                  type="password"
                  placeholder="Confirm new password"
                  onChange={this.change}
                />
              </Col>
            </Row>
          </div>
        ) : (
          <></>
        )}
        <Row className="user-row">
          <Col className="user-header" xs={2}>
            GUC ID:
          </Col>
          <Col className="user-other">{guc_id}</Col>
        </Row>

        {mun_role !== "none" ? (
          <Row className="user-row">
            <Col className="user-header" xs={2}>
              ROLE:
            </Col>
            <Col className="user-other">
              {mun_role
                .replace("_", " ")
                .split(" ")
                .map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
                .join(" ")}
            </Col>
          </Row>
        ) : (
          <></>
        )}

        {this.state.isEditing ? (
          <Form.Check
            className="register-check"
            label="Keep Me Private"
            defaultChecked={!!this.state.user.is_private}
            type="checkbox"
            name="is_private"
            onChange={this.change}
          />
        ) : (
          <></>
        )}
      </Container>
    );
  }
}

export default User;
