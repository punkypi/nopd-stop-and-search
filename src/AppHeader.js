import 'semantic-ui-css/semantic.min.css'
import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

export default class AppHeader extends Component {
  render() {
    return(
      <Header as='h1' className='AppHeader'
        content='NOLA Stop and Search Data'/>)
  }
}
