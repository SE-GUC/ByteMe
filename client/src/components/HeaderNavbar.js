import React, { Component } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import "../App.css";
import API from "../utils/API";

class HeaderNavbar extends Component {



    constructor(props) {
        super(props)

        this.state = {
            isLogged: false,
            councils: []
        }

        this.login = () => {
            this.setState({ isLogged: true })
        }

        this.logout = () => {
            this.setState({ isLogged: false })
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
                <Navbar.Brand href="home">GUCMUN</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="home">Home</Nav.Link>
                    <Nav.Link href="announcements">Announcements</Nav.Link>
                    <NavDropdown title="Councils" id="basic-nav-dropdown">
                        {this.state.councils.map(council => {
                            console.log(council.name)
                            return (
                                <div>
                                    <NavDropdown.Item href={`councils-${council.name}`}>
                                        {council.name}
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                </div>
                            );
                        })}
                    </NavDropdown>
                    <Nav.Link href="events">Events</Nav.Link>
                    <Nav.Link href="library">Library</Nav.Link>
                    <Nav.Link href="merchandise">Merchandise</Nav.Link>
                    <Nav.Link href="faq">FAQ</Nav.Link>
                </Nav>

                {
                    this.state.isLogged ?
                        (
                            <Nav>
                                <Nav.Link href="profile">Profile</Nav.Link>
                                <Nav.Link onClick={this.logout}>Logout</Nav.Link> {/*why are href not working here?*/}
                            </Nav>
                        ) :
                        (
                            <Nav>
                                <Nav.Link href="register">Register</Nav.Link>
                                <Nav.Link onClick={this.login}>Login</Nav.Link>
                            </Nav>
                        )
                }
            </Navbar>
        );
    }
}

export default HeaderNavbar;
