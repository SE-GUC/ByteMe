import React, { Component } from "react";
import "./Home.css";
import { Timeline } from "vertical-timeline-component-for-react";
import API from "../utils/API";
import EventTimeline from "../components/EventTimeline";
import InstagramEmbed from 'react-instagram-embed';
import iconAdd from "../icons/pencil.svg";
import instagram from "../icons/instagram.svg";
import twitter from "../icons/twitter.svg";
import {
  Button,
  Modal,
  ModalFooter
} from "react-bootstrap";
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import SearchBar from "../components/SearchBar";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state =
      {
        user: props.user,
        events: [],
        show: false,
        link: "https://docs.google.com/forms/d/e/1FAIpQLSfaF06d-I4_eLAwSSK3neOTjeD5eOUeM0VyyjCm1M54PORj4g/viewform?embedded=true",
        canEdit: false,
        show2: false,
        showI: false,
        showT: false
      };
    if (this.state.user) {
      if (this.state.user.mun_role === "secretary_office" || this.state.user.awg_admin === "mun"
      ) {
        this.state.canEdit = true;
      }
    }

    this.handleShow = this.handleShow.bind(this)
    this.handleShowI = this.handleShowI.bind(this)
    this.handleShowT = this.handleShowT.bind(this)
    this.handleShow2 = this.handleShow2.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleShow() {
    if (this.state.show === true) {
      this.setState({ show: false });
    }
    else {

      this.setState({ show: true });
    }
  }
  handleShowI() {
    if (this.state.showI === true) {
      this.setState({ showI: false, showT: false });
    }
    else {

      this.setState({ showI: true, showT: false });
    }
  }
  handleShowT() {
    if (this.state.showT === true) {
      this.setState({ showT: false, showI: false });
    }
    else {

      this.setState({ showT: true, showI: false });
    }
  }
  handleClose() {
    this.setState({ show2: false });
  }
  handleShow2() {
    this.setState({ show2: true });
  }
  render() {
    return (
      <div>
       <div id="fb-root"></div>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.2"></script>
        <div className="social">
          <Button
            variant="light"
            className="social-button1"
            onClick={this.handleShowT}
          >
            <img src={twitter} alt="twitter" />
          </Button>
          <Button
            variant='light'
            className="social-button2"
            onClick={this.handleShowI}
          >
            <img src={instagram} alt="instagram" />
          </Button>
          {this.state.showI ?
            (<InstagramEmbed
              url='https://instagr.am/p/BwKCtuhAgOQ/'
              maxWidth={300}
              hideCaption={false}
              containerTagName='div'
            />) : (<></>)}

          {this.state.showT ? (<TwitterTimelineEmbed
            sourceType="profile"
            screenName="gucmun"
            options={{ height: 800, width: 300 }} />)
            : (<></>)}
            
            
           
        </div>
        <Timeline lineColor={"#ffd700"} collapsible className="home">
          {this.state.events.map(event => (
            <EventTimeline
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
        </Timeline>

        <div className="register">
          {this.state.canEdit ? (
            <Button
              variant="warning"
              className="club-create-button"
              onClick={this.handleShow2}
            >
              <img src={iconAdd} alt="Add club" />
            </Button>
          ) : (
              <></>
            )}
          <input
            type="submit"
            onClick={this.handleShow}
            value="Register to our current event"
          />
        </div>
        {this.state.show2 ? (<>
          <Modal
            show={this.state.show2}
            onHide={this.handleClose}

          >
            <Modal.Header closeButton>
              <Modal.Title>Add google form link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* name */}
              <label>Link</label>
              <textarea
                id="link"
                name="Google form link "
                placeholder="Google form link"
                onChange={e => this.setState({ link: e.target.value })}
                value={this.state.link}
              />
            </Modal.Body>
            <ModalFooter>
              <input
                type="submit"
                onClick={this.handleClose}
                value="Done"
              />
            </ModalFooter>
          </Modal>
        </>) : (<></>)}
        <div className="register">
          {this.state.show ? (
            <iframe src={this.state.link} width="640" height="640" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
          )

            : (<></>)}
        </div>

        {//<SearchBar />
        }
      </div>
    );
  }
  async componentDidMount() {
    try {
      API.get("events").then(res => {
        console.log(res.data.data)
        this.setState({ events: res.data.data });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
}

export default Home;
