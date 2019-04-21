import React, { Component } from "react";
import "./Home.css";
import { Timeline } from "vertical-timeline-component-for-react";
import Auth from "../utils/Auth";
import API from "../utils/API";
import EventTimeline from "../components/EventTimeline";
import InstagramEmbed from "react-instagram-embed";
import iconDelete from "../icons/x.svg";
import iconAdd from "../icons/plus.svg";
import instagram from "../icons/instagram.svg";
import twitter from "../icons/twitter.svg";
import { Button, Modal } from "react-bootstrap";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import SearchBar from "../components/SearchBar";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      events: [],
      show: false,
      link:
        "https://docs.google.com/forms/d/e/1FAIpQLSfaF06d-I4_eLAwSSK3neOTjeD5eOUeM0VyyjCm1M54PORj4g/viewform?embedded=true",
      canEdit: false,
      show2: false,
      show3: false,
      showI: false,
      showT: false,
      links: [],
      canAdd: false
    };
    if (this.state.user) {
      if (
        this.state.user.mun_role === "secretary_office" ||
        this.state.user.awg_admin === "mun"
      ) {
        this.state.canEdit = true;
      }
    }
    /*
    if (this.state.links.length === 1) {
      this.state.canAdd = true;
    }
*/
    this.handleShow = this.handleShow.bind(this);
    this.handleShowI = this.handleShowI.bind(this);
    this.handleShowT = this.handleShowT.bind(this);
    this.handleShow3 = this.handleShow3.bind(this);
    this.handleClose3 = this.handleClose3.bind(this);
    this.handleShow2 = this.handleShow2.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.update = this.update.bind(this);

    this.handleAdd = this.handleAdd.bind(this);
    this.add = this.add.bind(this);
  }

  handleUpdate = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async update(e) {
    e.preventDefault();
    this.setState({ show1: false });
    const { link } = this.state;

    const token = Auth.getToken();

    await API.put(
      `form/${this.state.links[0].link}`,
      {
        link
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      this.props.updatePages();
      window.location.replace(`/home`);
      this.setState({ isLoading: false });
    });
  }
  handleAdd = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async add(e) {
    e.preventDefault();

    const { link } = this.state;
    const token = Auth.getToken();
    await API.post(
      `/form`,
      {
        link
      },
      {
        headers: {
          Authorization: token
        }
      }
    ).then(res => {
      window.location.replace(`/home`);
      this.setState({ isLoading: false, canAdd: false });
    });
  }

  async delete(e) {
    e.preventDefault();
    const token = Auth.getToken();
    await API.delete(`form/${this.state.links[0]._id}`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      window.location.replace("/home");
      this.setState({ isLoading: false, canAdd: true });
    });
  }

  handleShow() {
    this.setState({ show: !this.state.show });
  }

  handleShowI() {
    if (this.state.showI === true) {
      this.setState({ showI: false, showT: false });
    } else {
      this.setState({ showI: true, showT: false });
    }
  }
  handleShowT() {
    if (this.state.showT === true) {
      this.setState({ showT: false, showI: false });
    } else {
      this.setState({ showT: true, showI: false });
    }
  }

  handleClose2() {
    this.setState({ show2: false });
  }
  handleShow2() {
    this.setState({ show2: true });
  }

  handleClose3() {
    this.setState({ show3: false });
  }
  handleShow3() {
    this.setState({ show3: true });
  }

  render() {
    return (
      <div>
        <SearchBar />
        <div id="fb-root" />
        <script
          async
          defer
          crossorigin="anonymous"
          src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.2"
        />
        <div className="social">
          <Button
            variant="light"
            className="social-button1"
            onClick={this.handleShowT}
          >
            <img src={twitter} alt="twitter" />
          </Button>
          <Button
            variant="light"
            className="social-button2"
            onClick={this.handleShowI}
          >
            <img src={instagram} alt="instagram" />
          </Button>
          {this.state.showI ? (
            <InstagramEmbed
              url="https://instagr.am/p/BwKCtuhAgOQ/"
              maxWidth={300}
              hideCaption={false}
              containerTagName="div"
            />
          ) : (
            <></>
          )}

          {this.state.showT ? (
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="gucmun"
              options={{ height: 800, width: 300 }}
            />
          ) : (
            <></>
          )}
        </div>
        {/* facebook starts here */}
        {/* <div id="fb-root" />
        <script
          async
          defer
          crossorigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=390253315039099&autoLogAppEvents=1"
        />
        <div
          class="fb-page"
          data-href="https://www.facebook.com/GUCMUN"
          data-tabs="timeline, messages"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote
            cite="https://www.facebook.com/facebook"
            class="fb-xfbml-parse-ignore"
          >
            <a href="https://www.facebook.com/facebook">Facebook</a>
          </blockquote>
        </div> */}
        {/* facebook ends here */}
        <Timeline lineColor={"#ffd700"} collapsible className="home">
          {this.state.events.map(event => (
            <EventTimeline
              title={event.title}
              brief={event.brief}
              dateTime={event.dateTime}
              description={event.description}
            />
          ))}
        </Timeline>
        <div className="register">
          {this.props.isLoggedIn &&
          (this.props.user.mun_role === "secretary_office" ||
            this.props.user.awg_admin === "mun") &&
          this.state.links[0] ? (
            <Button
              variant="warning"
              className="buttonP"
              onClick={this.handleShow3}
            >
              <img src={iconDelete} alt="Delete page" />
            </Button>
          ) : (
            <Button
              variant="warning"
              className="buttonP"
              onClick={this.handleShow2}
            >
              <img src={iconAdd} alt="Add new Member" />
            </Button>
          )}

          {this.state.links.map(link => (
            <input
              type="submit"
              onClick={this.handleShow}
              value="Register to our current event"
            />
          ))}
        </div>
        <Modal show={this.state.show2} onHide={this.handleClose2}>
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
          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.add(e)}>
              ADD
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.show3} onHide={this.handleClose3}>
          <Modal.Header closeButton>
            <Modal.Title>
              Are you sure you want to delete this registration link ?
            </Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.delete(e)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="register">
          {this.state.show ? (
            <iframe
              src={this.state.links[0].link}
              title="iframe"
              width="640"
              height="640"
              frameborder="0"
              marginheight="0"
              marginwidth="0"
            >
              Loading...
            </iframe>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
  async componentDidMount() {
    try {
      API.get("events").then(res => {
        console.log(res.data.data);
        this.setState({ events: res.data.data });

        API.get(`form`).then(res => {
          this.setState({ links: res.data.data, isLoading: false });
        });
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }

    //   window.fbAsyncInit = function() {
    //     FB.init({
    //       appId: "390253315039099",
    //       xfbml: true,
    //       version: "v2.6"
    //     });

    //     FB.getLoginStatus(function(response) {
    //       //this.statusChangeCallback(response);
    //     });
    //   };

    //   (function(d, s, id) {
    //     var js,
    //       fjs = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) {
    //       return;
    //     }
    //     js = d.createElement(s);
    //     js.id = id;
    //     js.src = "//connect.facebook.net/en_US/sdk.js";
    //     fjs.parentNode.insertBefore(js, fjs);
    //   })(document, "script", "facebook-jssdk");
  }
}

export default Home;
