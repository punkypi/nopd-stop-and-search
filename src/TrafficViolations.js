import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Container, Grid, Header, Statistic } from 'semantic-ui-react'
import Date from './Date'
import TVCountInRangeRequest from './TrafficViolationCountInRangeRequest'
import TVVehicleGroupsInRangeRequest from
  './TrafficViolationVehicleGroupsInRangeRequest'
import VehicleGroup from './VehicleGroup'
import VehicleGroupStatistics from './VehicleGroupStatistics'

/**
 * A display of Traffic Violation data.
 * @param {Object} props
 * @param {string} props.count
 *  how many total traffic violations there are
 * @param {Date} props.endDate
 *  the inclusive end of the date range
 * @param {Date} props.startDate
 *  the inclusive start of the date range
 * @param {VehicleGroup[]} props.vehicleGroups
 *  a collection of vehicle group data
 */
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

  /**
   * @see {@link https://tinyurl.com/y93edy52}
   * @param {Object} newProps
   */
  componentWillReceiveProps(newProps) {
    this.updateInfo(newProps.startDate, newProps.endDate)
  }

  /**
   * @return {string}
   *  how many total traffic violations there are in the date range
   */
  get count() {
    if (!this.props.startDate || !this.props.endDate) { return '...' }
    return this.state.count
  }

  /**
   * {@link https://reactjs.org/docs/react-component.html#render}
   */
  render() {
    const { count, vehicleGroups } = this
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

  /**
   * Asynchronously updates {@link #count} and {@link #vehicleGroups}.
   * @param {Date} startDate
   *  the inclusive start of the date range
   * @param {Date} endDate
   *  the inclusive end of the date range
   */
  updateInfo(startDate, endDate) {
    new TVCountInRangeRequest({
      startDate: startDate, endDate: endDate,
      onSuccess: (count) => { this.setState({ count: count }) }
    }).submit()
    new TVVehicleGroupsInRangeRequest({
      startDate: startDate, endDate: endDate,
      onSuccess: (vehicleGroups) => {
        this.setState({ vehicleGroups: vehicleGroups }) }
    }).submit()
  }

  /**
   * @return {VehicleGroup[]}
   *  a collection vehicle group data
   */
  get vehicleGroups() {
    return this.state.vehicleGroups
  }
}
