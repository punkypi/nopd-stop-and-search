import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import VehicleGroupStatistic from './VehicleGroupStatistic'

export default class VehicleGroupStatistics extends Component {
  render() {
    return(
      <Grid.Row color='black'>
        <Grid.Column width={16}>
          <Header as='h2' color='blue' content='Vehicle Info.' inverted/>
        </Grid.Column>
        {this.vehicleGroups.map((vehicleGroup) =>
        <Grid.Column computer={5} key={vehicleGroup.key} largeScreen={4}
          tablet={6}>
          <VehicleGroupStatistic vehicleGroup={vehicleGroup}/>
        </Grid.Column>
        )}
      </Grid.Row>)
  }

  get vehicleGroups() {
    return this.props.vehicleGroups
  }
}
