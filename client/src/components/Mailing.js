import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Mailing.css'
import { ListGroup, Tab, Button } from 'react-bootstrap'
class Mailing extends Component {
  render () {
    const { email } = this.props

    return (
      <Tab.Container id='tab-container'>
        <ListGroup.Item variant='warning'>
          {email}
          <Button variant='primary' className='delete-button'>
            Delete
          </Button>
        </ListGroup.Item>
      </Tab.Container>
    )
  }
}

Mailing.propTypes = {
  email: PropTypes.string,
  isLoading: PropTypes.bool
}

export default Mailing
