import DefaultTo from 'lodash/defaultTo'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Button, Grid, Header, Input, Menu } from 'semantic-ui-react'
import VehicleGroup from './VehicleGroup'
import VehicleGroupStatistic from './VehicleGroupStatistic'

/**
 * A display of VehicleGroup data.
 * @param {Object} props
 * @param {VehicleGroup[]} props.vehicleGroup
 *  the vehicle group data to display
 */
export default class VehicleGroupStatistics extends Component {
  static defaultProps = { hidden: false, searchTerm: '' }

  static propTypes =
    { vehicleGroups: PropTypes.arrayOf(PropTypes.instanceOf(VehicleGroup)) }

  /**
   * @type {string[]}
   *  which VehicleGroup properties the user can search through
   */
  static searchableData = ['count', 'make', 'model']

  constructor(props) {
    super(props)
    this.state = { hidden: props.hidden, searchTerm: props.searchTerm }
  }

  /**
   * @return {boolean}
   *  if the component is "hidden"
   */
  get hidden() {
    return DefaultTo(this.state.hidden, false)
  }

  /**
   * @return {string}
   *  the "Hide" button's visible text
   */
  get hideButtonText() {
    if (this.hidden) { return 'Show' }
    return 'Hide'
  }

  /**
   * Needs to be binded to `this`.
   * @see {@link https://reactjs.org/docs/handling-events.html}
   * @method
   * @param {SyntheticEvent} event
   *  https://reactjs.org/docs/events.html
   */
  onHideButtonClick = (event) => {
    this.setState({ hidden: !this.hidden })
  }

  /**
   * Needs to be binded to `this`.
   * @see {@link https://reactjs.org/docs/handling-events.html}
   * @method
   * @param {SyntheticEvent} event
   *  https://reactjs.org/docs/events.html
   */
  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value })
  }

  /**
   * {@link https://reactjs.org/docs/react-component.html#render}
   */
  render() {
    const { hideButtonText, onHideButtonClick, onSearchChange, vehicleGroups,
      visible } = this
    return(
      <Grid.Row color='black'>
        <Grid.Column width={16}>
          <Menu inverted secondary stackable>
            <Menu.Item header>
              <Header as='h2' color='blue' content='Vehicle Info.' inverted/>
            </Menu.Item>
            <Menu.Item>
              <Button.Group compact inverted toggle>
                <Button active={visible} basic content={hideButtonText}
                  color='black' inverted onClick={onHideButtonClick}/>
              </Button.Group>
            </Menu.Item>
            {visible &&
            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' onChange={onSearchChange}
                  placeholder='Search...'/>
              </Menu.Item>
            </Menu.Menu>
            }
          </Menu>
        </Grid.Column>
        {visible && vehicleGroups.map((vehicleGroup) =>
        <Grid.Column computer={5} key={vehicleGroup.key} largeScreen={4}
          tablet={6}>
          <VehicleGroupStatistic vehicleGroup={vehicleGroup}/>
        </Grid.Column>
        )}
      </Grid.Row>
    )
  }

  /**
   * @return {string}
   *  what data the user wants to filter in
   */
  get searchTerm() {
    return DefaultTo(this.state.searchTerm, '').toLowerCase()
  }

  /**
   * @see .searchableData
   * @return {string[]}
   *  which VehicleGroup data the user may filter through
   */
  get searchableData() {
    return this.constructor.searchableData
  }

  /**
   * If {@link VehicleGroupStatistics#searchTerm} isn't empty, filters in
   * matching {@link VehicleGroup}.
   * @return {VehicleGroup[]}
   *  which VehicleGroup to display
   */
  get vehicleGroups() {
    if (!this.searchTerm) { return this.props.vehicleGroups }
    return this.props.vehicleGroups.filter(vehicleGroup =>
      this.searchableData.some(datum =>
        String(vehicleGroup[datum]).toLowerCase().includes(this.searchTerm)))
  }

  /**
   * @see #hidden
   * @return {boolean}
   *  if the component is not "hidden"
   */
  get visible() {
    return !this.hidden
  }
}
