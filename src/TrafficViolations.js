import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Container, Grid, Header, Statistic } from 'semantic-ui-react'
import Date from './Date'
import TVCountInRangeRequest from './TrafficViolationCountInRangeRequest'
import TVVehicleGroupsInRangeRequest from
  './TrafficViolationVehicleGroupsInRangeRequest'
import VehicleGroup from './VehicleGroup'
import VehicleGroupStatistics from './VehicleGroupStatistics'

export default class TrafficViolations extends Component {
  static defaultProps = {
    count: '...',
    endDate: Date.now(),
    startDate: Date.startOfMonth(),
    vehicleGroups: []
  }

  static propTypes = {
    count: PropTypes.string,
    endDate: PropTypes.instanceOf(Date).isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    vehicleGroups: PropTypes.arrayOf(PropTypes.instanceOf(VehicleGroup))
  }

  constructor(props) {
    super(props)
    this.state = { count: props.count, vehicleGroups: props.vehicleGroups }
    this.updateInfo(props.startDate, props.endDate)
  }

  // (see https://tinyurl.com/y93edy52)
  componentWillReceiveProps(newProps) {
    this.updateInfo(newProps.startDate, newProps.endDate)
  }

  get count() {
    if (!this.props.startDate || !this.props.endDate) { return '...' }
    return this.state.count
  }

  render() {
    const count = this.count
    const vehicleGroups = this.vehicleGroups
    return(
      <Container className='TrafficViolations'>
        <Header as='h2' color='blue' content='Traffic Violations'
          icon='car' inverted/>
        <Grid container inverted stackable>
          <Grid.Row color='black'>
            <Grid.Column textAlign='center' verticalAlign='middle'>
              <Statistic horizontal inverted label='Total' size='huge'
                value={count}/>
            </Grid.Column>
          </Grid.Row>
          <VehicleGroupStatistics vehicleGroups={vehicleGroups}/>
        </Grid>
      </Container>)
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
}
