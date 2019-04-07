import React, { Component } from 'react'
import AWG from '../components/AWG'
import './Club.css'
import API from '../utils/API'

// First we create our class
class Club extends Component {
  // Then we add our constructor which receives our props
  constructor (props) {
    super(props)
    // Next we establish our state
    this.state = {
      isLoading: true,
      clubs: []
    }
  }
  // The render function, where we actually tell the browser what it should show
  render () {
    return (
      <div>
        <club>
          <h1>AWGs</h1>
          <clubgroup>
            {this.state.clubs.map(A => (
              <AWG
                name={A.name}
                description={A.description}
                banner={A.banner}
                link={A.link}
              />
            ))}
          </clubgroup>
        </club>
      </div>
    )
  }
  async componentDidMount () {
    try {
      API.get('clubs').then(res => {
        this.setState({ clubs: res.data.data, isLoading: false })
      })
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`)
    }
  }
}

export default Club
