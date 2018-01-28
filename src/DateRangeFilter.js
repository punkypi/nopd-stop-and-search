import '@blueprintjs/core/dist/blueprint.css'
import '@blueprintjs/datetime/dist/blueprint-datetime.css'
import 'react-addons-css-transition-group'
import './TextColors.css'
import Date from './Date'
import { DateRangeInput } from '@blueprintjs/datetime'
import React, { Component } from 'react'
import { Form, Label } from 'semantic-ui-react'

export default class DateRangeForm extends Component {
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
    return(
      <Form className='black-text'>
        <Form.Field
          allowSingleDayRange='true' className='field'
          control={DateRangeInput} contiguousCalendarMonths='false'
          endInputProps={{
            rightElement: <Label attached='top right' tag>End</Label> }}
          onChange={this.onChange}
          startInputProps={{
            rightElement: <Label attached='top right' tag>Start</Label>
          }}
          value={[this.startDate.toJSDate(), this.endDate.toJSDate()]}/>
      </Form>)
  }

  get startDate() {
    return this.props.startDate
  }
}
