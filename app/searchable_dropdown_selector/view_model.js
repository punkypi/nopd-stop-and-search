import $ from 'jquery'
import Knockout from 'knockout'
import Dropdown from 'semantic-ui-dropdown'
import Transition from 'semantic-ui-transition'

$.fn.dropdown = Dropdown
$.fn.transition = Transition

export default class SearchableDropdownSelectorViewModel {
  constructor({ bindLabelTo, bindSelectedOptionTo,
                bindOptionsTo, defaultOption } = {}) {
    this.label = bindLabelTo || Knockout.observable()
    this.options = bindOptionsTo || Knockout.observable()
    this.selectedOption = bindSelectedOptionTo || Knockout.observable()
    this.selectedOption(defaultOption)
    this.initSelect()
  }

  initSelect() {
    $(".dropdown").dropdown()
  }

  labelPresent() {
    return typeof this.label() !== "undefined" && this.label() !== null
  }
}
