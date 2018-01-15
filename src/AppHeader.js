import 'semantic-ui-css/semantic.min.css'
import React, { Component } from 'react'
import { Grid, Menu } from 'semantic-ui-react'

export default class AppHeader extends Component {
  render() {
    return(
      <Grid.Row>
        <Grid.Column>
          <Menu className='AppHeader' fixed='top' inverted>
            <Menu.Item content={ this.props.title } header/>
            { this.props.children }
          </Menu>
          <br/>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
