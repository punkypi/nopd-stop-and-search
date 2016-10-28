import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register('info', {
    viewModel: ViewModel,
    template: `
      <div id="about" class="ui container grid">
        <div class="title row">
          <h2 class="ui header">
            <i class="info icon"></i>
            <div class="content" data-bind="text: title()"></div>
          </h2>
        </div>
        <div class="content row">
          <div class="container">
            <h3 class="ui header">
              Data Source
            </h3>
            <p>
              This page is backed by <a href="https://data.nola.gov">
              Data.NOLA.gov</a>'s <a href="http://tinyurl.com/h2sq7du">
              Stop and Search (Field Interviews)</a>. Thank you, NOPD, for
              making this information public.
            </p>

            <p>
              If you want to learn how to query the database yourself, check
              out <a href="http://tinyurl.com/z9jjsjb">
              their very helpful Socrata powered API docs</a>.
            </p>
          </div>
        </div>
      </div>
    `
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
