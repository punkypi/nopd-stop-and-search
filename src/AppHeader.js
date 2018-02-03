import 'semantic-ui-css/semantic.min.css'
import './AppHeader.css'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Image, Menu } from 'semantic-ui-react'

export default class AppHeader extends Component {
  static defaultProps = { title: 'NOLA Stop and Search Data' }
  static propTypes = { title: PropTypes.string }

  render() {
    const { children, title } = this.props
    return(
      <Menu className='AppHeader' color='blue' inverted stackable>
        <Menu.Item header>
          <Image avatar src={`${process.env.PUBLIC_URL}/fleur_de_lis_black.ico`}/>
          { title }
        </Menu.Item>
        { React.Children.map(children, (child, i) =>
          (<Menu.Item content={ child } />)) }
      </Menu>
    )
  }
}
