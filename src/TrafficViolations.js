import React, { Component } from 'react'
import { Container, Grid, Header } from 'semantic-ui-react'
import Date from './Date'
import DateRangeForm from './DateRangeForm'
import TVCountInRangeRequest from './TrafficViolationCountInRangeRequest'
import TVVehicleGroupsInRangeRequest from
  './TrafficViolationVehicleGroupsInRangeRequest'
import VehicleGroupStatistics from './VehicleGroupStatistics'

export default class TrafficViolations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: '...', endDate: Date.now(), startDate: Date.startOfMonth(),
      vehicleGroups: [] }
    this.updateInfo(this.startDate, this.endDate)
  }

  get count() {
    if (!this.startDate || !this.endDate) { return '...' }
    return this.state.count
  }

  get endDate() {
    return this.state.endDate
  }

  // Needs to be binded to `this`
  // (see https://reactjs.org/docs/handling-events.html).
  onDateRangeChange = (selectedRange) => {
    const [newStartDate, newEndDate] = selectedRange
    this.updateInfo(newStartDate, newEndDate)
    this.setState({ endDate: newEndDate, startDate: newStartDate })
  }

  get startDate() {
    return this.state.startDate
  }

  updateInfo(startDate, endDate) {
    new TVCountInRangeRequest({
      startDate: startDate, endDate: endDate,
      onSuccess: (count) => {
        this.setState((prevState, props) => ({ count: count }))
      }}).submit()
    new TVVehicleGroupsInRangeRequest({
      startDate: startDate, endDate: endDate,
      onSuccess: (vehicleGroups) => {
        this.setState((prevState, props) => ({ vehicleGroups: vehicleGroups }))
      }}).submit()
  }

  get vehicleGroups() {
    return this.state.vehicleGroups
  }

  render() {
    return(
      <Container className='TrafficViolations'>
        <Header as='h2' content='Traffic Violations' icon='car'/>
        <Grid container stackable>
          <Grid.Row>
            <Grid.Column width={4}>
              <DateRangeForm startDate={this.startDate} endDate={this.endDate}
                onChange={this.onDateRangeChange} />
            </Grid.Column>
            <Grid.Column textAlign='center' verticalAlign='middle' width={6}>
              <div className='ui huge horizontal statistic'>
                <div className='value'>{this.count}</div>
                <div className='label'>Total</div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <VehicleGroupStatistics vehicleGroups={this.vehicleGroups}/>
        </Grid>
      </Container>)
  }
}
