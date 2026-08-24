import 'semantic-ui-css/semantic.min.css'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'

// Information on the data source this app uses.
export default class AppHeader extends Component {
  static defaultProps = { title: 'About Us' }
  static propTypes = { title: PropTypes.string }

  render() {
    const { title } = this.props
    return(
      <div id='about_us' className='ui'>
        <Header as='h2' color='blue' content={title} icon='info' inverted/>
        <Grid container inverted>
          <Grid.Row color='black' columns={1}>
            <Grid.Column>
              <Header as='h3' color='blue' content='Data Source' inverted/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row color='black' columns={1}>
            <Grid.Column>
              <p>
                This page is backed by <a href='https://data.nola.gov'>
                Data.NOLA.gov</a>'s <a href='http://tinyurl.com/h2sq7du'>
                Stop and Search (Field Interviews)</a>.
              </p>
              <p>
                Unfortunately there doesn't
                seem to have been any new event data added since Nov 2025
                (though there have been updates to the dataset since). As of
                Aug 2026, the dataset's event date range is from 1999-2025
                (NOTE: the density varries, some months/years may have fewer/no events
                compared to others).
              </p>

              <p>
                If you want to learn how to query the database yourself, check
                out <a href='http://tinyurl.com/z9jjsjb'>
                their very helpful Socrata powered API docs</a>.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>)
  }
}
