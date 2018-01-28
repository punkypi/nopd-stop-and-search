import 'semantic-ui-css/semantic.min.css'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class AppHeader extends Component {
  static defaultProps = { title: 'NOLA Stop and Search Data' }
  static propTypes = { title: PropTypes.string }

  render() {
    return(
      <Menu className='AppHeader' inverted stackable>
        <Menu.Item content={ this.props.title } header/>
        { React.Children.map(this.props.children,
          (child, i) => (<Menu.Item content={ child } />)) }
      </Menu>
    )
  }
}
