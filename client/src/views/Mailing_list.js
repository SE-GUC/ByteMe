import React, { Component } from 'react'
import './Mailing_list.css'
import Mailing from '../components/Mailing'
import { ListGroup } from 'react-bootstrap'

import API from "../utils/API";

import Auth from "../utils/Auth";
// First we create our class
class Mailing_list extends Component {
  // Then we add our constructor which receives our props
  constructor (props) {
    super(props)
    // Next we establish our state
    this.state = {
      isLoading: true,
      mails: []
    }
  }
  // The render function, where we actually tell the browser what it should show
  render () {
    return (
      <div>
        <mail>
          <h1>Subscribers</h1>
          <ListGroup className='mmm'>
            {this.state.mails.map(d => (
              <Mailing email={d.email} />
            ))}
          </ListGroup>
        </mail>
      </div>
    )
  }
  async componentDidMount () {

    try {
      var token = Auth.getToken();
      API.get('mailing_list',{
        headers: {
          Authorization: token
        }
      }).then(res => {
        this.setState({ mails: res.data.data, isLoading: false })
      })
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`)
    }
  }
}

export default Mailing_list
