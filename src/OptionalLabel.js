import React, { Component } from 'react'

export default class OptionalLabel extends Component {
  constructor(props) {
    super(props)
    this.state = { for: props.for, text: props.text }
  }

  get for() {
    if (this.state.for) return this.state.for
    return ''
  }

  get text() {
    if (this.textPresent()) return this.state.text
    return ''
  }

  textPresent() {
    return typeof this.state.text !== 'undefined' && this.state.text !== null
  }

  get visibility() {
    if (this.textPresent()) return ''
    return 'hidden'
  }

  render() {
    if (this.textPresent()) {
      return(
        <label className='OptionalLabel'>
          {this.text}
        </label>)
    }
    else {
      return(
        <label className='OptionalLabel' hidden>
          {this.text}
        </label>)
    }
  }
}
