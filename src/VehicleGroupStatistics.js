import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import VehicleGroupStatistic from './VehicleGroupStatistic'

export default class VehicleGroupStatistics extends Component {
  render() {
    return(
      <Grid.Row>
        <Grid.Column width={16}>
          <Header as='h2' content='Vehicle Info.'/>
        </Grid.Column>
        {this.vehicleGroups.map((vehicleGroup) =>
        <Grid.Column computer={5} key={vehicleGroup.key} largeScreen={4}
          tablet={6}>
          <VehicleGroupStatistic vehicleGroup={vehicleGroup} />
        </Grid.Column>
        )}
      </Grid.Row>)
  }

  get vehicleGroups() {
    return this.props.vehicleGroups
  }
}
