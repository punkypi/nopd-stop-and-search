import '@blueprintjs/core/dist/blueprint.css'
import '@blueprintjs/datetime/dist/blueprint-datetime.css'
import 'react-addons-css-transition-group'
import './DateRangeFilter.css'
import './TextColors.css'
import Date from './Date'
import { DateRangeInput } from '@blueprintjs/datetime'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Label } from 'semantic-ui-react'

export default class DateRangeFilter extends Component {
  static InputLabel = class extends Component {
    static propTypes = { label: PropTypes.string.isRequired }

    render() {
      const className = `InputLabel ${this.props.className}`
      const label = this.props.label
      return(
        <Label attached='top right' className={className} color='black' tag>
          {label}
        </Label>
      )
    }
  }

  get endDate() {
    return this.props.endDate
  }

  // Needs to be binded to `this`
  // (see https://reactjs.org/docs/handling-events.html).
  onChange = (selectedRange) => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) { return }
    if (selectedRange[0] > selectedRange[1]) { return }
    if (typeof this.props.onChange !== 'function') { return }
    this.props.onChange(selectedRange.map((date) => (
      date && new Date({ year: date.getFullYear(),
        month: date.getMonth() + 1, day: date.getDate() }))))
  }

  render() {
    const InputLabel = this.constructor.InputLabel
    return(
      <div className='DateRangeFilter'>
        <DateRangeInput
          allowSingleDayRange='true'
          className='black-text'
          contiguousCalendarMonths='false'
          endInputProps={{ rightElement: <InputLabel label='End'/> }}
          onChange={this.onChange}
          required
          startInputProps={{ rightElement: <InputLabel label='Start'/> }}
          value={[this.startDate.toJSDate(), this.endDate.toJSDate()]}/>
      </div>
    )
  }

  get startDate() {
    return this.props.startDate
  }
}
