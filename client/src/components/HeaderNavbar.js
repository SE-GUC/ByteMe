import React, { Component } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../App.css";
import API from "../utils/API";

class HeaderNavbar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            councils: []
        }
    }

    async componentDidMount() {
        API.get("/page").then(res => {
            this.setState({ councils: res.data.data })
        })
    }



    render() {
        return (
            <Navbar bg="blue" variant="dark" sticky="top">

                <Navbar.Brand to="home">GUCMUN</Navbar.Brand>

                <Nav className="mr-auto">

                    <LinkContainer to="/home">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/announcements">
                        <Nav.Link>Announcements</Nav.Link>
                    </LinkContainer>

                    <NavDropdown title="Councils" id="basic-nav-dropdown">
                        {this.state.councils.map(council => {
                            return (
                                <div>
                                    <LinkContainer to={`/councils/${council.name}`}>
                                        <NavDropdown.Item >{council.name}</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider />
                                </div>
                            );
                        })}
                    </NavDropdown>

                    <LinkContainer to="events">
                        <Nav.Link >Events</Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/library">
                        <Nav.Link>Library</Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/merchandise">
                        <Nav.Link >Merchandise</Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/faq">
                        <Nav.Link>FAQ</Nav.Link>
                    </LinkContainer>

                </Nav>

                {
                    this.props.isLoggedIn ?
                        (
                            <Nav>

                                <LinkContainer to="profile">
                                    <Nav.Link>
                                        {(this.props.user.first_name + " " + this.props.user.last_name)
                                            .split(' ').map(i => i[0].toUpperCase() + i.substring(1).toLowerCase()).join(' ') /*toTitleCase *kinda */}
                                    </Nav.Link>
                                </LinkContainer>

                                <LinkContainer to="home">
                                    <Nav.Link onClick={this.props.logout}>Logout</Nav.Link>
                                </LinkContainer>

                            </Nav>
                        ) :
                        (
                            <Nav>

                                <LinkContainer to="register">
                                    <Nav.Link>Register</Nav.Link>
                                </LinkContainer>

                                <LinkContainer to="Login">
                                    <Nav.Link>Login</Nav.Link>
                                </LinkContainer>

                            </Nav>
                        )
                }
            </Navbar>
        );
    }
}

export default HeaderNavbar;
