import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Grid, Header, Input, Menu } from 'semantic-ui-react'
import VehicleGroup from './VehicleGroup'
import VehicleGroupStatistic from './VehicleGroupStatistic'

export default class VehicleGroupStatistics extends Component {
  static propTypes =
    { vehicleGroups: PropTypes.arrayOf(PropTypes.instanceOf(VehicleGroup)) }

  // Which VehicleGroup properties the user can search through
  static searchableData = ['count', 'make', 'model']

  constructor(props) {
    super(props)
    this.state = { searchTerm: '' }
  }

  // Needs to be binded to `this`
  // (see https://reactjs.org/docs/handling-events.html).
  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value })
  }

  render() {
    const onSearchChange = this.onSearchChange
    const vehicleGroups = this.vehicleGroups
    return(
      <Grid.Row color='black'>
        <Grid.Column width={16}>
          <Menu inverted secondary stackable>
            <Menu.Item header>
              <Header as='h2' color='blue' content='Vehicle Info.' inverted/>
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' onChange={onSearchChange}
                  placeholder='Search...'/>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Grid.Column>
        {vehicleGroups.map((vehicleGroup) =>
        <Grid.Column computer={5} key={vehicleGroup.key} largeScreen={4}
          tablet={6}>
          <VehicleGroupStatistic vehicleGroup={vehicleGroup}/>
        </Grid.Column>
        )}
      </Grid.Row>
    )
  }

  /**
   * @return {string} what data the user wants to filter in
   */
  get searchTerm() {
    return this.state.searchTerm.toLowerCase() || ''
  }

  /**
   * @see .searchableData
   * @return {string[]} which VehicleGroup data the user may filter through
   */
  get searchableData() {
    return this.constructor.searchableData
  }

  get vehicleGroups() {
    if (!this.searchTerm) { return this.props.vehicleGroups }
    return this.props.vehicleGroups.filter((vehicleGroup) => {
      return this.searchableData.map(datum => vehicleGroup[datum])
        .map(datum => String(datum).toLowerCase())
        .some(datum => datum.includes(this.searchTerm))
    })
  }
}
