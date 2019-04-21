import React, { Component } from "react";
import Page from "../components/Page";
import "./Pages.css";
import Event from "../components/Event";
import "./Events.css";
import Member from "../components/Member";
import API from "../utils/API";
import { Button, ButtonGroup, CardDeck } from "react-bootstrap";

// First we create our class
class Pages extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);
    this.updatePages = this.updatePages.bind(this);
    // Next we establish our state
    this.state = {
      show: false,
      show1: false,
      show2: false,
      isLoading: true,
      pages: [],
      events: [],
      members: []
    };
  }

  handleOne() {
    this.setState({ show: true });
    this.setState({ show1: true });
    this.setState({ show2: false });
  }

  handleTwo() {
    this.setState({ show: true });
    this.setState({ show1: false });
    this.setState({ show2: true });
  }

  // The render function, where we actually tell the browser what it should show
  render() {
    return (
      <div>
        <pages>
          {this.state.pages.map(page => (
            <Page
              isLoggedIn={this.props.isLoggedIn}
              user={this.props.user}
              loc={this.props.location}
              logout={this.props.logout}
              name={page.name}
              role_to_control={page.role_to_control}
              description={page.description}
              members={page.members}
              _id={page._id}
              url={this.props.location.pathname}
              updatePages={this.updatePages}
            />
          ))}
          <div className="x">
          <ButtonGroup className="events-members">
           
            <Button
              className="events"
              variant="secondary"
              onClick={() => this.handleOne()}
            >
              Events
            </Button>
            <Button
              className="members"
              variant="secondary"
              onClick={() => this.handleTwo()}
            >
              Our People
            </Button>
          </ButtonGroup>
          </div>
          
          {this.state.show && this.state.show1 ? (
            <CardDeck className="deck">
              {this.state.events.map(event => (
                <Event
                  _id={event._id}
                  comingSoon={event.comingSoon}
                  title={event.title}
                  brief={event.brief}
                  location={event.location}
                  dateTime={event.dateTime}
                  description={event.description}
                  photos={event.photos}
                  comments={event.comments}
                  rates={event.rates}
                  creator={event.creator}
                  rating={event.rating}
                />
              ))}
            </CardDeck>
          ) : null}
          {this.state.show && this.state.show2 ? (
            <CardDeck>
              {this.state.members.map(member => (
                <Member
                  isLoggedIn={this.props.isLoggedIn}
                  user={this.props.user}
                  logout={this.props.logout}
                  email={member.email}
                  first_name={member.first_name}
                  last_name={member.last_name}
                  birth_date={member.birth_date}
                  guc_id={member.guc_id}
                  picture_ref={member.picture_ref}
                  mun_role={member.mun_role}
                  url={this.props.location.pathname}
                  role_to_control={this.state.pages[0].role_to_control}
                  page_name={this.state.pages[0].name}
                  updatePages={this.updatePages}
                />
              ))}
            </CardDeck>
          ) : null}
        </pages>
      </div>
    );
  }
  async componentDidMount() {
    this.updatePages();
  }

  updatePages() {
    try {
      this.setState({ isLoading: true });
      var pathArray = this.props.location.pathname.split("/");
      const secondLevelLocation = pathArray[2];
      API.get(`page/${secondLevelLocation}/events`).then(res => {
        this.setState({ events: res.data.data, isLoading: false });
      });

      API.get(`page/${secondLevelLocation}`).then(res => {
        this.setState({ pages: res.data.data, isLoading: false });
      });

      API.get(`page/${secondLevelLocation}/members`).then(res => {
        this.setState({ members: res.data.data, isLoading: false });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Pages;
