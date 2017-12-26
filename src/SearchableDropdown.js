import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import OptionalLabel from './OptionalLabel'


export default class SearchableDropdown extends Component {
  // props.options must be in
  // [{ key: 'AL', value: 'AL', text: 'Alabama' }, ...] format
  constructor(props) {
    super(props)
    this.state = {
      label: props.label,
      options: props.options,
      placeholder: props.placeholder,
      value: props.value
    }
  }

  get label() {
    return this.state.label
  }

  // Needs to be binded to `this`
  // (see https://reactjs.org/docs/handling-events.html).
  onChange = (event, data) => {
    if (typeof this.props.onChange !== 'function') return
    this.props.onChange(event, data)
  }

  get options() {
    return this.state.options
  }

  get placeholder() {
    return this.state.placeholder
  }

  render() {
    return(
      <div className='ui field'>
        <OptionalLabel text={this.label}/>
        <Dropdown
          onChange={this.onChange}
          options={this.options} placeholder={this.placeholder}
          search selection value={this.props.value} />
      </div>)
  }
}
