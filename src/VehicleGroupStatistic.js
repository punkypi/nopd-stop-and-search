import './VehicleGroupStatistic.css'
import React, { Component } from 'react'
import { Statistic } from 'semantic-ui-react'

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
    let content
    if (this.make && this.model) {
      content =
        <div>
          {this.make}
          <br/>
          {this.model}
        </div>
    }
    else if (this.make && !this.model) {
      content = this.make
    }
    else if (!this.make && this.model) {
      content = this.model
    }
    else {
      content = 'Not Provided'
    }
    return(<Statistic.Label content={content}/>)
  }

  get make() {
    return this.vehicleGroup.make
  }

  get model() {
    return this.vehicleGroup.model
  }

  render() {
    const count = this.count
    const key = this.key
    const label = this.label
    return(
      <Statistic className='VehicleGroupStatistic'
        horizontal inverted key={key} label={label} value={count}/>)
    }

  get vehicleGroup() {
    return this.state.vehicleGroup
  }
}
