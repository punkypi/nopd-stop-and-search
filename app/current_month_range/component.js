import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function(){
  'use strict'

  Knockout.components.register('current_month_range', {
    viewModel: ViewModel,
    template: `
      Start: <span data-bind="text: startString()"></span>
      <br/>
      End: <span data-bind="text: endString()"></span>`
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
