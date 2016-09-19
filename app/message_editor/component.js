import Knockout from 'knockout'

(function(){
  'use strict'

  Knockout.components.register('message_editor', {
    viewModel: function(params) {
      this.text = Knockout.observable(params.initialText || '');
    },
    template:
      `Message: <input data-bind="value: text" />
      (length: <span data-bind="text: text().length"></span>)`
  })
  Knockout.applyBindings()
})();
