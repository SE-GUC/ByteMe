import React, { Component } from "react";
import PropTypes from "prop-types";
import { CardDeck } from "react-bootstrap";
import Event from "./Event";
import AWG from "./AWG";
import Announcement from "./Announcement";
import User from "./User";

class searchResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { clubs, events, announcements, users } = this.props;

    return (
      <CardDeck>
        {clubs.map(c => (
          <AWG
            name={c.name}
            description={c.description}
            banner={c.banner}
            link={c.link}
          />
        ))}

        {events.map(e => (
          <Event
            _id={e._id}
            comingSoon={e.comingSoon}
            title={e.title}
            brief={e.brief}
            location={e.location}
            dateTime={e.dateTime}
            description={e.description}
            photos={e.photos}
            feedback={e.feedback}
            creator={e.creator}
            rating={e.rating}
          />
        ))}

        {announcements.map(a => (
          <Announcement date={a.date} info={a.info} />
        ))}

        {/* {users.map(u => (
          <User />
        ))} */}
      </CardDeck>
    );
  }
}

searchResults.propTypes = {
  clubs: PropTypes.arrayOf(Object),
  events: PropTypes.arrayOf(Object),
  announcements: PropTypes.arrayOf(Object),
  users: PropTypes.arrayOf(Object)
};

export default searchResults;
