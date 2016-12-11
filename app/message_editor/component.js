import Knockout from 'knockout'
import View from './view.html!text'
import ViewModel from './view_model.js'

(function(){
  'use strict'

  Knockout.components.register(
    'message_editor', { template: View, viewModel: ViewModel })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})();
