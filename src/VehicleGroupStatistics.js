import capitalize from 'lodash/capitalize'
import defaultTo from 'lodash/defaultTo'
import isString from 'lodash/isString'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Button, Dropdown, Grid, Header, Input, Menu } from 'semantic-ui-react'
import Hideable from './Hideable'
import mix from './Mix'
import VehicleGroup from './VehicleGroup'
import VehicleGroupStatistic from './VehicleGroupStatistic'

/**
 * A display of VehicleGroup data.
 * @param {Object} props
 * @param {VehicleGroup[]} props.vehicleGroup
 *  the vehicle group data to display
 */
export default class VehicleGroupStatistics extends mix(Component)
  .with(Hideable) {
  /**
   * {@link https://tinyurl.com/y99x855j}
   */
  static get defaultProps() {
   return { searchTerm: '', sortBy: 'count', sortDirection: 'asc',
     vehicleGroups: [] }
  }

  /**
   * {@link https://tinyurl.com/y88qod7y}
   */
  static get propTypes() {
    return {
      searchTerm: PropTypes.string, sortBy: PropTypes.string,
      sortDirection: PropTypes.string,
      vehicleGroups: PropTypes.arrayOf(PropTypes.instanceOf(VehicleGroup))
    }
  }

  /**
   * @type {string[]}
   *  which VehicleGroup properties the user can search through
   */
  static get searchableData() {
    return ['count', 'make', 'model']
  }

  /**
   * @type {string[]}
   *  which VehicleGroup properties the user can sort by
   */
  static get sortableData() {
   return ['count', 'make', 'model']
  }

  constructor(props) {
    super(props)
    this.state = Object.assign({}, this.state || {},
      { searchTerm: props.searchTerm, sortBy: props.sortBy,
        sortDirection: props.sortDirection })
  }

  /**
   * Needs to be binded to `this`.
   * Compares two VehicleGroup values based on {@link #sortBy} and
   * {@link #sortDirection}.
   * @param {VehicleGroup} first
   * @param {VehicleGroup} second
   * @return {number}
   *  negative if first is before second, positive if first after second
   */
  compareVehicleGroups = (first, second) => {
    const firstDatum = first[this.sortBy]
    const secondDatum = second[this.sortBy]
    const numberCompare = (first, second) => (Number(first) - Number(second))
    const stringCompare = (first, second) =>
      (first.localeCompare(second, { numeric: true, sensitivity: 'base' }))
    let result = 0
    if (Number(firstDatum) && Number(secondDatum)) {
      result = numberCompare(firstDatum, secondDatum)
    } else if (isString(firstDatum) && isString(secondDatum)) {
      result = stringCompare(firstDatum, secondDatum)
    }
    if (this.sortDirection !== 'asc') { return -result }
    return result
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
    this.toggleVisibilty()
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
   * Needs to be binded to `this`.
   * @see {@link https://reactjs.org/docs/handling-events.html}
   * @method
   * @param {SyntheticEvent} event
   *  https://reactjs.org/docs/events.html
   */
  onSortByClick = (event, data) => {
    const newSortBy = data.content.toLowerCase()
    if (newSortBy !== this.sortBy) { this.setState({ sortBy: newSortBy }) }
  }

  /**
   * Needs to be binded to `this`.
   * @see {@link https://reactjs.org/docs/handling-events.html}
   * @method
   * @param {SyntheticEvent} event
   *  https://reactjs.org/docs/events.html
   */
  onSortDirectionClick = (event) => {
    this.toggleSortDirection()
  }

  /**
   * {@link https://reactjs.org/docs/react-component.html#render}
   */
  render() {
    const { hideButtonText, onHideButtonClick, onSearchChange, onSortByClick,
      onSortDirectionClick, sortBy, sortIcon, sortableData, vehicleGroups,
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
            <Menu.Item>
              <Dropdown item text='Sort By'>
                <Dropdown.Menu>
                  {sortableData.map((name) =>
                  <Dropdown.Item active={sortBy === name}
                    content={capitalize(name)} key={name}
                    onClick={onSortByClick}/>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            }
            {visible &&
            <Menu.Item icon={sortIcon} onClick={onSortDirectionClick}/>
            }
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
    return defaultTo(this.state.searchTerm, '').toLowerCase()
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
   * @return {string}
   *  which sortable data column to sort {@link #vehicleGroups} by
   */
  get sortBy() {
    return defaultTo(this.state.sortBy, 'count')
  }

  /**
   * @see .sortableData
   * @return {string[]}
   *  which VehicleGroup data the user may sort by
   */
  get sortableData() {
    return this.constructor.sortableData
  }

  /**
   * @return {string}
   *  which way (ascending, descending) or sort {@link #vehicleGroups}
   */
  get sortDirection() {
    return defaultTo(this.state.sortDirection, 'asc').toLowerCase()
  }

  /**
   * @return {string}
   *  the long form name of the Semantic UI sort icon to use
   */
  get sortIcon() {
    if (this.sortDirection === 'asc') { return 'sort content ascending' }
    return 'sort content descending'
  }

  /**
   * Reverses {@link #sortDirection} (ascending becomes descening).
   */
  toggleSortDirection() {
    if (this.sortDirection === 'asc') {
      this.setState({ sortDirection: 'desc' })
    } else {
      this.setState({ sortDirection: 'asc' })
    }
  }

  /**
   * If {@link VehicleGroupStatistics#searchTerm} isn't empty, filters in
   * matching {@link VehicleGroup}.
   * @return {VehicleGroup[]}
   *  which VehicleGroup to display
   */
  get vehicleGroups() {
    return this.searchedVehicleGroups().sort(this.compareVehicleGroups)
  }

  /**
   * If {@link VehicleGroupStatistics#searchTerm} isn't empty, filters in
   * matching {@link VehicleGroup}.
   * @return {VehicleGroup[]}
   *  which VehicleGroup to display
   */
  searchedVehicleGroups() {
    if (!this.searchTerm) { return this.props.vehicleGroups }
    return this.props.vehicleGroups.filter(vehicleGroup =>
      this.searchableData.some(datum =>
        String(vehicleGroup[datum]).toLowerCase().includes(this.searchTerm)))
  }
}
