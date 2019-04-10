import React, { Component } from "react";
import PropTypes from "prop-types";
import { CardDeck } from "react-bootstrap";
import Event from "./Event";
import AWG from "./AWG";
import Announcement from "./Announcement";
import User from "./User";

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {},
      clubs: {},
      events: {},
      announcements: {}
    }
  }

  async componentWillReceiveProps(props) {
    this.setState(props);
  }

  render() {
    const { clubs, events, announcements, users } = this.state;
    console.log(users)
    try {
      return (
        <div>
          {users && users.constructor === Array ?
            users.map(user => {
              return <User user={user} />
            })
            : <></>}
          {events && events.constructor == Array ?
            events.map(event => {
              return <Event
                _id={event._id}
                comingSoon={event.comingSoon}
                title={event.title}
                brief={event.brief}
                location={event.location}
                dateTime={event.dateTime}
                description={event.description}
                photos={event.photos}
                feedback={event.feedback}
                creator={event.creator}
                rating={event.rating}
              />
            })
            : <></>}

          {//format enta ba2a bera7tak we esta3mel miniUser 3ashan gamed
          }
        </div>
      )
    } catch (err) {
      console.log(err)
    }
    return (<></>)
  }
}
/*
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
          */




// </CardDeck>

SearchResults.propTypes = {
  clubs: PropTypes.arrayOf(Object),
  events: PropTypes.arrayOf(Object),
  announcements: PropTypes.arrayOf(Object),
  users: PropTypes.arrayOf(Object)
};

export default SearchResults;
