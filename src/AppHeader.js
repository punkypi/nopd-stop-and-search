import 'semantic-ui-css/semantic.min.css'
import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class AppHeader extends Component {
  render() {
    return(
      <Menu className='AppHeader' fixed='top' inverted>
        <Menu.Item content='NOLA Stop and Search Data' header/>
      </Menu>)
  }
}
