import 'normalize.css/normalize.css'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import AppBody from './AppBody.js'
import AppHeader from './AppHeader.js'
import AppFooter from './AppFooter.js'

export default class App extends Component {
  render() {
    return(
      <Grid container>
        <Grid.Row>
          <Grid.Column>
            <AppHeader/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <AppBody/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <AppFooter/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
