import React, { Component } from "react";
import PropTypes from "prop-types";
import Announcement from "./Announcement";

import MiniUser from "./MiniUser";
import MiniEvent from "./MiniEvent";
import MiniClub from "./MiniClub";

import "./SearchBar.css"

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = props
  }

  async componentWillReceiveProps(props) {
    this.setState(props);
  }

  render() {
    const { clubs, events, announcements, users } = this.state;
    try {
      return (
        clubs || events || announcements || users ?
          <>
            {users && users.constructor === Array && users.length !== 0 ?
              <p className="padded">Users:</p> : <></>
            }
            {users && users.constructor === Array ?
              users.map(user => {
                return <MiniUser user={user} />
              })
              :
              <></>
            }
            {events && events.constructor === Array && events.length !== 0 ?
              <p className="padded">Events:</p> : <></>
            }
            {events && events.constructor == Array ?
              events.map(event => {
                return (
                  <MiniEvent event={event} />
                );
              })
              :
              <></>
            }
            {clubs && clubs.constructor === Array && clubs.length !== 0 ?
              <p className="padded">Clubs:</p> : <></>
            }
            {clubs && clubs.constructor == Array ?
              clubs.map(club => {
                return (
                  <MiniClub
                    club={club}
                  />
                );
              })
              :
              <></>
            }
            {announcements && announcements.constructor === Array && announcements.length !== 0 ?
              <p className="padded">Announcements:</p> : <></>
            }
            {announcements && announcements.constructor == Array ?
              announcements.map(announcement => {
                return (
                  <div className="padded">
                    <Announcement
                      id={announcement._id}
                      date={announcement.date}
                      info={announcement.info}
                    />
                  </div>
                );
              })
              :
              <></>
            }
          </> :
          <h4>Nothing here!</h4>
      );
    } catch (err) {
      console.log(err);
    }
    return <></>;
  }
}

SearchResults.propTypes = {
  clubs: PropTypes.arrayOf(Object),
  events: PropTypes.arrayOf(Object),
  announcements: PropTypes.arrayOf(Object),
  users: PropTypes.arrayOf(Object)
};

export default SearchResults;
