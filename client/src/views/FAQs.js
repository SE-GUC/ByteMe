import React, { Component } from "react";
import FAQ from "../components/FAQ";
import "./FAQs.css";
import API from "../utils/API";
import { ListGroup, Tab } from "react-bootstrap";

// First we create our class
class FAQs extends Component {
    // Then we add our constructor which receives our props
    constructor(props) {
        super(props);
        // Next we establish our state
        this.state = {
            isLoading: true,
            faqs: []
        };
    }
    // The render function, where we actually tell the browser what it should show
    render() {
        return (
            <div>
                <faqs>
                    <h1>FAQs</h1>

                    <ListGroup>
                        {this.state.faqs.map(faq => (
                            <FAQ Question={faq.Question} Answer={faq.Answer} />
                        ))}
                    </ListGroup>
                </faqs>
            </div>
        );
    }
    async componentDidMount() {
        try {
            API.get("faq").then(res => {
                this.setState({ faqs: res.data.data, isLoading: false });
            });
        } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
        }
    }
}

export default FAQs;

