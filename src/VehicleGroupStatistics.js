import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import VehicleGroupStatistic from './VehicleGroupStatistic'

export default class VehicleGroupStatistics extends Component {
  render() {
    return(
      <Grid.Row width={16}>
        <Grid.Column width={16}>
          <Header as='h2' content='Vehicle Info.'/>
        </Grid.Column>
        {this.vehicleGroups.map((vehicleGroup) =>
        <Grid.Column key={vehicleGroup.key} width={4}>
          <VehicleGroupStatistic vehicleGroup={vehicleGroup} />
        </Grid.Column>
        )}
      </Grid.Row>)
  }

  get vehicleGroups() {
    return this.props.vehicleGroups
  }
}
