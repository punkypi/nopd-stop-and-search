import React, { Component } from 'react'
import { Container, Statistic } from 'semantic-ui-react'

export default class VehicleGroupStatistic extends Component {
  constructor(props) {
    super(props)
    this.state = { vehicleGroup: props.vehicleGroup }
  }

  get count() {
    return this.vehicleGroup.count
  }

  get key() {
    return this.vehicleGroup.key
  }

  get label() {
    if (this.make && this.model) {
      return(
        <Container textAlign='left'>
          {this.make}
          <br/>
          {this.model}
        </Container>)
    }
    else if (this.make && !this.model) {
      return(
        <Container textAlign='left'>
          {this.make}
        </Container>)
    }
    else if (!this.make && this.model) {
      return(
        <Container textAlign='left'>
          {this.model}
        </Container>)
    }
    else {
      return(
        <Container textAlign='left'>
          NOT PROVIDED
        </Container>)
    }
  }

  get make() {
    return this.vehicleGroup.make
  }

  get model() {
    return this.vehicleGroup.model
  }

  render() {
    return(
      <Statistic horizontal
        key={this.key}
        label={this.label}
        value={this.count}/>)
    }

  get vehicleGroup() {
    return this.state.vehicleGroup
  }
}
