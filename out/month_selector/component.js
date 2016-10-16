"bundle";
System.register("app/optional_label/view_model.js", ["npm:babel-runtime@5.8.38/helpers/create-class.js", "npm:babel-runtime@5.8.38/helpers/class-call-check.js", "npm:knockout@3.4.0.js"], function (_export) {
  var _createClass, _classCallCheck, Knockout, OptionalLabelViewModel;

  return {
    setters: [function (_npmBabelRuntime5838HelpersCreateClassJs) {
      _createClass = _npmBabelRuntime5838HelpersCreateClassJs["default"];
    }, function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs["default"];
    }, function (_npmKnockout340Js) {
      Knockout = _npmKnockout340Js["default"];
    }],
    execute: function () {
      "use strict";

      OptionalLabelViewModel = (function () {
        function OptionalLabelViewModel() {
          var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var text = _ref.text;

          _classCallCheck(this, OptionalLabelViewModel);

          this.text = Knockout.observable(Knockout.unwrap(text));
        }

        _createClass(OptionalLabelViewModel, [{
          key: "textPresent",
          value: function textPresent() {
            return typeof this.text() !== "undefined" && this.text() !== null;
          }
        }]);

        return OptionalLabelViewModel;
      })();

      _export("default", OptionalLabelViewModel);
    }
  };
});
System.register('app/optional_label/component.js', ['npm:knockout@3.4.0.js', 'app/optional_label/view_model.js'], function (_export) {
  'use strict';

  var Knockout, ViewModel;
  return {
    setters: [function (_npmKnockout340Js) {
      Knockout = _npmKnockout340Js['default'];
    }, function (_appOptional_labelView_modelJs) {
      ViewModel = _appOptional_labelView_modelJs['default'];
    }],
    execute: function () {

      (function () {
        'use strict';

        Knockout.components.register('optional_label', {
          viewModel: ViewModel,
          template: '\n      <label data-bind="enable: textPresent(), text: text">\n      </label>\n    '
        });
      })();
    }
  };
});
System.registerDynamic('npm:semantic-ui-dropdown@2.2.3/index.js', ['npm:jquery@3.1.1.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /*!
   * # Semantic UI 2.2.3 - Dropdown
   * http://github.com/semantic-org/semantic-ui/
   *
   *
   * Released under the MIT license
   * http://opensource.org/licenses/MIT
   *
   */

  ;(function ($, window, document, undefined) {

    "use strict";

    window = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();

    var _module = module;
    module.exports = function (parameters) {
      var $allModules = $(this),
          $document = $(document),
          moduleSelector = $allModules.selector || '',
          hasTouch = 'ontouchstart' in document.documentElement,
          time = new Date().getTime(),
          performance = [],
          query = arguments[0],
          methodInvoked = typeof query == 'string',
          queryArguments = [].slice.call(arguments, 1),
          returnedValue;

      $allModules.each(function (elementIndex) {
        var settings = $.isPlainObject(parameters) ? $.extend(true, {}, _module.exports.settings, parameters) : $.extend({}, _module.exports.settings),
            className = settings.className,
            message = settings.message,
            fields = settings.fields,
            keys = settings.keys,
            metadata = settings.metadata,
            namespace = settings.namespace,
            regExp = settings.regExp,
            selector = settings.selector,
            error = settings.error,
            templates = settings.templates,
            eventNamespace = '.' + namespace,
            moduleNamespace = 'module-' + namespace,
            $module = $(this),
            $context = $(settings.context),
            $text = $module.find(selector.text),
            $search = $module.find(selector.search),
            $sizer = $module.find(selector.sizer),
            $input = $module.find(selector.input),
            $icon = $module.find(selector.icon),
            $combo = $module.prev().find(selector.text).length > 0 ? $module.prev().find(selector.text) : $module.prev(),
            $menu = $module.children(selector.menu),
            $item = $menu.find(selector.item),
            activated = false,
            itemActivated = false,
            internalChange = false,
            element = this,
            instance = $module.data(moduleNamespace),
            initialLoad,
            pageLostFocus,
            willRefocus,
            elementNamespace,
            id,
            selectObserver,
            menuObserver,
            module;

        module = {

          initialize: function () {
            module.debug('Initializing dropdown', settings);

            if (module.is.alreadySetup()) {
              module.setup.reference();
            } else {
              module.setup.layout();
              module.refreshData();

              module.save.defaults();
              module.restore.selected();

              module.create.id();
              module.bind.events();

              module.observeChanges();
              module.instantiate();
            }
          },

          instantiate: function () {
            module.verbose('Storing instance of dropdown', module);
            instance = module;
            $module.data(moduleNamespace, module);
          },

          destroy: function () {
            module.verbose('Destroying previous dropdown', $module);
            module.remove.tabbable();
            $module.off(eventNamespace).removeData(moduleNamespace);
            $menu.off(eventNamespace);
            $document.off(elementNamespace);
            module.disconnect.menuObserver();
            module.disconnect.selectObserver();
          },

          observeChanges: function () {
            if ('MutationObserver' in window) {
              selectObserver = new MutationObserver(module.event.select.mutation);
              menuObserver = new MutationObserver(module.event.menu.mutation);
              module.debug('Setting up mutation observer', selectObserver, menuObserver);
              module.observe.select();
              module.observe.menu();
            }
          },

          disconnect: {
            menuObserver: function () {
              if (menuObserver) {
                menuObserver.disconnect();
              }
            },
            selectObserver: function () {
              if (selectObserver) {
                selectObserver.disconnect();
              }
            }
          },
          observe: {
            select: function () {
              if (module.has.input()) {
                selectObserver.observe($input[0], {
                  childList: true,
                  subtree: true
                });
              }
            },
            menu: function () {
              if (module.has.menu()) {
                menuObserver.observe($menu[0], {
                  childList: true,
                  subtree: true
                });
              }
            }
          },

          create: {
            id: function () {
              id = (Math.random().toString(16) + '000000000').substr(2, 8);
              elementNamespace = '.' + id;
              module.verbose('Creating unique id for element', id);
            },
            userChoice: function (values) {
              var $userChoices, $userChoice, isUserValue, html;
              values = values || module.get.userValues();
              if (!values) {
                return false;
              }
              values = $.isArray(values) ? values : [values];
              $.each(values, function (index, value) {
                if (module.get.item(value) === false) {
                  html = settings.templates.addition(module.add.variables(message.addResult, value));
                  $userChoice = $('<div />').html(html).attr('data-' + metadata.value, value).attr('data-' + metadata.text, value).addClass(className.addition).addClass(className.item);
                  if (settings.hideAdditions) {
                    $userChoice.addClass(className.hidden);
                  }
                  $userChoices = $userChoices === undefined ? $userChoice : $userChoices.add($userChoice);
                  module.verbose('Creating user choices for value', value, $userChoice);
                }
              });
              return $userChoices;
            },
            userLabels: function (value) {
              var userValues = module.get.userValues();
              if (userValues) {
                module.debug('Adding user labels', userValues);
                $.each(userValues, function (index, value) {
                  module.verbose('Adding custom user value');
                  module.add.label(value, value);
                });
              }
            },
            menu: function () {
              $menu = $('<div />').addClass(className.menu).appendTo($module);
            },
            sizer: function () {
              $sizer = $('<span />').addClass(className.sizer).insertAfter($search);
            }
          },

          search: function (query) {
            query = query !== undefined ? query : module.get.query();
            module.verbose('Searching for query', query);
            if (module.has.minCharacters(query)) {
              module.filter(query);
            } else {
              module.hide();
            }
          },

          select: {
            firstUnfiltered: function () {
              module.verbose('Selecting first non-filtered element');
              module.remove.selectedItem();
              $item.not(selector.unselectable).not(selector.addition + selector.hidden).eq(0).addClass(className.selected);
            },
            nextAvailable: function ($selected) {
              $selected = $selected.eq(0);
              var $nextAvailable = $selected.nextAll(selector.item).not(selector.unselectable).eq(0),
                  $prevAvailable = $selected.prevAll(selector.item).not(selector.unselectable).eq(0),
                  hasNext = $nextAvailable.length > 0;
              if (hasNext) {
                module.verbose('Moving selection to', $nextAvailable);
                $nextAvailable.addClass(className.selected);
              } else {
                module.verbose('Moving selection to', $prevAvailable);
                $prevAvailable.addClass(className.selected);
              }
            }
          },

          setup: {
            api: function () {
              var apiSettings = {
                debug: settings.debug,
                urlData: {
                  value: module.get.value(),
                  query: module.get.query()
                },
                on: false
              };
              module.verbose('First request, initializing API');
              $module.api(apiSettings);
            },
            layout: function () {
              if ($module.is('select')) {
                module.setup.select();
                module.setup.returnedObject();
              }
              if (!module.has.menu()) {
                module.create.menu();
              }
              if (module.is.search() && !module.has.search()) {
                module.verbose('Adding search input');
                $search = $('<input />').addClass(className.search).prop('autocomplete', 'off').insertBefore($text);
              }
              if (module.is.multiple() && module.is.searchSelection() && !module.has.sizer()) {
                module.create.sizer();
              }
              if (settings.allowTab) {
                module.set.tabbable();
              }
            },
            select: function () {
              var selectValues = module.get.selectValues();
              module.debug('Dropdown initialized on a select', selectValues);
              if ($module.is('select')) {
                $input = $module;
              }
              // see if select is placed correctly already
              if ($input.parent(selector.dropdown).length > 0) {
                module.debug('UI dropdown already exists. Creating dropdown menu only');
                $module = $input.closest(selector.dropdown);
                if (!module.has.menu()) {
                  module.create.menu();
                }
                $menu = $module.children(selector.menu);
                module.setup.menu(selectValues);
              } else {
                module.debug('Creating entire dropdown from select');
                $module = $('<div />').attr('class', $input.attr('class')).addClass(className.selection).addClass(className.dropdown).html(templates.dropdown(selectValues)).insertBefore($input);
                if ($input.hasClass(className.multiple) && $input.prop('multiple') === false) {
                  module.error(error.missingMultiple);
                  $input.prop('multiple', true);
                }
                if ($input.is('[multiple]')) {
                  module.set.multiple();
                }
                if ($input.prop('disabled')) {
                  module.debug('Disabling dropdown');
                  $module.addClass(className.disabled);
                }
                $input.removeAttr('class').detach().prependTo($module);
              }
              module.refresh();
            },
            menu: function (values) {
              $menu.html(templates.menu(values, fields));
              $item = $menu.find(selector.item);
            },
            reference: function () {
              module.debug('Dropdown behavior was called on select, replacing with closest dropdown');
              // replace module reference
              $module = $module.parent(selector.dropdown);
              module.refresh();
              module.setup.returnedObject();
              // invoke method in context of current instance
              if (methodInvoked) {
                instance = module;
                module.invoke(query);
              }
            },
            returnedObject: function () {
              var $firstModules = $allModules.slice(0, elementIndex),
                  $lastModules = $allModules.slice(elementIndex + 1);
              // adjust all modules to use correct reference
              $allModules = $firstModules.add($module).add($lastModules);
            }
          },

          refresh: function () {
            module.refreshSelectors();
            module.refreshData();
          },

          refreshItems: function () {
            $item = $menu.find(selector.item);
          },

          refreshSelectors: function () {
            module.verbose('Refreshing selector cache');
            $text = $module.find(selector.text);
            $search = $module.find(selector.search);
            $input = $module.find(selector.input);
            $icon = $module.find(selector.icon);
            $combo = $module.prev().find(selector.text).length > 0 ? $module.prev().find(selector.text) : $module.prev();
            $menu = $module.children(selector.menu);
            $item = $menu.find(selector.item);
          },

          refreshData: function () {
            module.verbose('Refreshing cached metadata');
            $item.removeData(metadata.text).removeData(metadata.value);
          },

          clearData: function () {
            module.verbose('Clearing metadata');
            $item.removeData(metadata.text).removeData(metadata.value);
            $module.removeData(metadata.defaultText).removeData(metadata.defaultValue).removeData(metadata.placeholderText);
          },

          toggle: function () {
            module.verbose('Toggling menu visibility');
            if (!module.is.active()) {
              module.show();
            } else {
              module.hide();
            }
          },

          show: function (callback) {
            callback = $.isFunction(callback) ? callback : function () {};
            if (module.can.show() && !module.is.active()) {
              module.debug('Showing dropdown');
              if (module.has.message() && !(module.has.maxSelections() || module.has.allResultsFiltered())) {
                module.remove.message();
              }
              if (module.is.allFiltered()) {
                return true;
              }
              if (settings.onShow.call(element) !== false) {
                module.animate.show(function () {
                  if (module.can.click()) {
                    module.bind.intent();
                  }
                  if (module.has.menuSearch()) {
                    module.focusSearch();
                  }
                  module.set.visible();
                  callback.call(element);
                });
              }
            }
          },

          hide: function (callback) {
            callback = $.isFunction(callback) ? callback : function () {};
            if (module.is.active()) {
              module.debug('Hiding dropdown');
              if (settings.onHide.call(element) !== false) {
                module.animate.hide(function () {
                  module.remove.visible();
                  callback.call(element);
                });
              }
            }
          },

          hideOthers: function () {
            module.verbose('Finding other dropdowns to hide');
            $allModules.not($module).has(selector.menu + '.' + className.visible).dropdown('hide');
          },

          hideMenu: function () {
            module.verbose('Hiding menu  instantaneously');
            module.remove.active();
            module.remove.visible();
            $menu.transition('hide');
          },

          hideSubMenus: function () {
            var $subMenus = $menu.children(selector.item).find(selector.menu);
            module.verbose('Hiding sub menus', $subMenus);
            $subMenus.transition('hide');
          },

          bind: {
            events: function () {
              if (hasTouch) {
                module.bind.touchEvents();
              }
              module.bind.keyboardEvents();
              module.bind.inputEvents();
              module.bind.mouseEvents();
            },
            touchEvents: function () {
              module.debug('Touch device detected binding additional touch events');
              if (module.is.searchSelection()) {
                // do nothing special yet
              } else if (module.is.single()) {
                $module.on('touchstart' + eventNamespace, module.event.test.toggle);
              }
              $menu.on('touchstart' + eventNamespace, selector.item, module.event.item.mouseenter);
            },
            keyboardEvents: function () {
              module.verbose('Binding keyboard events');
              $module.on('keydown' + eventNamespace, module.event.keydown);
              if (module.has.search()) {
                $module.on(module.get.inputEvent() + eventNamespace, selector.search, module.event.input);
              }
              if (module.is.multiple()) {
                $document.on('keydown' + elementNamespace, module.event.document.keydown);
              }
            },
            inputEvents: function () {
              module.verbose('Binding input change events');
              $module.on('change' + eventNamespace, selector.input, module.event.change);
            },
            mouseEvents: function () {
              module.verbose('Binding mouse events');
              if (module.is.multiple()) {
                $module.on('click' + eventNamespace, selector.label, module.event.label.click).on('click' + eventNamespace, selector.remove, module.event.remove.click);
              }
              if (module.is.searchSelection()) {
                $module.on('mousedown' + eventNamespace, module.event.mousedown).on('mouseup' + eventNamespace, module.event.mouseup).on('mousedown' + eventNamespace, selector.menu, module.event.menu.mousedown).on('mouseup' + eventNamespace, selector.menu, module.event.menu.mouseup).on('click' + eventNamespace, selector.icon, module.event.icon.click).on('focus' + eventNamespace, selector.search, module.event.search.focus).on('click' + eventNamespace, selector.search, module.event.search.focus).on('blur' + eventNamespace, selector.search, module.event.search.blur).on('click' + eventNamespace, selector.text, module.event.text.focus);
                if (module.is.multiple()) {
                  $module.on('click' + eventNamespace, module.event.click);
                }
              } else {
                if (settings.on == 'click') {
                  $module.on('click' + eventNamespace, selector.icon, module.event.icon.click).on('click' + eventNamespace, module.event.test.toggle);
                } else if (settings.on == 'hover') {
                  $module.on('mouseenter' + eventNamespace, module.delay.show).on('mouseleave' + eventNamespace, module.delay.hide);
                } else {
                  $module.on(settings.on + eventNamespace, module.toggle);
                }
                $module.on('mousedown' + eventNamespace, module.event.mousedown).on('mouseup' + eventNamespace, module.event.mouseup).on('focus' + eventNamespace, module.event.focus).on('blur' + eventNamespace, module.event.blur);
              }
              $menu.on('mouseenter' + eventNamespace, selector.item, module.event.item.mouseenter).on('mouseleave' + eventNamespace, selector.item, module.event.item.mouseleave).on('click' + eventNamespace, selector.item, module.event.item.click);
            },
            intent: function () {
              module.verbose('Binding hide intent event to document');
              if (hasTouch) {
                $document.on('touchstart' + elementNamespace, module.event.test.touch).on('touchmove' + elementNamespace, module.event.test.touch);
              }
              $document.on('click' + elementNamespace, module.event.test.hide);
            }
          },

          unbind: {
            intent: function () {
              module.verbose('Removing hide intent event from document');
              if (hasTouch) {
                $document.off('touchstart' + elementNamespace).off('touchmove' + elementNamespace);
              }
              $document.off('click' + elementNamespace);
            }
          },

          filter: function (query) {
            var searchTerm = query !== undefined ? query : module.get.query(),
                afterFiltered = function () {
              if (module.is.multiple()) {
                module.filterActive();
              }
              module.select.firstUnfiltered();
              if (module.has.allResultsFiltered()) {
                if (settings.onNoResults.call(element, searchTerm)) {
                  if (settings.allowAdditions) {
                    if (settings.hideAdditions) {
                      module.verbose('User addition with no menu, setting empty style');
                      module.set.empty();
                      module.hideMenu();
                    }
                  } else {
                    module.verbose('All items filtered, showing message', searchTerm);
                    module.add.message(message.noResults);
                  }
                } else {
                  module.verbose('All items filtered, hiding dropdown', searchTerm);
                  module.hideMenu();
                }
              } else {
                module.remove.empty();
                module.remove.message();
              }
              if (settings.allowAdditions) {
                module.add.userSuggestion(query);
              }
              if (module.is.searchSelection() && module.can.show() && module.is.focusedOnSearch()) {
                module.show();
              }
            };
            if (settings.useLabels && module.has.maxSelections()) {
              return;
            }
            if (settings.apiSettings) {
              if (module.can.useAPI()) {
                module.queryRemote(searchTerm, function () {
                  afterFiltered();
                });
              } else {
                module.error(error.noAPI);
              }
            } else {
              module.filterItems(searchTerm);
              afterFiltered();
            }
          },

          queryRemote: function (query, callback) {
            var apiSettings = {
              errorDuration: false,
              cache: 'local',
              throttle: settings.throttle,
              urlData: {
                query: query
              },
              onError: function () {
                module.add.message(message.serverError);
                callback();
              },
              onFailure: function () {
                module.add.message(message.serverError);
                callback();
              },
              onSuccess: function (response) {
                module.remove.message();
                module.setup.menu({
                  values: response[fields.remoteValues]
                });
                callback();
              }
            };
            if (!$module.api('get request')) {
              module.setup.api();
            }
            apiSettings = $.extend(true, {}, apiSettings, settings.apiSettings);
            $module.api('setting', apiSettings).api('query');
          },

          filterItems: function (query) {
            var searchTerm = query !== undefined ? query : module.get.query(),
                results = null,
                escapedTerm = module.escape.regExp(searchTerm),
                beginsWithRegExp = new RegExp('^' + escapedTerm, 'igm');
            // avoid loop if we're matching nothing
            if (module.has.query()) {
              results = [];

              module.verbose('Searching for matching values', searchTerm);
              $item.each(function () {
                var $choice = $(this),
                    text,
                    value;
                if (settings.match == 'both' || settings.match == 'text') {
                  text = String(module.get.choiceText($choice, false));
                  if (text.search(beginsWithRegExp) !== -1) {
                    results.push(this);
                    return true;
                  } else if (settings.fullTextSearch === 'exact' && module.exactSearch(searchTerm, text)) {
                    results.push(this);
                    return true;
                  } else if (settings.fullTextSearch === true && module.fuzzySearch(searchTerm, text)) {
                    results.push(this);
                    return true;
                  }
                }
                if (settings.match == 'both' || settings.match == 'value') {
                  value = String(module.get.choiceValue($choice, text));

                  if (value.search(beginsWithRegExp) !== -1) {
                    results.push(this);
                    return true;
                  } else if (settings.fullTextSearch && module.fuzzySearch(searchTerm, value)) {
                    results.push(this);
                    return true;
                  }
                }
              });
            }
            module.debug('Showing only matched items', searchTerm);
            module.remove.filteredItem();
            if (results) {
              $item.not(results).addClass(className.filtered);
            }
          },

          fuzzySearch: function (query, term) {
            var termLength = term.length,
                queryLength = query.length;
            query = query.toLowerCase();
            term = term.toLowerCase();
            if (queryLength > termLength) {
              return false;
            }
            if (queryLength === termLength) {
              return query === term;
            }
            search: for (var characterIndex = 0, nextCharacterIndex = 0; characterIndex < queryLength; characterIndex++) {
              var queryCharacter = query.charCodeAt(characterIndex);
              while (nextCharacterIndex < termLength) {
                if (term.charCodeAt(nextCharacterIndex++) === queryCharacter) {
                  continue search;
                }
              }
              return false;
            }
            return true;
          },
          exactSearch: function (query, term) {
            query = query.toLowerCase();
            term = term.toLowerCase();
            if (term.indexOf(query) > -1) {
              return true;
            }
            return false;
          },
          filterActive: function () {
            if (settings.useLabels) {
              $item.filter('.' + className.active).addClass(className.filtered);
            }
          },

          focusSearch: function (skipHandler) {
            if (module.has.search() && !module.is.focusedOnSearch()) {
              if (skipHandler) {
                $module.off('focus' + eventNamespace, selector.search);
                $search.focus();
                $module.on('focus' + eventNamespace, selector.search, module.event.search.focus);
              } else {
                $search.focus();
              }
            }
          },

          forceSelection: function () {
            var $currentlySelected = $item.not(className.filtered).filter('.' + className.selected).eq(0),
                $activeItem = $item.not(className.filtered).filter('.' + className.active).eq(0),
                $selectedItem = $currentlySelected.length > 0 ? $currentlySelected : $activeItem,
                hasSelected = $selectedItem.length > 0;
            if (hasSelected) {
              module.debug('Forcing partial selection to selected item', $selectedItem);
              module.event.item.click.call($selectedItem, {}, true);
              return;
            } else {
              if (settings.allowAdditions) {
                module.set.selected(module.get.query());
                module.remove.searchTerm();
              } else {
                module.remove.searchTerm();
              }
            }
          },

          event: {
            change: function () {
              if (!internalChange) {
                module.debug('Input changed, updating selection');
                module.set.selected();
              }
            },
            focus: function () {
              if (settings.showOnFocus && !activated && module.is.hidden() && !pageLostFocus) {
                module.show();
              }
            },
            blur: function (event) {
              pageLostFocus = document.activeElement === this;
              if (!activated && !pageLostFocus) {
                module.remove.activeLabel();
                module.hide();
              }
            },
            mousedown: function () {
              if (module.is.searchSelection()) {
                // prevent menu hiding on immediate re-focus
                willRefocus = true;
              } else {
                // prevents focus callback from occurring on mousedown
                activated = true;
              }
            },
            mouseup: function () {
              if (module.is.searchSelection()) {
                // prevent menu hiding on immediate re-focus
                willRefocus = false;
              } else {
                activated = false;
              }
            },
            click: function (event) {
              var $target = $(event.target);
              // focus search
              if ($target.is($module)) {
                if (!module.is.focusedOnSearch()) {
                  module.focusSearch();
                } else {
                  module.show();
                }
              }
            },
            search: {
              focus: function () {
                activated = true;
                if (module.is.multiple()) {
                  module.remove.activeLabel();
                }
                if (settings.showOnFocus) {
                  module.search();
                }
              },
              blur: function (event) {
                pageLostFocus = document.activeElement === this;
                if (!willRefocus) {
                  if (!itemActivated && !pageLostFocus) {
                    if (settings.forceSelection) {
                      module.forceSelection();
                    }
                    module.hide();
                  }
                }
                willRefocus = false;
              }
            },
            icon: {
              click: function (event) {
                module.toggle();
              }
            },
            text: {
              focus: function (event) {
                activated = true;
                module.focusSearch();
              }
            },
            input: function (event) {
              if (module.is.multiple() || module.is.searchSelection()) {
                module.set.filtered();
              }
              clearTimeout(module.timer);
              module.timer = setTimeout(module.search, settings.delay.search);
            },
            label: {
              click: function (event) {
                var $label = $(this),
                    $labels = $module.find(selector.label),
                    $activeLabels = $labels.filter('.' + className.active),
                    $nextActive = $label.nextAll('.' + className.active),
                    $prevActive = $label.prevAll('.' + className.active),
                    $range = $nextActive.length > 0 ? $label.nextUntil($nextActive).add($activeLabels).add($label) : $label.prevUntil($prevActive).add($activeLabels).add($label);
                if (event.shiftKey) {
                  $activeLabels.removeClass(className.active);
                  $range.addClass(className.active);
                } else if (event.ctrlKey) {
                  $label.toggleClass(className.active);
                } else {
                  $activeLabels.removeClass(className.active);
                  $label.addClass(className.active);
                }
                settings.onLabelSelect.apply(this, $labels.filter('.' + className.active));
              }
            },
            remove: {
              click: function () {
                var $label = $(this).parent();
                if ($label.hasClass(className.active)) {
                  // remove all selected labels
                  module.remove.activeLabels();
                } else {
                  // remove this label only
                  module.remove.activeLabels($label);
                }
              }
            },
            test: {
              toggle: function (event) {
                var toggleBehavior = module.is.multiple() ? module.show : module.toggle;
                if (module.is.bubbledLabelClick(event) || module.is.bubbledIconClick(event)) {
                  return;
                }
                if (module.determine.eventOnElement(event, toggleBehavior)) {
                  event.preventDefault();
                }
              },
              touch: function (event) {
                module.determine.eventOnElement(event, function () {
                  if (event.type == 'touchstart') {
                    module.timer = setTimeout(function () {
                      module.hide();
                    }, settings.delay.touch);
                  } else if (event.type == 'touchmove') {
                    clearTimeout(module.timer);
                  }
                });
                event.stopPropagation();
              },
              hide: function (event) {
                module.determine.eventInModule(event, module.hide);
              }
            },
            select: {
              mutation: function (mutations) {
                module.debug('<select> modified, recreating menu');
                module.setup.select();
              }
            },
            menu: {
              mutation: function (mutations) {
                var mutation = mutations[0],
                    $addedNode = mutation.addedNodes ? $(mutation.addedNodes[0]) : $(false),
                    $removedNode = mutation.removedNodes ? $(mutation.removedNodes[0]) : $(false),
                    $changedNodes = $addedNode.add($removedNode),
                    isUserAddition = $changedNodes.is(selector.addition) || $changedNodes.closest(selector.addition).length > 0,
                    isMessage = $changedNodes.is(selector.message) || $changedNodes.closest(selector.message).length > 0;
                if (isUserAddition || isMessage) {
                  module.debug('Updating item selector cache');
                  module.refreshItems();
                } else {
                  module.debug('Menu modified, updating selector cache');
                  module.refresh();
                }
              },
              mousedown: function () {
                itemActivated = true;
              },
              mouseup: function () {
                itemActivated = false;
              }
            },
            item: {
              mouseenter: function (event) {
                var $target = $(event.target),
                    $item = $(this),
                    $subMenu = $item.children(selector.menu),
                    $otherMenus = $item.siblings(selector.item).children(selector.menu),
                    hasSubMenu = $subMenu.length > 0,
                    isBubbledEvent = $subMenu.find($target).length > 0;
                if (!isBubbledEvent && hasSubMenu) {
                  clearTimeout(module.itemTimer);
                  module.itemTimer = setTimeout(function () {
                    module.verbose('Showing sub-menu', $subMenu);
                    $.each($otherMenus, function () {
                      module.animate.hide(false, $(this));
                    });
                    module.animate.show(false, $subMenu);
                  }, settings.delay.show);
                  event.preventDefault();
                }
              },
              mouseleave: function (event) {
                var $subMenu = $(this).children(selector.menu);
                if ($subMenu.length > 0) {
                  clearTimeout(module.itemTimer);
                  module.itemTimer = setTimeout(function () {
                    module.verbose('Hiding sub-menu', $subMenu);
                    module.animate.hide(false, $subMenu);
                  }, settings.delay.hide);
                }
              },
              click: function (event, skipRefocus) {
                var $choice = $(this),
                    $target = event ? $(event.target) : $(''),
                    $subMenu = $choice.find(selector.menu),
                    text = module.get.choiceText($choice),
                    value = module.get.choiceValue($choice, text),
                    hasSubMenu = $subMenu.length > 0,
                    isBubbledEvent = $subMenu.find($target).length > 0;
                if (!isBubbledEvent && (!hasSubMenu || settings.allowCategorySelection)) {
                  if (module.is.searchSelection()) {
                    if (settings.allowAdditions) {
                      module.remove.userAddition();
                    }
                    module.remove.searchTerm();
                    if (!module.is.focusedOnSearch() && !(skipRefocus == true)) {
                      module.focusSearch(true);
                    }
                  }
                  if (!settings.useLabels) {
                    module.remove.filteredItem();
                    module.set.scrollPosition($choice);
                  }
                  module.determine.selectAction.call(this, text, value);
                }
              }
            },

            document: {
              // label selection should occur even when element has no focus
              keydown: function (event) {
                var pressedKey = event.which,
                    isShortcutKey = module.is.inObject(pressedKey, keys);
                if (isShortcutKey) {
                  var $label = $module.find(selector.label),
                      $activeLabel = $label.filter('.' + className.active),
                      activeValue = $activeLabel.data(metadata.value),
                      labelIndex = $label.index($activeLabel),
                      labelCount = $label.length,
                      hasActiveLabel = $activeLabel.length > 0,
                      hasMultipleActive = $activeLabel.length > 1,
                      isFirstLabel = labelIndex === 0,
                      isLastLabel = labelIndex + 1 == labelCount,
                      isSearch = module.is.searchSelection(),
                      isFocusedOnSearch = module.is.focusedOnSearch(),
                      isFocused = module.is.focused(),
                      caretAtStart = isFocusedOnSearch && module.get.caretPosition() === 0,
                      $nextLabel;
                  if (isSearch && !hasActiveLabel && !isFocusedOnSearch) {
                    return;
                  }

                  if (pressedKey == keys.leftArrow) {
                    // activate previous label
                    if ((isFocused || caretAtStart) && !hasActiveLabel) {
                      module.verbose('Selecting previous label');
                      $label.last().addClass(className.active);
                    } else if (hasActiveLabel) {
                      if (!event.shiftKey) {
                        module.verbose('Selecting previous label');
                        $label.removeClass(className.active);
                      } else {
                        module.verbose('Adding previous label to selection');
                      }
                      if (isFirstLabel && !hasMultipleActive) {
                        $activeLabel.addClass(className.active);
                      } else {
                        $activeLabel.prev(selector.siblingLabel).addClass(className.active).end();
                      }
                      event.preventDefault();
                    }
                  } else if (pressedKey == keys.rightArrow) {
                    // activate first label
                    if (isFocused && !hasActiveLabel) {
                      $label.first().addClass(className.active);
                    }
                    // activate next label
                    if (hasActiveLabel) {
                      if (!event.shiftKey) {
                        module.verbose('Selecting next label');
                        $label.removeClass(className.active);
                      } else {
                        module.verbose('Adding next label to selection');
                      }
                      if (isLastLabel) {
                        if (isSearch) {
                          if (!isFocusedOnSearch) {
                            module.focusSearch();
                          } else {
                            $label.removeClass(className.active);
                          }
                        } else if (hasMultipleActive) {
                          $activeLabel.next(selector.siblingLabel).addClass(className.active);
                        } else {
                          $activeLabel.addClass(className.active);
                        }
                      } else {
                        $activeLabel.next(selector.siblingLabel).addClass(className.active);
                      }
                      event.preventDefault();
                    }
                  } else if (pressedKey == keys.deleteKey || pressedKey == keys.backspace) {
                    if (hasActiveLabel) {
                      module.verbose('Removing active labels');
                      if (isLastLabel) {
                        if (isSearch && !isFocusedOnSearch) {
                          module.focusSearch();
                        }
                      }
                      $activeLabel.last().next(selector.siblingLabel).addClass(className.active);
                      module.remove.activeLabels($activeLabel);
                      event.preventDefault();
                    } else if (caretAtStart && !hasActiveLabel && pressedKey == keys.backspace) {
                      module.verbose('Removing last label on input backspace');
                      $activeLabel = $label.last().addClass(className.active);
                      module.remove.activeLabels($activeLabel);
                    }
                  } else {
                    $activeLabel.removeClass(className.active);
                  }
                }
              }
            },

            keydown: function (event) {
              var pressedKey = event.which,
                  isShortcutKey = module.is.inObject(pressedKey, keys);
              if (isShortcutKey) {
                var $currentlySelected = $item.not(selector.unselectable).filter('.' + className.selected).eq(0),
                    $activeItem = $menu.children('.' + className.active).eq(0),
                    $selectedItem = $currentlySelected.length > 0 ? $currentlySelected : $activeItem,
                    $visibleItems = $selectedItem.length > 0 ? $selectedItem.siblings(':not(.' + className.filtered + ')').addBack() : $menu.children(':not(.' + className.filtered + ')'),
                    $subMenu = $selectedItem.children(selector.menu),
                    $parentMenu = $selectedItem.closest(selector.menu),
                    inVisibleMenu = $parentMenu.hasClass(className.visible) || $parentMenu.hasClass(className.animating) || $parentMenu.parent(selector.menu).length > 0,
                    hasSubMenu = $subMenu.length > 0,
                    hasSelectedItem = $selectedItem.length > 0,
                    selectedIsSelectable = $selectedItem.not(selector.unselectable).length > 0,
                    delimiterPressed = pressedKey == keys.delimiter && settings.allowAdditions && module.is.multiple(),
                    isAdditionWithoutMenu = settings.allowAdditions && settings.hideAdditions && (pressedKey == keys.enter || delimiterPressed) && selectedIsSelectable,
                    $nextItem,
                    isSubMenuItem,
                    newIndex;
                // allow selection with menu closed
                if (isAdditionWithoutMenu) {
                  module.verbose('Selecting item from keyboard shortcut', $selectedItem);
                  module.event.item.click.call($selectedItem, event);
                  if (module.is.searchSelection()) {
                    module.remove.searchTerm();
                  }
                }

                // visible menu keyboard shortcuts
                if (module.is.visible()) {

                  // enter (select or open sub-menu)
                  if (pressedKey == keys.enter || delimiterPressed) {
                    if (pressedKey == keys.enter && hasSelectedItem && hasSubMenu && !settings.allowCategorySelection) {
                      module.verbose('Pressed enter on unselectable category, opening sub menu');
                      pressedKey = keys.rightArrow;
                    } else if (selectedIsSelectable) {
                      module.verbose('Selecting item from keyboard shortcut', $selectedItem);
                      module.event.item.click.call($selectedItem, event);
                      if (module.is.searchSelection()) {
                        module.remove.searchTerm();
                      }
                    }
                    event.preventDefault();
                  }

                  // sub-menu actions
                  if (hasSelectedItem) {

                    if (pressedKey == keys.leftArrow) {

                      isSubMenuItem = $parentMenu[0] !== $menu[0];

                      if (isSubMenuItem) {
                        module.verbose('Left key pressed, closing sub-menu');
                        module.animate.hide(false, $parentMenu);
                        $selectedItem.removeClass(className.selected);
                        $parentMenu.closest(selector.item).addClass(className.selected);
                        event.preventDefault();
                      }
                    }

                    // right arrow (show sub-menu)
                    if (pressedKey == keys.rightArrow) {
                      if (hasSubMenu) {
                        module.verbose('Right key pressed, opening sub-menu');
                        module.animate.show(false, $subMenu);
                        $selectedItem.removeClass(className.selected);
                        $subMenu.find(selector.item).eq(0).addClass(className.selected);
                        event.preventDefault();
                      }
                    }
                  }

                  // up arrow (traverse menu up)
                  if (pressedKey == keys.upArrow) {
                    $nextItem = hasSelectedItem && inVisibleMenu ? $selectedItem.prevAll(selector.item + ':not(' + selector.unselectable + ')').eq(0) : $item.eq(0);
                    if ($visibleItems.index($nextItem) < 0) {
                      module.verbose('Up key pressed but reached top of current menu');
                      event.preventDefault();
                      return;
                    } else {
                      module.verbose('Up key pressed, changing active item');
                      $selectedItem.removeClass(className.selected);
                      $nextItem.addClass(className.selected);
                      module.set.scrollPosition($nextItem);
                      if (settings.selectOnKeydown && module.is.single()) {
                        module.set.selectedItem($nextItem);
                      }
                    }
                    event.preventDefault();
                  }

                  // down arrow (traverse menu down)
                  if (pressedKey == keys.downArrow) {
                    $nextItem = hasSelectedItem && inVisibleMenu ? $nextItem = $selectedItem.nextAll(selector.item + ':not(' + selector.unselectable + ')').eq(0) : $item.eq(0);
                    if ($nextItem.length === 0) {
                      module.verbose('Down key pressed but reached bottom of current menu');
                      event.preventDefault();
                      return;
                    } else {
                      module.verbose('Down key pressed, changing active item');
                      $item.removeClass(className.selected);
                      $nextItem.addClass(className.selected);
                      module.set.scrollPosition($nextItem);
                      if (settings.selectOnKeydown && module.is.single()) {
                        module.set.selectedItem($nextItem);
                      }
                    }
                    event.preventDefault();
                  }

                  // page down (show next page)
                  if (pressedKey == keys.pageUp) {
                    module.scrollPage('up');
                    event.preventDefault();
                  }
                  if (pressedKey == keys.pageDown) {
                    module.scrollPage('down');
                    event.preventDefault();
                  }

                  // escape (close menu)
                  if (pressedKey == keys.escape) {
                    module.verbose('Escape key pressed, closing dropdown');
                    module.hide();
                  }
                } else {
                  // delimiter key
                  if (delimiterPressed) {
                    event.preventDefault();
                  }
                  // down arrow (open menu)
                  if (pressedKey == keys.downArrow && !module.is.visible()) {
                    module.verbose('Down key pressed, showing dropdown');
                    module.select.firstUnfiltered();
                    module.show();
                    event.preventDefault();
                  }
                }
              } else {
                if (!module.has.search()) {
                  module.set.selectedLetter(String.fromCharCode(pressedKey));
                }
              }
            }
          },

          trigger: {
            change: function () {
              var events = document.createEvent('HTMLEvents'),
                  inputElement = $input[0];
              if (inputElement) {
                module.verbose('Triggering native change event');
                events.initEvent('change', true, false);
                inputElement.dispatchEvent(events);
              }
            }
          },

          determine: {
            selectAction: function (text, value) {
              module.verbose('Determining action', settings.action);
              if ($.isFunction(module.action[settings.action])) {
                module.verbose('Triggering preset action', settings.action, text, value);
                module.action[settings.action].call(element, text, value, this);
              } else if ($.isFunction(settings.action)) {
                module.verbose('Triggering user action', settings.action, text, value);
                settings.action.call(element, text, value, this);
              } else {
                module.error(error.action, settings.action);
              }
            },
            eventInModule: function (event, callback) {
              var $target = $(event.target),
                  inDocument = $target.closest(document.documentElement).length > 0,
                  inModule = $target.closest($module).length > 0;
              callback = $.isFunction(callback) ? callback : function () {};
              if (inDocument && !inModule) {
                module.verbose('Triggering event', callback);
                callback();
                return true;
              } else {
                module.verbose('Event occurred in dropdown, canceling callback');
                return false;
              }
            },
            eventOnElement: function (event, callback) {
              var $target = $(event.target),
                  $label = $target.closest(selector.siblingLabel),
                  inVisibleDOM = document.body.contains(event.target),
                  notOnLabel = $module.find($label).length === 0,
                  notInMenu = $target.closest($menu).length === 0;
              callback = $.isFunction(callback) ? callback : function () {};
              if (inVisibleDOM && notOnLabel && notInMenu) {
                module.verbose('Triggering event', callback);
                callback();
                return true;
              } else {
                module.verbose('Event occurred in dropdown menu, canceling callback');
                return false;
              }
            }
          },

          action: {

            nothing: function () {},

            activate: function (text, value, element) {
              value = value !== undefined ? value : text;
              if (module.can.activate($(element))) {
                module.set.selected(value, $(element));
                if (module.is.multiple() && !module.is.allFiltered()) {
                  return;
                } else {
                  module.hideAndClear();
                }
              }
            },

            select: function (text, value, element) {
              value = value !== undefined ? value : text;
              if (module.can.activate($(element))) {
                module.set.value(value, $(element));
                if (module.is.multiple() && !module.is.allFiltered()) {
                  return;
                } else {
                  module.hideAndClear();
                }
              }
            },

            combo: function (text, value, element) {
              value = value !== undefined ? value : text;
              module.set.selected(value, $(element));
              module.hideAndClear();
            },

            hide: function (text, value, element) {
              module.set.value(value, text);
              module.hideAndClear();
            }

          },

          get: {
            id: function () {
              return id;
            },
            defaultText: function () {
              return $module.data(metadata.defaultText);
            },
            defaultValue: function () {
              return $module.data(metadata.defaultValue);
            },
            placeholderText: function () {
              return $module.data(metadata.placeholderText) || '';
            },
            text: function () {
              return $text.text();
            },
            query: function () {
              return $.trim($search.val());
            },
            searchWidth: function (value) {
              value = value !== undefined ? value : $search.val();
              $sizer.text(value);
              // prevent rounding issues
              return Math.ceil($sizer.width() + 1);
            },
            selectionCount: function () {
              var values = module.get.values(),
                  count;
              count = module.is.multiple() ? $.isArray(values) ? values.length : 0 : module.get.value() !== '' ? 1 : 0;
              return count;
            },
            transition: function ($subMenu) {
              return settings.transition == 'auto' ? module.is.upward($subMenu) ? 'slide up' : 'slide down' : settings.transition;
            },
            userValues: function () {
              var values = module.get.values();
              if (!values) {
                return false;
              }
              values = $.isArray(values) ? values : [values];
              return $.grep(values, function (value) {
                return module.get.item(value) === false;
              });
            },
            uniqueArray: function (array) {
              return $.grep(array, function (value, index) {
                return $.inArray(value, array) === index;
              });
            },
            caretPosition: function () {
              var input = $search.get(0),
                  range,
                  rangeLength;
              if ('selectionStart' in input) {
                return input.selectionStart;
              } else if (document.selection) {
                input.focus();
                range = document.selection.createRange();
                rangeLength = range.text.length;
                range.moveStart('character', -input.value.length);
                return range.text.length - rangeLength;
              }
            },
            value: function () {
              var value = $input.length > 0 ? $input.val() : $module.data(metadata.value),
                  isEmptyMultiselect = $.isArray(value) && value.length === 1 && value[0] === '';
              // prevents placeholder element from being selected when multiple
              return value === undefined || isEmptyMultiselect ? '' : value;
            },
            values: function () {
              var value = module.get.value();
              if (value === '') {
                return '';
              }
              return !module.has.selectInput() && module.is.multiple() ? typeof value == 'string' ? // delimited string
              value.split(settings.delimiter) : '' : value;
            },
            remoteValues: function () {
              var values = module.get.values(),
                  remoteValues = false;
              if (values) {
                if (typeof values == 'string') {
                  values = [values];
                }
                $.each(values, function (index, value) {
                  var name = module.read.remoteData(value);
                  module.verbose('Restoring value from session data', name, value);
                  if (name) {
                    if (!remoteValues) {
                      remoteValues = {};
                    }
                    remoteValues[value] = name;
                  }
                });
              }
              return remoteValues;
            },
            choiceText: function ($choice, preserveHTML) {
              preserveHTML = preserveHTML !== undefined ? preserveHTML : settings.preserveHTML;
              if ($choice) {
                if ($choice.find(selector.menu).length > 0) {
                  module.verbose('Retrieving text of element with sub-menu');
                  $choice = $choice.clone();
                  $choice.find(selector.menu).remove();
                  $choice.find(selector.menuIcon).remove();
                }
                return $choice.data(metadata.text) !== undefined ? $choice.data(metadata.text) : preserveHTML ? $.trim($choice.html()) : $.trim($choice.text());
              }
            },
            choiceValue: function ($choice, choiceText) {
              choiceText = choiceText || module.get.choiceText($choice);
              if (!$choice) {
                return false;
              }
              return $choice.data(metadata.value) !== undefined ? String($choice.data(metadata.value)) : typeof choiceText === 'string' ? $.trim(choiceText.toLowerCase()) : String(choiceText);
            },
            inputEvent: function () {
              var input = $search[0];
              if (input) {
                return input.oninput !== undefined ? 'input' : input.onpropertychange !== undefined ? 'propertychange' : 'keyup';
              }
              return false;
            },
            selectValues: function () {
              var select = {};
              select.values = [];
              $module.find('option').each(function () {
                var $option = $(this),
                    name = $option.html(),
                    disabled = $option.attr('disabled'),
                    value = $option.attr('value') !== undefined ? $option.attr('value') : name;
                if (settings.placeholder === 'auto' && value === '') {
                  select.placeholder = name;
                } else {
                  select.values.push({
                    name: name,
                    value: value,
                    disabled: disabled
                  });
                }
              });
              if (settings.placeholder && settings.placeholder !== 'auto') {
                module.debug('Setting placeholder value to', settings.placeholder);
                select.placeholder = settings.placeholder;
              }
              if (settings.sortSelect) {
                select.values.sort(function (a, b) {
                  return a.name > b.name ? 1 : -1;
                });
                module.debug('Retrieved and sorted values from select', select);
              } else {
                module.debug('Retrieved values from select', select);
              }
              return select;
            },
            activeItem: function () {
              return $item.filter('.' + className.active);
            },
            selectedItem: function () {
              var $selectedItem = $item.not(selector.unselectable).filter('.' + className.selected);
              return $selectedItem.length > 0 ? $selectedItem : $item.eq(0);
            },
            itemWithAdditions: function (value) {
              var $items = module.get.item(value),
                  $userItems = module.create.userChoice(value),
                  hasUserItems = $userItems && $userItems.length > 0;
              if (hasUserItems) {
                $items = $items.length > 0 ? $items.add($userItems) : $userItems;
              }
              return $items;
            },
            item: function (value, strict) {
              var $selectedItem = false,
                  shouldSearch,
                  isMultiple;
              value = value !== undefined ? value : module.get.values() !== undefined ? module.get.values() : module.get.text();
              shouldSearch = isMultiple ? value.length > 0 : value !== undefined && value !== null;
              isMultiple = module.is.multiple() && $.isArray(value);
              strict = value === '' || value === 0 ? true : strict || false;
              if (shouldSearch) {
                $item.each(function () {
                  var $choice = $(this),
                      optionText = module.get.choiceText($choice),
                      optionValue = module.get.choiceValue($choice, optionText);
                  // safe early exit
                  if (optionValue === null || optionValue === undefined) {
                    return;
                  }
                  if (isMultiple) {
                    if ($.inArray(String(optionValue), value) !== -1 || $.inArray(optionText, value) !== -1) {
                      $selectedItem = $selectedItem ? $selectedItem.add($choice) : $choice;
                    }
                  } else if (strict) {
                    module.verbose('Ambiguous dropdown value using strict type check', $choice, value);
                    if (optionValue === value || optionText === value) {
                      $selectedItem = $choice;
                      return true;
                    }
                  } else {
                    if (String(optionValue) == String(value) || optionText == value) {
                      module.verbose('Found select item by value', optionValue, value);
                      $selectedItem = $choice;
                      return true;
                    }
                  }
                });
              }
              return $selectedItem;
            }
          },

          check: {
            maxSelections: function (selectionCount) {
              if (settings.maxSelections) {
                selectionCount = selectionCount !== undefined ? selectionCount : module.get.selectionCount();
                if (selectionCount >= settings.maxSelections) {
                  module.debug('Maximum selection count reached');
                  if (settings.useLabels) {
                    $item.addClass(className.filtered);
                    module.add.message(message.maxSelections);
                  }
                  return true;
                } else {
                  module.verbose('No longer at maximum selection count');
                  module.remove.message();
                  module.remove.filteredItem();
                  if (module.is.searchSelection()) {
                    module.filterItems();
                  }
                  return false;
                }
              }
              return true;
            }
          },

          restore: {
            defaults: function () {
              module.clear();
              module.restore.defaultText();
              module.restore.defaultValue();
            },
            defaultText: function () {
              var defaultText = module.get.defaultText(),
                  placeholderText = module.get.placeholderText;
              if (defaultText === placeholderText) {
                module.debug('Restoring default placeholder text', defaultText);
                module.set.placeholderText(defaultText);
              } else {
                module.debug('Restoring default text', defaultText);
                module.set.text(defaultText);
              }
            },
            placeholderText: function () {
              module.set.placeholderText();
            },
            defaultValue: function () {
              var defaultValue = module.get.defaultValue();
              if (defaultValue !== undefined) {
                module.debug('Restoring default value', defaultValue);
                if (defaultValue !== '') {
                  module.set.value(defaultValue);
                  module.set.selected();
                } else {
                  module.remove.activeItem();
                  module.remove.selectedItem();
                }
              }
            },
            labels: function () {
              if (settings.allowAdditions) {
                if (!settings.useLabels) {
                  module.error(error.labels);
                  settings.useLabels = true;
                }
                module.debug('Restoring selected values');
                module.create.userLabels();
              }
              module.check.maxSelections();
            },
            selected: function () {
              module.restore.values();
              if (module.is.multiple()) {
                module.debug('Restoring previously selected values and labels');
                module.restore.labels();
              } else {
                module.debug('Restoring previously selected values');
              }
            },
            values: function () {
              // prevents callbacks from occurring on initial load
              module.set.initialLoad();
              if (settings.apiSettings && settings.saveRemoteData && module.get.remoteValues()) {
                module.restore.remoteValues();
              } else {
                module.set.selected();
              }
              module.remove.initialLoad();
            },
            remoteValues: function () {
              var values = module.get.remoteValues();
              module.debug('Recreating selected from session data', values);
              if (values) {
                if (module.is.single()) {
                  $.each(values, function (value, name) {
                    module.set.text(name);
                  });
                } else {
                  $.each(values, function (value, name) {
                    module.add.label(value, name);
                  });
                }
              }
            }
          },

          read: {
            remoteData: function (value) {
              var name;
              if (window.Storage === undefined) {
                module.error(error.noStorage);
                return;
              }
              name = sessionStorage.getItem(value);
              return name !== undefined ? name : false;
            }
          },

          save: {
            defaults: function () {
              module.save.defaultText();
              module.save.placeholderText();
              module.save.defaultValue();
            },
            defaultValue: function () {
              var value = module.get.value();
              module.verbose('Saving default value as', value);
              $module.data(metadata.defaultValue, value);
            },
            defaultText: function () {
              var text = module.get.text();
              module.verbose('Saving default text as', text);
              $module.data(metadata.defaultText, text);
            },
            placeholderText: function () {
              var text;
              if (settings.placeholder !== false && $text.hasClass(className.placeholder)) {
                text = module.get.text();
                module.verbose('Saving placeholder text as', text);
                $module.data(metadata.placeholderText, text);
              }
            },
            remoteData: function (name, value) {
              if (window.Storage === undefined) {
                module.error(error.noStorage);
                return;
              }
              module.verbose('Saving remote data to session storage', value, name);
              sessionStorage.setItem(value, name);
            }
          },

          clear: function () {
            if (module.is.multiple() && settings.useLabels) {
              module.remove.labels();
            } else {
              module.remove.activeItem();
              module.remove.selectedItem();
            }
            module.set.placeholderText();
            module.clearValue();
          },

          clearValue: function () {
            module.set.value('');
          },

          scrollPage: function (direction, $selectedItem) {
            var $currentItem = $selectedItem || module.get.selectedItem(),
                $menu = $currentItem.closest(selector.menu),
                menuHeight = $menu.outerHeight(),
                currentScroll = $menu.scrollTop(),
                itemHeight = $item.eq(0).outerHeight(),
                itemsPerPage = Math.floor(menuHeight / itemHeight),
                maxScroll = $menu.prop('scrollHeight'),
                newScroll = direction == 'up' ? currentScroll - itemHeight * itemsPerPage : currentScroll + itemHeight * itemsPerPage,
                $selectableItem = $item.not(selector.unselectable),
                isWithinRange,
                $nextSelectedItem,
                elementIndex;
            elementIndex = direction == 'up' ? $selectableItem.index($currentItem) - itemsPerPage : $selectableItem.index($currentItem) + itemsPerPage;
            isWithinRange = direction == 'up' ? elementIndex >= 0 : elementIndex < $selectableItem.length;
            $nextSelectedItem = isWithinRange ? $selectableItem.eq(elementIndex) : direction == 'up' ? $selectableItem.first() : $selectableItem.last();
            if ($nextSelectedItem.length > 0) {
              module.debug('Scrolling page', direction, $nextSelectedItem);
              $currentItem.removeClass(className.selected);
              $nextSelectedItem.addClass(className.selected);
              if (settings.selectOnKeydown && module.is.single()) {
                module.set.selectedItem($nextSelectedItem);
              }
              $menu.scrollTop(newScroll);
            }
          },

          set: {
            filtered: function () {
              var isMultiple = module.is.multiple(),
                  isSearch = module.is.searchSelection(),
                  isSearchMultiple = isMultiple && isSearch,
                  searchValue = isSearch ? module.get.query() : '',
                  hasSearchValue = typeof searchValue === 'string' && searchValue.length > 0,
                  searchWidth = module.get.searchWidth(),
                  valueIsSet = searchValue !== '';
              if (isMultiple && hasSearchValue) {
                module.verbose('Adjusting input width', searchWidth, settings.glyphWidth);
                $search.css('width', searchWidth);
              }
              if (hasSearchValue || isSearchMultiple && valueIsSet) {
                module.verbose('Hiding placeholder text');
                $text.addClass(className.filtered);
              } else if (!isMultiple || isSearchMultiple && !valueIsSet) {
                module.verbose('Showing placeholder text');
                $text.removeClass(className.filtered);
              }
            },
            empty: function () {
              $module.addClass(className.empty);
            },
            loading: function () {
              $module.addClass(className.loading);
            },
            placeholderText: function (text) {
              text = text || module.get.placeholderText();
              module.debug('Setting placeholder text', text);
              module.set.text(text);
              $text.addClass(className.placeholder);
            },
            tabbable: function () {
              if (module.has.search()) {
                module.debug('Added tabindex to searchable dropdown');
                $search.val('').attr('tabindex', 0);
                $menu.attr('tabindex', -1);
              } else {
                module.debug('Added tabindex to dropdown');
                if ($module.attr('tabindex') === undefined) {
                  $module.attr('tabindex', 0);
                  $menu.attr('tabindex', -1);
                }
              }
            },
            initialLoad: function () {
              module.verbose('Setting initial load');
              initialLoad = true;
            },
            activeItem: function ($item) {
              if (settings.allowAdditions && $item.filter(selector.addition).length > 0) {
                $item.addClass(className.filtered);
              } else {
                $item.addClass(className.active);
              }
            },
            partialSearch: function (text) {
              var length = module.get.query().length;
              $search.val(text.substr(0, length));
            },
            scrollPosition: function ($item, forceScroll) {
              var edgeTolerance = 5,
                  $menu,
                  hasActive,
                  offset,
                  itemHeight,
                  itemOffset,
                  menuOffset,
                  menuScroll,
                  menuHeight,
                  abovePage,
                  belowPage;

              $item = $item || module.get.selectedItem();
              $menu = $item.closest(selector.menu);
              hasActive = $item && $item.length > 0;
              forceScroll = forceScroll !== undefined ? forceScroll : false;
              if ($item && $menu.length > 0 && hasActive) {
                itemOffset = $item.position().top;

                $menu.addClass(className.loading);
                menuScroll = $menu.scrollTop();
                menuOffset = $menu.offset().top;
                itemOffset = $item.offset().top;
                offset = menuScroll - menuOffset + itemOffset;
                if (!forceScroll) {
                  menuHeight = $menu.height();
                  belowPage = menuScroll + menuHeight < offset + edgeTolerance;
                  abovePage = offset - edgeTolerance < menuScroll;
                }
                module.debug('Scrolling to active item', offset);
                if (forceScroll || abovePage || belowPage) {
                  $menu.scrollTop(offset);
                }
                $menu.removeClass(className.loading);
              }
            },
            text: function (text) {
              if (settings.action !== 'select') {
                if (settings.action == 'combo') {
                  module.debug('Changing combo button text', text, $combo);
                  if (settings.preserveHTML) {
                    $combo.html(text);
                  } else {
                    $combo.text(text);
                  }
                } else {
                  if (text !== module.get.placeholderText()) {
                    $text.removeClass(className.placeholder);
                  }
                  module.debug('Changing text', text, $text);
                  $text.removeClass(className.filtered);
                  if (settings.preserveHTML) {
                    $text.html(text);
                  } else {
                    $text.text(text);
                  }
                }
              }
            },
            selectedItem: function ($item) {
              var value = module.get.choiceValue($item),
                  text = module.get.choiceText($item, false);
              module.debug('Setting user selection to item', $item);
              module.remove.activeItem();
              module.set.partialSearch(text);
              module.set.activeItem($item);
              module.set.selected(value, $item);
              module.set.text(text);
            },
            selectedLetter: function (letter) {
              var $selectedItem = $item.filter('.' + className.selected),
                  alreadySelectedLetter = $selectedItem.length > 0 && module.has.firstLetter($selectedItem, letter),
                  $nextValue = false,
                  $nextItem;
              // check next of same letter
              if (alreadySelectedLetter) {
                $nextItem = $selectedItem.nextAll($item).eq(0);
                if (module.has.firstLetter($nextItem, letter)) {
                  $nextValue = $nextItem;
                }
              }
              // check all values
              if (!$nextValue) {
                $item.each(function () {
                  if (module.has.firstLetter($(this), letter)) {
                    $nextValue = $(this);
                    return false;
                  }
                });
              }
              // set next value
              if ($nextValue) {
                module.verbose('Scrolling to next value with letter', letter);
                module.set.scrollPosition($nextValue);
                $selectedItem.removeClass(className.selected);
                $nextValue.addClass(className.selected);
                if (settings.selectOnKeydown && module.is.single()) {
                  module.set.selectedItem($nextValue);
                }
              }
            },
            direction: function ($menu) {
              if (settings.direction == 'auto') {
                if (module.is.onScreen($menu)) {
                  module.remove.upward($menu);
                } else {
                  module.set.upward($menu);
                }
              } else if (settings.direction == 'upward') {
                module.set.upward($menu);
              }
            },
            upward: function ($menu) {
              var $element = $menu || $module;
              $element.addClass(className.upward);
            },
            value: function (value, text, $selected) {
              var escapedValue = module.escape.value(value),
                  hasInput = $input.length > 0,
                  isAddition = !module.has.value(value),
                  currentValue = module.get.values(),
                  stringValue = value !== undefined ? String(value) : value,
                  newValue;
              if (hasInput) {
                if (!settings.allowReselection && stringValue == currentValue) {
                  module.verbose('Skipping value update already same value', value, currentValue);
                  if (!module.is.initialLoad()) {
                    return;
                  }
                }

                if (module.is.single() && module.has.selectInput() && module.can.extendSelect()) {
                  module.debug('Adding user option', value);
                  module.add.optionValue(value);
                }
                module.debug('Updating input value', escapedValue, currentValue);
                internalChange = true;
                $input.val(escapedValue);
                if (settings.fireOnInit === false && module.is.initialLoad()) {
                  module.debug('Input native change event ignored on initial load');
                } else {
                  module.trigger.change();
                }
                internalChange = false;
              } else {
                module.verbose('Storing value in metadata', escapedValue, $input);
                if (escapedValue !== currentValue) {
                  $module.data(metadata.value, stringValue);
                }
              }
              if (settings.fireOnInit === false && module.is.initialLoad()) {
                module.verbose('No callback on initial load', settings.onChange);
              } else {
                settings.onChange.call(element, value, text, $selected);
              }
            },
            active: function () {
              $module.addClass(className.active);
            },
            multiple: function () {
              $module.addClass(className.multiple);
            },
            visible: function () {
              $module.addClass(className.visible);
            },
            exactly: function (value, $selectedItem) {
              module.debug('Setting selected to exact values');
              module.clear();
              module.set.selected(value, $selectedItem);
            },
            selected: function (value, $selectedItem) {
              var isMultiple = module.is.multiple(),
                  $userSelectedItem;
              $selectedItem = settings.allowAdditions ? $selectedItem || module.get.itemWithAdditions(value) : $selectedItem || module.get.item(value);
              if (!$selectedItem) {
                return;
              }
              module.debug('Setting selected menu item to', $selectedItem);
              if (module.is.multiple()) {
                module.remove.searchWidth();
              }
              if (module.is.single()) {
                module.remove.activeItem();
                module.remove.selectedItem();
              } else if (settings.useLabels) {
                module.remove.selectedItem();
              }
              // select each item
              $selectedItem.each(function () {
                var $selected = $(this),
                    selectedText = module.get.choiceText($selected),
                    selectedValue = module.get.choiceValue($selected, selectedText),
                    isFiltered = $selected.hasClass(className.filtered),
                    isActive = $selected.hasClass(className.active),
                    isUserValue = $selected.hasClass(className.addition),
                    shouldAnimate = isMultiple && $selectedItem.length == 1;
                if (isMultiple) {
                  if (!isActive || isUserValue) {
                    if (settings.apiSettings && settings.saveRemoteData) {
                      module.save.remoteData(selectedText, selectedValue);
                    }
                    if (settings.useLabels) {
                      module.add.value(selectedValue, selectedText, $selected);
                      module.add.label(selectedValue, selectedText, shouldAnimate);
                      module.set.activeItem($selected);
                      module.filterActive();
                      module.select.nextAvailable($selectedItem);
                    } else {
                      module.add.value(selectedValue, selectedText, $selected);
                      module.set.text(module.add.variables(message.count));
                      module.set.activeItem($selected);
                    }
                  } else if (!isFiltered) {
                    module.debug('Selected active value, removing label');
                    module.remove.selected(selectedValue);
                  }
                } else {
                  if (settings.apiSettings && settings.saveRemoteData) {
                    module.save.remoteData(selectedText, selectedValue);
                  }
                  module.set.text(selectedText);
                  module.set.value(selectedValue, selectedText, $selected);
                  $selected.addClass(className.active).addClass(className.selected);
                }
              });
            }
          },

          add: {
            label: function (value, text, shouldAnimate) {
              var $next = module.is.searchSelection() ? $search : $text,
                  escapedValue = module.escape.value(value),
                  $label;
              $label = $('<a />').addClass(className.label).attr('data-value', escapedValue).html(templates.label(escapedValue, text));
              $label = settings.onLabelCreate.call($label, escapedValue, text);

              if (module.has.label(value)) {
                module.debug('Label already exists, skipping', escapedValue);
                return;
              }
              if (settings.label.variation) {
                $label.addClass(settings.label.variation);
              }
              if (shouldAnimate === true) {
                module.debug('Animating in label', $label);
                $label.addClass(className.hidden).insertBefore($next).transition(settings.label.transition, settings.label.duration);
              } else {
                module.debug('Adding selection label', $label);
                $label.insertBefore($next);
              }
            },
            message: function (message) {
              var $message = $menu.children(selector.message),
                  html = settings.templates.message(module.add.variables(message));
              if ($message.length > 0) {
                $message.html(html);
              } else {
                $message = $('<div/>').html(html).addClass(className.message).appendTo($menu);
              }
            },
            optionValue: function (value) {
              var escapedValue = module.escape.value(value),
                  $option = $input.find('option[value="' + escapedValue + '"]'),
                  hasOption = $option.length > 0;
              if (hasOption) {
                return;
              }
              // temporarily disconnect observer
              module.disconnect.selectObserver();
              if (module.is.single()) {
                module.verbose('Removing previous user addition');
                $input.find('option.' + className.addition).remove();
              }
              $('<option/>').prop('value', escapedValue).addClass(className.addition).html(value).appendTo($input);
              module.verbose('Adding user addition as an <option>', value);
              module.observe.select();
            },
            userSuggestion: function (value) {
              var $addition = $menu.children(selector.addition),
                  $existingItem = module.get.item(value),
                  alreadyHasValue = $existingItem && $existingItem.not(selector.addition).length,
                  hasUserSuggestion = $addition.length > 0,
                  html;
              if (settings.useLabels && module.has.maxSelections()) {
                return;
              }
              if (value === '' || alreadyHasValue) {
                $addition.remove();
                return;
              }
              if (hasUserSuggestion) {
                $addition.data(metadata.value, value).data(metadata.text, value).attr('data-' + metadata.value, value).attr('data-' + metadata.text, value).removeClass(className.filtered);
                if (!settings.hideAdditions) {
                  html = settings.templates.addition(module.add.variables(message.addResult, value));
                  $addition.html(html);
                }
                module.verbose('Replacing user suggestion with new value', $addition);
              } else {
                $addition = module.create.userChoice(value);
                $addition.prependTo($menu);
                module.verbose('Adding item choice to menu corresponding with user choice addition', $addition);
              }
              if (!settings.hideAdditions || module.is.allFiltered()) {
                $addition.addClass(className.selected).siblings().removeClass(className.selected);
              }
              module.refreshItems();
            },
            variables: function (message, term) {
              var hasCount = message.search('{count}') !== -1,
                  hasMaxCount = message.search('{maxCount}') !== -1,
                  hasTerm = message.search('{term}') !== -1,
                  values,
                  count,
                  query;
              module.verbose('Adding templated variables to message', message);
              if (hasCount) {
                count = module.get.selectionCount();
                message = message.replace('{count}', count);
              }
              if (hasMaxCount) {
                count = module.get.selectionCount();
                message = message.replace('{maxCount}', settings.maxSelections);
              }
              if (hasTerm) {
                query = term || module.get.query();
                message = message.replace('{term}', query);
              }
              return message;
            },
            value: function (addedValue, addedText, $selectedItem) {
              var currentValue = module.get.values(),
                  newValue;
              if (addedValue === '') {
                module.debug('Cannot select blank values from multiselect');
                return;
              }
              // extend current array
              if ($.isArray(currentValue)) {
                newValue = currentValue.concat([addedValue]);
                newValue = module.get.uniqueArray(newValue);
              } else {
                newValue = [addedValue];
              }
              // add values
              if (module.has.selectInput()) {
                if (module.can.extendSelect()) {
                  module.debug('Adding value to select', addedValue, newValue, $input);
                  module.add.optionValue(addedValue);
                }
              } else {
                newValue = newValue.join(settings.delimiter);
                module.debug('Setting hidden input to delimited value', newValue, $input);
              }

              if (settings.fireOnInit === false && module.is.initialLoad()) {
                module.verbose('Skipping onadd callback on initial load', settings.onAdd);
              } else {
                settings.onAdd.call(element, addedValue, addedText, $selectedItem);
              }
              module.set.value(newValue, addedValue, addedText, $selectedItem);
              module.check.maxSelections();
            }
          },

          remove: {
            active: function () {
              $module.removeClass(className.active);
            },
            activeLabel: function () {
              $module.find(selector.label).removeClass(className.active);
            },
            empty: function () {
              $module.removeClass(className.empty);
            },
            loading: function () {
              $module.removeClass(className.loading);
            },
            initialLoad: function () {
              initialLoad = false;
            },
            upward: function ($menu) {
              var $element = $menu || $module;
              $element.removeClass(className.upward);
            },
            visible: function () {
              $module.removeClass(className.visible);
            },
            activeItem: function () {
              $item.removeClass(className.active);
            },
            filteredItem: function () {
              if (settings.useLabels && module.has.maxSelections()) {
                return;
              }
              if (settings.useLabels && module.is.multiple()) {
                $item.not('.' + className.active).removeClass(className.filtered);
              } else {
                $item.removeClass(className.filtered);
              }
              module.remove.empty();
            },
            optionValue: function (value) {
              var escapedValue = module.escape.value(value),
                  $option = $input.find('option[value="' + escapedValue + '"]'),
                  hasOption = $option.length > 0;
              if (!hasOption || !$option.hasClass(className.addition)) {
                return;
              }
              // temporarily disconnect observer
              if (selectObserver) {
                selectObserver.disconnect();
                module.verbose('Temporarily disconnecting mutation observer');
              }
              $option.remove();
              module.verbose('Removing user addition as an <option>', escapedValue);
              if (selectObserver) {
                selectObserver.observe($input[0], {
                  childList: true,
                  subtree: true
                });
              }
            },
            message: function () {
              $menu.children(selector.message).remove();
            },
            searchWidth: function () {
              $search.css('width', '');
            },
            searchTerm: function () {
              module.verbose('Cleared search term');
              $search.val('');
              module.set.filtered();
            },
            userAddition: function () {
              $item.filter(selector.addition).remove();
            },
            selected: function (value, $selectedItem) {
              $selectedItem = settings.allowAdditions ? $selectedItem || module.get.itemWithAdditions(value) : $selectedItem || module.get.item(value);

              if (!$selectedItem) {
                return false;
              }

              $selectedItem.each(function () {
                var $selected = $(this),
                    selectedText = module.get.choiceText($selected),
                    selectedValue = module.get.choiceValue($selected, selectedText);
                if (module.is.multiple()) {
                  if (settings.useLabels) {
                    module.remove.value(selectedValue, selectedText, $selected);
                    module.remove.label(selectedValue);
                  } else {
                    module.remove.value(selectedValue, selectedText, $selected);
                    if (module.get.selectionCount() === 0) {
                      module.set.placeholderText();
                    } else {
                      module.set.text(module.add.variables(message.count));
                    }
                  }
                } else {
                  module.remove.value(selectedValue, selectedText, $selected);
                }
                $selected.removeClass(className.filtered).removeClass(className.active);
                if (settings.useLabels) {
                  $selected.removeClass(className.selected);
                }
              });
            },
            selectedItem: function () {
              $item.removeClass(className.selected);
            },
            value: function (removedValue, removedText, $removedItem) {
              var values = module.get.values(),
                  newValue;
              if (module.has.selectInput()) {
                module.verbose('Input is <select> removing selected option', removedValue);
                newValue = module.remove.arrayValue(removedValue, values);
                module.remove.optionValue(removedValue);
              } else {
                module.verbose('Removing from delimited values', removedValue);
                newValue = module.remove.arrayValue(removedValue, values);
                newValue = newValue.join(settings.delimiter);
              }
              if (settings.fireOnInit === false && module.is.initialLoad()) {
                module.verbose('No callback on initial load', settings.onRemove);
              } else {
                settings.onRemove.call(element, removedValue, removedText, $removedItem);
              }
              module.set.value(newValue, removedText, $removedItem);
              module.check.maxSelections();
            },
            arrayValue: function (removedValue, values) {
              if (!$.isArray(values)) {
                values = [values];
              }
              values = $.grep(values, function (value) {
                return removedValue != value;
              });
              module.verbose('Removed value from delimited string', removedValue, values);
              return values;
            },
            label: function (value, shouldAnimate) {
              var $labels = $module.find(selector.label),
                  $removedLabel = $labels.filter('[data-value="' + value + '"]');
              module.verbose('Removing label', $removedLabel);
              $removedLabel.remove();
            },
            activeLabels: function ($activeLabels) {
              $activeLabels = $activeLabels || $module.find(selector.label).filter('.' + className.active);
              module.verbose('Removing active label selections', $activeLabels);
              module.remove.labels($activeLabels);
            },
            labels: function ($labels) {
              $labels = $labels || $module.find(selector.label);
              module.verbose('Removing labels', $labels);
              $labels.each(function () {
                var $label = $(this),
                    value = $label.data(metadata.value),
                    stringValue = value !== undefined ? String(value) : value,
                    isUserValue = module.is.userValue(stringValue);
                if (settings.onLabelRemove.call($label, value) === false) {
                  module.debug('Label remove callback cancelled removal');
                  return;
                }
                module.remove.message();
                if (isUserValue) {
                  module.remove.value(stringValue);
                  module.remove.label(stringValue);
                } else {
                  // selected will also remove label
                  module.remove.selected(stringValue);
                }
              });
            },
            tabbable: function () {
              if (module.has.search()) {
                module.debug('Searchable dropdown initialized');
                $search.removeAttr('tabindex');
                $menu.removeAttr('tabindex');
              } else {
                module.debug('Simple selection dropdown initialized');
                $module.removeAttr('tabindex');
                $menu.removeAttr('tabindex');
              }
            }
          },

          has: {
            menuSearch: function () {
              return module.has.search() && $search.closest($menu).length > 0;
            },
            search: function () {
              return $search.length > 0;
            },
            sizer: function () {
              return $sizer.length > 0;
            },
            selectInput: function () {
              return $input.is('select');
            },
            minCharacters: function (searchTerm) {
              if (settings.minCharacters) {
                searchTerm = searchTerm !== undefined ? String(searchTerm) : String(module.get.query());
                return searchTerm.length >= settings.minCharacters;
              }
              return true;
            },
            firstLetter: function ($item, letter) {
              var text, firstLetter;
              if (!$item || $item.length === 0 || typeof letter !== 'string') {
                return false;
              }
              text = module.get.choiceText($item, false);
              letter = letter.toLowerCase();
              firstLetter = String(text).charAt(0).toLowerCase();
              return letter == firstLetter;
            },
            input: function () {
              return $input.length > 0;
            },
            items: function () {
              return $item.length > 0;
            },
            menu: function () {
              return $menu.length > 0;
            },
            message: function () {
              return $menu.children(selector.message).length !== 0;
            },
            label: function (value) {
              var escapedValue = module.escape.value(value),
                  $labels = $module.find(selector.label);
              return $labels.filter('[data-value="' + escapedValue + '"]').length > 0;
            },
            maxSelections: function () {
              return settings.maxSelections && module.get.selectionCount() >= settings.maxSelections;
            },
            allResultsFiltered: function () {
              var $normalResults = $item.not(selector.addition);
              return $normalResults.filter(selector.unselectable).length === $normalResults.length;
            },
            userSuggestion: function () {
              return $menu.children(selector.addition).length > 0;
            },
            query: function () {
              return module.get.query() !== '';
            },
            value: function (value) {
              var values = module.get.values(),
                  hasValue = $.isArray(values) ? values && $.inArray(value, values) !== -1 : values == value;
              return hasValue ? true : false;
            }
          },

          is: {
            active: function () {
              return $module.hasClass(className.active);
            },
            bubbledLabelClick: function (event) {
              return $(event.target).is('select, input') && $module.closest('label').length > 0;
            },
            bubbledIconClick: function (event) {
              return $(event.target).closest($icon).length > 0;
            },
            alreadySetup: function () {
              return $module.is('select') && $module.parent(selector.dropdown).length > 0 && $module.prev().length === 0;
            },
            animating: function ($subMenu) {
              return $subMenu ? $subMenu.transition && $subMenu.transition('is animating') : $menu.transition && $menu.transition('is animating');
            },
            disabled: function () {
              return $module.hasClass(className.disabled);
            },
            focused: function () {
              return document.activeElement === $module[0];
            },
            focusedOnSearch: function () {
              return document.activeElement === $search[0];
            },
            allFiltered: function () {
              return (module.is.multiple() || module.has.search()) && !(settings.hideAdditions == false && module.has.userSuggestion()) && !module.has.message() && module.has.allResultsFiltered();
            },
            hidden: function ($subMenu) {
              return !module.is.visible($subMenu);
            },
            initialLoad: function () {
              return initialLoad;
            },
            onScreen: function ($subMenu) {
              var $currentMenu = $subMenu || $menu,
                  canOpenDownward = true,
                  onScreen = {},
                  calculations;
              $currentMenu.addClass(className.loading);
              calculations = {
                context: {
                  scrollTop: $context.scrollTop(),
                  height: $context.outerHeight()
                },
                menu: {
                  offset: $currentMenu.offset(),
                  height: $currentMenu.outerHeight()
                }
              };
              onScreen = {
                above: calculations.context.scrollTop <= calculations.menu.offset.top - calculations.menu.height,
                below: calculations.context.scrollTop + calculations.context.height >= calculations.menu.offset.top + calculations.menu.height
              };
              if (onScreen.below) {
                module.verbose('Dropdown can fit in context downward', onScreen);
                canOpenDownward = true;
              } else if (!onScreen.below && !onScreen.above) {
                module.verbose('Dropdown cannot fit in either direction, favoring downward', onScreen);
                canOpenDownward = true;
              } else {
                module.verbose('Dropdown cannot fit below, opening upward', onScreen);
                canOpenDownward = false;
              }
              $currentMenu.removeClass(className.loading);
              return canOpenDownward;
            },
            inObject: function (needle, object) {
              var found = false;
              $.each(object, function (index, property) {
                if (property == needle) {
                  found = true;
                  return true;
                }
              });
              return found;
            },
            multiple: function () {
              return $module.hasClass(className.multiple);
            },
            single: function () {
              return !module.is.multiple();
            },
            selectMutation: function (mutations) {
              var selectChanged = false;
              $.each(mutations, function (index, mutation) {
                if (mutation.target && $(mutation.target).is('select')) {
                  selectChanged = true;
                  return true;
                }
              });
              return selectChanged;
            },
            search: function () {
              return $module.hasClass(className.search);
            },
            searchSelection: function () {
              return module.has.search() && $search.parent(selector.dropdown).length === 1;
            },
            selection: function () {
              return $module.hasClass(className.selection);
            },
            userValue: function (value) {
              return $.inArray(value, module.get.userValues()) !== -1;
            },
            upward: function ($menu) {
              var $element = $menu || $module;
              return $element.hasClass(className.upward);
            },
            visible: function ($subMenu) {
              return $subMenu ? $subMenu.hasClass(className.visible) : $menu.hasClass(className.visible);
            }
          },

          can: {
            activate: function ($item) {
              if (settings.useLabels) {
                return true;
              }
              if (!module.has.maxSelections()) {
                return true;
              }
              if (module.has.maxSelections() && $item.hasClass(className.active)) {
                return true;
              }
              return false;
            },
            click: function () {
              return hasTouch || settings.on == 'click';
            },
            extendSelect: function () {
              return settings.allowAdditions || settings.apiSettings;
            },
            show: function () {
              return !module.is.disabled() && (module.has.items() || module.has.message());
            },
            useAPI: function () {
              return $.fn.api !== undefined;
            }
          },

          animate: {
            show: function (callback, $subMenu) {
              var $currentMenu = $subMenu || $menu,
                  start = $subMenu ? function () {} : function () {
                module.hideSubMenus();
                module.hideOthers();
                module.set.active();
              },
                  transition;
              callback = $.isFunction(callback) ? callback : function () {};
              module.verbose('Doing menu show animation', $currentMenu);
              module.set.direction($subMenu);
              transition = module.get.transition($subMenu);
              if (module.is.selection()) {
                module.set.scrollPosition(module.get.selectedItem(), true);
              }
              if (module.is.hidden($currentMenu) || module.is.animating($currentMenu)) {
                if (transition == 'none') {
                  start();
                  $currentMenu.transition('show');
                  callback.call(element);
                } else if ($.fn.transition !== undefined && $module.transition('is supported')) {
                  $currentMenu.transition({
                    animation: transition + ' in',
                    debug: settings.debug,
                    verbose: settings.verbose,
                    duration: settings.duration,
                    queue: true,
                    onStart: start,
                    onComplete: function () {
                      callback.call(element);
                    }
                  });
                } else {
                  module.error(error.noTransition, transition);
                }
              }
            },
            hide: function (callback, $subMenu) {
              var $currentMenu = $subMenu || $menu,
                  duration = $subMenu ? settings.duration * 0.9 : settings.duration,
                  start = $subMenu ? function () {} : function () {
                if (module.can.click()) {
                  module.unbind.intent();
                }
                module.remove.active();
              },
                  transition = module.get.transition($subMenu);
              callback = $.isFunction(callback) ? callback : function () {};
              if (module.is.visible($currentMenu) || module.is.animating($currentMenu)) {
                module.verbose('Doing menu hide animation', $currentMenu);

                if (transition == 'none') {
                  start();
                  $currentMenu.transition('hide');
                  callback.call(element);
                } else if ($.fn.transition !== undefined && $module.transition('is supported')) {
                  $currentMenu.transition({
                    animation: transition + ' out',
                    duration: settings.duration,
                    debug: settings.debug,
                    verbose: settings.verbose,
                    queue: true,
                    onStart: start,
                    onComplete: function () {
                      if (settings.direction == 'auto') {
                        module.remove.upward($subMenu);
                      }
                      callback.call(element);
                    }
                  });
                } else {
                  module.error(error.transition);
                }
              }
            }
          },

          hideAndClear: function () {
            module.remove.searchTerm();
            if (module.has.maxSelections()) {
              return;
            }
            if (module.has.search()) {
              module.hide(function () {
                module.remove.filteredItem();
              });
            } else {
              module.hide();
            }
          },

          delay: {
            show: function () {
              module.verbose('Delaying show event to ensure user intent');
              clearTimeout(module.timer);
              module.timer = setTimeout(module.show, settings.delay.show);
            },
            hide: function () {
              module.verbose('Delaying hide event to ensure user intent');
              clearTimeout(module.timer);
              module.timer = setTimeout(module.hide, settings.delay.hide);
            }
          },

          escape: {
            value: function (value) {
              var multipleValues = $.isArray(value),
                  stringValue = typeof value === 'string',
                  isUnparsable = !stringValue && !multipleValues,
                  hasQuotes = stringValue && value.search(regExp.quote) !== -1,
                  values = [];
              if (!module.has.selectInput() || isUnparsable || !hasQuotes) {
                return value;
              }
              module.debug('Encoding quote values for use in select', value);
              if (multipleValues) {
                $.each(value, function (index, value) {
                  values.push(value.replace(regExp.quote, '&quot;'));
                });
                return values;
              }
              return value.replace(regExp.quote, '&quot;');
            },
            regExp: function (text) {
              text = String(text);
              return text.replace(regExp.escape, '\\$&');
            }
          },

          setting: function (name, value) {
            module.debug('Changing setting', name, value);
            if ($.isPlainObject(name)) {
              $.extend(true, settings, name);
            } else if (value !== undefined) {
              if ($.isPlainObject(settings[name])) {
                $.extend(true, settings[name], value);
              } else {
                settings[name] = value;
              }
            } else {
              return settings[name];
            }
          },
          internal: function (name, value) {
            if ($.isPlainObject(name)) {
              $.extend(true, module, name);
            } else if (value !== undefined) {
              module[name] = value;
            } else {
              return module[name];
            }
          },
          debug: function () {
            if (!settings.silent && settings.debug) {
              if (settings.performance) {
                module.performance.log(arguments);
              } else {
                module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
                module.debug.apply(console, arguments);
              }
            }
          },
          verbose: function () {
            if (!settings.silent && settings.verbose && settings.debug) {
              if (settings.performance) {
                module.performance.log(arguments);
              } else {
                module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
                module.verbose.apply(console, arguments);
              }
            }
          },
          error: function () {
            if (!settings.silent) {
              module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
              module.error.apply(console, arguments);
            }
          },
          performance: {
            log: function (message) {
              var currentTime, executionTime, previousTime;
              if (settings.performance) {
                currentTime = new Date().getTime();
                previousTime = time || currentTime;
                executionTime = currentTime - previousTime;
                time = currentTime;
                performance.push({
                  'Name': message[0],
                  'Arguments': [].slice.call(message, 1) || '',
                  'Element': element,
                  'Execution Time': executionTime
                });
              }
              clearTimeout(module.performance.timer);
              module.performance.timer = setTimeout(module.performance.display, 500);
            },
            display: function () {
              var title = settings.name + ':',
                  totalTime = 0;
              time = false;
              clearTimeout(module.performance.timer);
              $.each(performance, function (index, data) {
                totalTime += data['Execution Time'];
              });
              title += ' ' + totalTime + 'ms';
              if (moduleSelector) {
                title += ' \'' + moduleSelector + '\'';
              }
              if ((console.group !== undefined || console.table !== undefined) && performance.length > 0) {
                console.groupCollapsed(title);
                if (console.table) {
                  console.table(performance);
                } else {
                  $.each(performance, function (index, data) {
                    console.log(data['Name'] + ': ' + data['Execution Time'] + 'ms');
                  });
                }
                console.groupEnd();
              }
              performance = [];
            }
          },
          invoke: function (query, passedArguments, context) {
            var object = instance,
                maxDepth,
                found,
                response;
            passedArguments = passedArguments || queryArguments;
            context = element || context;
            if (typeof query == 'string' && object !== undefined) {
              query = query.split(/[\. ]/);
              maxDepth = query.length - 1;
              $.each(query, function (depth, value) {
                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth) {
                  object = object[camelCaseValue];
                } else if (object[camelCaseValue] !== undefined) {
                  found = object[camelCaseValue];
                  return false;
                } else if ($.isPlainObject(object[value]) && depth != maxDepth) {
                  object = object[value];
                } else if (object[value] !== undefined) {
                  found = object[value];
                  return false;
                } else {
                  module.error(error.method, query);
                  return false;
                }
              });
            }
            if ($.isFunction(found)) {
              response = found.apply(context, passedArguments);
            } else if (found !== undefined) {
              response = found;
            }
            if ($.isArray(returnedValue)) {
              returnedValue.push(response);
            } else if (returnedValue !== undefined) {
              returnedValue = [returnedValue, response];
            } else if (response !== undefined) {
              returnedValue = response;
            }
            return found;
          }
        };

        if (methodInvoked) {
          if (instance === undefined) {
            module.initialize();
          }
          module.invoke(query);
        } else {
          if (instance !== undefined) {
            instance.invoke('destroy');
          }
          module.initialize();
        }
      });
      return returnedValue !== undefined ? returnedValue : $allModules;
    };

    _module.exports.settings = {

      silent: false,
      debug: false,
      verbose: false,
      performance: true,

      on: 'click', // what event should show menu action on item selection
      action: 'activate', // action on item selection (nothing, activate, select, combo, hide, function(){})


      apiSettings: false,
      selectOnKeydown: true, // Whether selection should occur automatically when keyboard shortcuts used
      minCharacters: 0, // Minimum characters required to trigger API call
      saveRemoteData: true, // Whether remote name/value pairs should be stored in sessionStorage to allow remote data to be restored on page refresh
      throttle: 200, // How long to wait after last user input to search remotely

      context: window, // Context to use when determining if on screen
      direction: 'auto', // Whether dropdown should always open in one direction
      keepOnScreen: true, // Whether dropdown should check whether it is on screen before showing

      match: 'both', // what to match against with search selection (both, text, or label)
      fullTextSearch: false, // search anywhere in value (set to 'exact' to require exact matches)

      placeholder: 'auto', // whether to convert blank <select> values to placeholder text
      preserveHTML: true, // preserve html when selecting value
      sortSelect: false, // sort selection on init

      forceSelection: true, // force a choice on blur with search selection

      allowAdditions: false, // whether multiple select should allow user added values
      hideAdditions: true, // whether or not to hide special message prompting a user they can enter a value

      maxSelections: false, // When set to a number limits the number of selections to this count
      useLabels: true, // whether multiple select should filter currently active selections from choices
      delimiter: ',', // when multiselect uses normal <input> the values will be delimited with this character

      showOnFocus: true, // show menu on focus
      allowReselection: false, // whether current value should trigger callbacks when reselected
      allowTab: true, // add tabindex to element
      allowCategorySelection: false, // allow elements with sub-menus to be selected

      fireOnInit: false, // Whether callbacks should fire when initializing dropdown values

      transition: 'auto', // auto transition will slide down or up based on direction
      duration: 200, // duration of transition

      glyphWidth: 1.037, // widest glyph width in em (W is 1.037 em) used to calculate multiselect input width

      // label settings on multi-select
      label: {
        transition: 'scale',
        duration: 200,
        variation: false
      },

      // delay before event
      delay: {
        hide: 300,
        show: 200,
        search: 20,
        touch: 50
      },

      /* Callbacks */
      onChange: function (value, text, $selected) {},
      onAdd: function (value, text, $selected) {},
      onRemove: function (value, text, $selected) {},

      onLabelSelect: function ($selectedLabels) {},
      onLabelCreate: function (value, text) {
        return $(this);
      },
      onLabelRemove: function (value) {
        return true;
      },
      onNoResults: function (searchTerm) {
        return true;
      },
      onShow: function () {},
      onHide: function () {},

      /* Component */
      name: 'Dropdown',
      namespace: 'dropdown',

      message: {
        addResult: 'Add <b>{term}</b>',
        count: '{count} selected',
        maxSelections: 'Max {maxCount} selections',
        noResults: 'No results found.',
        serverError: 'There was an error contacting the server'
      },

      error: {
        action: 'You called a dropdown action that was not defined',
        alreadySetup: 'Once a select has been initialized behaviors must be called on the created ui dropdown',
        labels: 'Allowing user additions currently requires the use of labels.',
        missingMultiple: '<select> requires multiple property to be set to correctly preserve multiple values',
        method: 'The method you called is not defined.',
        noAPI: 'The API module is required to load resources remotely',
        noStorage: 'Saving remote data requires session storage',
        noTransition: 'This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>'
      },

      regExp: {
        escape: /[-[\]{}()*+?.,\\^$|#\s]/g,
        quote: /"/g
      },

      metadata: {
        defaultText: 'defaultText',
        defaultValue: 'defaultValue',
        placeholderText: 'placeholder',
        text: 'text',
        value: 'value'
      },

      // property names for remote query
      fields: {
        remoteValues: 'results', // grouping for api results
        values: 'values', // grouping for all dropdown values
        disabled: 'disabled', // whether value should be disabled
        name: 'name', // displayed dropdown text
        value: 'value', // actual dropdown value
        text: 'text' // displayed text when selected
      },

      keys: {
        backspace: 8,
        delimiter: 188, // comma
        deleteKey: 46,
        enter: 13,
        escape: 27,
        pageUp: 33,
        pageDown: 34,
        leftArrow: 37,
        upArrow: 38,
        rightArrow: 39,
        downArrow: 40
      },

      selector: {
        addition: '.addition',
        dropdown: '.ui.dropdown',
        hidden: '.hidden',
        icon: '> .dropdown.icon',
        input: '> input[type="hidden"], > select',
        item: '.item',
        label: '> .label',
        remove: '> .label > .delete.icon',
        siblingLabel: '.label',
        menu: '.menu',
        message: '.message',
        menuIcon: '.dropdown.icon',
        search: 'input.search, .menu > .search > input, .menu input.search',
        sizer: '> input.sizer',
        text: '> .text:not(.icon)',
        unselectable: '.disabled, .filtered'
      },

      className: {
        active: 'active',
        addition: 'addition',
        animating: 'animating',
        disabled: 'disabled',
        empty: 'empty',
        dropdown: 'ui dropdown',
        filtered: 'filtered',
        hidden: 'hidden transition',
        item: 'item',
        label: 'ui label',
        loading: 'loading',
        menu: 'menu',
        message: 'message',
        multiple: 'multiple',
        placeholder: 'default',
        sizer: 'sizer',
        search: 'search',
        selected: 'selected',
        selection: 'selection',
        upward: 'upward',
        visible: 'visible'
      }

    };

    /* Templates */
    _module.exports.settings.templates = {

      // generates dropdown from select values
      dropdown: function (select) {
        var placeholder = select.placeholder || false,
            values = select.values || {},
            html = '';
        html += '<i class="dropdown icon"></i>';
        if (select.placeholder) {
          html += '<div class="default text">' + placeholder + '</div>';
        } else {
          html += '<div class="text"></div>';
        }
        html += '<div class="menu">';
        $.each(select.values, function (index, option) {
          html += option.disabled ? '<div class="disabled item" data-value="' + option.value + '">' + option.name + '</div>' : '<div class="item" data-value="' + option.value + '">' + option.name + '</div>';
        });
        html += '</div>';
        return html;
      },

      // generates just menu from select
      menu: function (response, fields) {
        var values = response[fields.values] || {},
            html = '';
        $.each(values, function (index, option) {
          var maybeText = option[fields.text] ? 'data-text="' + option[fields.text] + '"' : '',
              maybeDisabled = option[fields.disabled] ? 'disabled ' : '';
          html += '<div class="' + maybeDisabled + 'item" data-value="' + option[fields.value] + '"' + maybeText + '>';
          html += option[fields.name];
          html += '</div>';
        });
        return html;
      },

      // generates label for multiselect
      label: function (value, text) {
        return text + '<i class="delete icon"></i>';
      },

      // generates messages like "No results"
      message: function (message) {
        return message;
      },

      // generates user addition to selection menu
      addition: function (choice) {
        return choice;
      }

    };
  })($__require('npm:jquery@3.1.1.js'), window, document);
  return module.exports;
});
System.registerDynamic("npm:semantic-ui-dropdown@2.2.3.js", ["npm:semantic-ui-dropdown@2.2.3/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:semantic-ui-dropdown@2.2.3/index.js");
  return module.exports;
});
(function() {
var define = System.amdDefine;
(function(global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ? factory(global, true) : function(w) {
      if (!w.document) {
        throw new Error("jQuery requires a window with a document");
      }
      return factory(w);
    };
  } else {
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  var arr = [];
  var document = window.document;
  var getProto = Object.getPrototypeOf;
  var slice = arr.slice;
  var concat = arr.concat;
  var push = arr.push;
  var indexOf = arr.indexOf;
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  var fnToString = hasOwn.toString;
  var ObjectFunctionString = fnToString.call(Object);
  var support = {};
  function DOMEval(code, doc) {
    doc = doc || document;
    var script = doc.createElement("script");
    script.text = code;
    doc.head.appendChild(script).parentNode.removeChild(script);
  }
  var version = "3.1.1",
      jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
      },
      rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      rmsPrefix = /^-ms-/,
      rdashAlpha = /-([a-z])/g,
      fcamelCase = function(all, letter) {
        return letter.toUpperCase();
      };
  jQuery.fn = jQuery.prototype = {
    jquery: version,
    constructor: jQuery,
    length: 0,
    toArray: function() {
      return slice.call(this);
    },
    get: function(num) {
      if (num == null) {
        return slice.call(this);
      }
      return num < 0 ? this[num + this.length] : this[num];
    },
    pushStack: function(elems) {
      var ret = jQuery.merge(this.constructor(), elems);
      ret.prevObject = this;
      return ret;
    },
    each: function(callback) {
      return jQuery.each(this, callback);
    },
    map: function(callback) {
      return this.pushStack(jQuery.map(this, function(elem, i) {
        return callback.call(elem, i, elem);
      }));
    },
    slice: function() {
      return this.pushStack(slice.apply(this, arguments));
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    eq: function(i) {
      var len = this.length,
          j = +i + (i < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },
    end: function() {
      return this.prevObject || this.constructor();
    },
    push: push,
    sort: arr.sort,
    splice: arr.splice
  };
  jQuery.extend = jQuery.fn.extend = function() {
    var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];
            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }
            target[name] = jQuery.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  jQuery.extend({
    expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
    isReady: true,
    error: function(msg) {
      throw new Error(msg);
    },
    noop: function() {},
    isFunction: function(obj) {
      return jQuery.type(obj) === "function";
    },
    isArray: Array.isArray,
    isWindow: function(obj) {
      return obj != null && obj === obj.window;
    },
    isNumeric: function(obj) {
      var type = jQuery.type(obj);
      return (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj));
    },
    isPlainObject: function(obj) {
      var proto,
          Ctor;
      if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
      }
      proto = getProto(obj);
      if (!proto) {
        return true;
      }
      Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    },
    isEmptyObject: function(obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    },
    type: function(obj) {
      if (obj == null) {
        return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
    },
    globalEval: function(code) {
      DOMEval(code);
    },
    camelCase: function(string) {
      return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    },
    nodeName: function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    each: function(obj, callback) {
      var length,
          i = 0;
      if (isArrayLike(obj)) {
        length = obj.length;
        for (; i < length; i++) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }
      return obj;
    },
    trim: function(text) {
      return text == null ? "" : (text + "").replace(rtrim, "");
    },
    makeArray: function(arr, results) {
      var ret = results || [];
      if (arr != null) {
        if (isArrayLike(Object(arr))) {
          jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
        } else {
          push.call(ret, arr);
        }
      }
      return ret;
    },
    inArray: function(elem, arr, i) {
      return arr == null ? -1 : indexOf.call(arr, elem, i);
    },
    merge: function(first, second) {
      var len = +second.length,
          j = 0,
          i = first.length;
      for (; j < len; j++) {
        first[i++] = second[j];
      }
      first.length = i;
      return first;
    },
    grep: function(elems, callback, invert) {
      var callbackInverse,
          matches = [],
          i = 0,
          length = elems.length,
          callbackExpect = !invert;
      for (; i < length; i++) {
        callbackInverse = !callback(elems[i], i);
        if (callbackInverse !== callbackExpect) {
          matches.push(elems[i]);
        }
      }
      return matches;
    },
    map: function(elems, callback, arg) {
      var length,
          value,
          i = 0,
          ret = [];
      if (isArrayLike(elems)) {
        length = elems.length;
        for (; i < length; i++) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      }
      return concat.apply([], ret);
    },
    guid: 1,
    proxy: function(fn, context) {
      var tmp,
          args,
          proxy;
      if (typeof context === "string") {
        tmp = fn[context];
        context = fn;
        fn = tmp;
      }
      if (!jQuery.isFunction(fn)) {
        return undefined;
      }
      args = slice.call(arguments, 2);
      proxy = function() {
        return fn.apply(context || this, args.concat(slice.call(arguments)));
      };
      proxy.guid = fn.guid = fn.guid || jQuery.guid++;
      return proxy;
    },
    now: Date.now,
    support: support
  });
  if (typeof Symbol === "function") {
    jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
  }
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });
  function isArrayLike(obj) {
    var length = !!obj && "length" in obj && obj.length,
        type = jQuery.type(obj);
    if (type === "function" || jQuery.isWindow(obj)) {
      return false;
    }
    return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
  }
  var Sizzle = (function(window) {
    var i,
        support,
        Expr,
        getText,
        isXML,
        tokenize,
        compile,
        select,
        outermostContext,
        sortInput,
        hasDuplicate,
        setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,
        expando = "sizzle" + 1 * new Date(),
        preferredDoc = window.document,
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        sortOrder = function(a, b) {
          if (a === b) {
            hasDuplicate = true;
          }
          return 0;
        },
        hasOwn = ({}).hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        indexOf = function(list, elem) {
          var i = 0,
              len = list.length;
          for (; i < len; i++) {
            if (list[i] === elem) {
              return i;
            }
          }
          return -1;
        },
        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        whitespace = "[\\x20\\t\\r\\n\\f]",
        identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
        attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
        pseudos = ":(" + identifier + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + ".*" + ")\\)|)",
        rwhitespace = new RegExp(whitespace + "+", "g"),
        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
        rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
        rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
        rpseudo = new RegExp(pseudos),
        ridentifier = new RegExp("^" + identifier + "$"),
        matchExpr = {
          "ID": new RegExp("^#(" + identifier + ")"),
          "CLASS": new RegExp("^\\.(" + identifier + ")"),
          "TAG": new RegExp("^(" + identifier + "|[*])"),
          "ATTR": new RegExp("^" + attributes),
          "PSEUDO": new RegExp("^" + pseudos),
          "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
          "bool": new RegExp("^(?:" + booleans + ")$", "i"),
          "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        },
        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,
        rnative = /^[^{]+\{\s*\[native \w/,
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        rsibling = /[+~]/,
        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
        funescape = function(_, escaped, escapedWhitespace) {
          var high = "0x" + escaped - 0x10000;
          return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
        },
        rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
        fcssescape = function(ch, asCodePoint) {
          if (asCodePoint) {
            if (ch === "\0") {
              return "\uFFFD";
            }
            return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
          }
          return "\\" + ch;
        },
        unloadHandler = function() {
          setDocument();
        },
        disabledAncestor = addCombinator(function(elem) {
          return elem.disabled === true && ("form" in elem || "label" in elem);
        }, {
          dir: "parentNode",
          next: "legend"
        });
    try {
      push.apply((arr = slice.call(preferredDoc.childNodes)), preferredDoc.childNodes);
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
      push = {apply: arr.length ? function(target, els) {
          push_native.apply(target, slice.call(els));
        } : function(target, els) {
          var j = target.length,
              i = 0;
          while ((target[j++] = els[i++])) {}
          target.length = j - 1;
        }};
    }
    function Sizzle(selector, context, results, seed) {
      var m,
          i,
          elem,
          nid,
          match,
          groups,
          newSelector,
          newContext = context && context.ownerDocument,
          nodeType = context ? context.nodeType : 9;
      results = results || [];
      if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
        return results;
      }
      if (!seed) {
        if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
          setDocument(context);
        }
        context = context || document;
        if (documentIsHTML) {
          if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
            if ((m = match[1])) {
              if (nodeType === 9) {
                if ((elem = context.getElementById(m))) {
                  if (elem.id === m) {
                    results.push(elem);
                    return results;
                  }
                } else {
                  return results;
                }
              } else {
                if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
                  results.push(elem);
                  return results;
                }
              }
            } else if (match[2]) {
              push.apply(results, context.getElementsByTagName(selector));
              return results;
            } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
              push.apply(results, context.getElementsByClassName(m));
              return results;
            }
          }
          if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
            if (nodeType !== 1) {
              newContext = context;
              newSelector = selector;
            } else if (context.nodeName.toLowerCase() !== "object") {
              if ((nid = context.getAttribute("id"))) {
                nid = nid.replace(rcssescape, fcssescape);
              } else {
                context.setAttribute("id", (nid = expando));
              }
              groups = tokenize(selector);
              i = groups.length;
              while (i--) {
                groups[i] = "#" + nid + " " + toSelector(groups[i]);
              }
              newSelector = groups.join(",");
              newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
            }
            if (newSelector) {
              try {
                push.apply(results, newContext.querySelectorAll(newSelector));
                return results;
              } catch (qsaError) {} finally {
                if (nid === expando) {
                  context.removeAttribute("id");
                }
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    function createCache() {
      var keys = [];
      function cache(key, value) {
        if (keys.push(key + " ") > Expr.cacheLength) {
          delete cache[keys.shift()];
        }
        return (cache[key + " "] = value);
      }
      return cache;
    }
    function markFunction(fn) {
      fn[expando] = true;
      return fn;
    }
    function assert(fn) {
      var el = document.createElement("fieldset");
      try {
        return !!fn(el);
      } catch (e) {
        return false;
      } finally {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        el = null;
      }
    }
    function addHandle(attrs, handler) {
      var arr = attrs.split("|"),
          i = arr.length;
      while (i--) {
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    function siblingCheck(a, b) {
      var cur = b && a,
          diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;
      if (diff) {
        return diff;
      }
      if (cur) {
        while ((cur = cur.nextSibling)) {
          if (cur === b) {
            return -1;
          }
        }
      }
      return a ? 1 : -1;
    }
    function createInputPseudo(type) {
      return function(elem) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
      };
    }
    function createButtonPseudo(type) {
      return function(elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
      };
    }
    function createDisabledPseudo(disabled) {
      return function(elem) {
        if ("form" in elem) {
          if (elem.parentNode && elem.disabled === false) {
            if ("label" in elem) {
              if ("label" in elem.parentNode) {
                return elem.parentNode.disabled === disabled;
              } else {
                return elem.disabled === disabled;
              }
            }
            return elem.isDisabled === disabled || elem.isDisabled !== !disabled && disabledAncestor(elem) === disabled;
          }
          return elem.disabled === disabled;
        } else if ("label" in elem) {
          return elem.disabled === disabled;
        }
        return false;
      };
    }
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        argument = +argument;
        return markFunction(function(seed, matches) {
          var j,
              matchIndexes = fn([], seed.length, argument),
              i = matchIndexes.length;
          while (i--) {
            if (seed[(j = matchIndexes[i])]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    function testContext(context) {
      return context && typeof context.getElementsByTagName !== "undefined" && context;
    }
    support = Sizzle.support = {};
    isXML = Sizzle.isXML = function(elem) {
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    setDocument = Sizzle.setDocument = function(node) {
      var hasCompare,
          subWindow,
          doc = node ? node.ownerDocument || node : preferredDoc;
      if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
        return document;
      }
      document = doc;
      docElem = document.documentElement;
      documentIsHTML = !isXML(document);
      if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {
        if (subWindow.addEventListener) {
          subWindow.addEventListener("unload", unloadHandler, false);
        } else if (subWindow.attachEvent) {
          subWindow.attachEvent("onunload", unloadHandler);
        }
      }
      support.attributes = assert(function(el) {
        el.className = "i";
        return !el.getAttribute("className");
      });
      support.getElementsByTagName = assert(function(el) {
        el.appendChild(document.createComment(""));
        return !el.getElementsByTagName("*").length;
      });
      support.getElementsByClassName = rnative.test(document.getElementsByClassName);
      support.getById = assert(function(el) {
        docElem.appendChild(el).id = expando;
        return !document.getElementsByName || !document.getElementsByName(expando).length;
      });
      if (support.getById) {
        Expr.filter["ID"] = function(id) {
          var attrId = id.replace(runescape, funescape);
          return function(elem) {
            return elem.getAttribute("id") === attrId;
          };
        };
        Expr.find["ID"] = function(id, context) {
          if (typeof context.getElementById !== "undefined" && documentIsHTML) {
            var elem = context.getElementById(id);
            return elem ? [elem] : [];
          }
        };
      } else {
        Expr.filter["ID"] = function(id) {
          var attrId = id.replace(runescape, funescape);
          return function(elem) {
            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
            return node && node.value === attrId;
          };
        };
        Expr.find["ID"] = function(id, context) {
          if (typeof context.getElementById !== "undefined" && documentIsHTML) {
            var node,
                i,
                elems,
                elem = context.getElementById(id);
            if (elem) {
              node = elem.getAttributeNode("id");
              if (node && node.value === id) {
                return [elem];
              }
              elems = context.getElementsByName(id);
              i = 0;
              while ((elem = elems[i++])) {
                node = elem.getAttributeNode("id");
                if (node && node.value === id) {
                  return [elem];
                }
              }
            }
            return [];
          }
        };
      }
      Expr.find["TAG"] = support.getElementsByTagName ? function(tag, context) {
        if (typeof context.getElementsByTagName !== "undefined") {
          return context.getElementsByTagName(tag);
        } else if (support.qsa) {
          return context.querySelectorAll(tag);
        }
      } : function(tag, context) {
        var elem,
            tmp = [],
            i = 0,
            results = context.getElementsByTagName(tag);
        if (tag === "*") {
          while ((elem = results[i++])) {
            if (elem.nodeType === 1) {
              tmp.push(elem);
            }
          }
          return tmp;
        }
        return results;
      };
      Expr.find["CLASS"] = support.getElementsByClassName && function(className, context) {
        if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
          return context.getElementsByClassName(className);
        }
      };
      rbuggyMatches = [];
      rbuggyQSA = [];
      if ((support.qsa = rnative.test(document.querySelectorAll))) {
        assert(function(el) {
          docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";
          if (el.querySelectorAll("[msallowcapture^='']").length) {
            rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
          }
          if (!el.querySelectorAll("[selected]").length) {
            rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
          }
          if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
            rbuggyQSA.push("~=");
          }
          if (!el.querySelectorAll(":checked").length) {
            rbuggyQSA.push(":checked");
          }
          if (!el.querySelectorAll("a#" + expando + "+*").length) {
            rbuggyQSA.push(".#.+[+~]");
          }
        });
        assert(function(el) {
          el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>";
          var input = document.createElement("input");
          input.setAttribute("type", "hidden");
          el.appendChild(input).setAttribute("name", "D");
          if (el.querySelectorAll("[name=d]").length) {
            rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
          }
          if (el.querySelectorAll(":enabled").length !== 2) {
            rbuggyQSA.push(":enabled", ":disabled");
          }
          docElem.appendChild(el).disabled = true;
          if (el.querySelectorAll(":disabled").length !== 2) {
            rbuggyQSA.push(":enabled", ":disabled");
          }
          el.querySelectorAll("*,:x");
          rbuggyQSA.push(",.*:");
        });
      }
      if ((support.matchesSelector = rnative.test((matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)))) {
        assert(function(el) {
          support.disconnectedMatch = matches.call(el, "*");
          matches.call(el, "[s!='']:x");
          rbuggyMatches.push("!=", pseudos);
        });
      }
      rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
      rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
      hasCompare = rnative.test(docElem.compareDocumentPosition);
      contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      } : function(a, b) {
        if (b) {
          while ((b = b.parentNode)) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      };
      sortOrder = hasCompare ? function(a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if (compare) {
          return compare;
        }
        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
        if (compare & 1 || (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
          if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
            return -1;
          }
          if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
            return 1;
          }
          return sortInput ? (indexOf(sortInput, a) - indexOf(sortInput, b)) : 0;
        }
        return compare & 4 ? -1 : 1;
      } : function(a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [a],
            bp = [b];
        if (!aup || !bup) {
          return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? (indexOf(sortInput, a) - indexOf(sortInput, b)) : 0;
        } else if (aup === bup) {
          return siblingCheck(a, b);
        }
        cur = a;
        while ((cur = cur.parentNode)) {
          ap.unshift(cur);
        }
        cur = b;
        while ((cur = cur.parentNode)) {
          bp.unshift(cur);
        }
        while (ap[i] === bp[i]) {
          i++;
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      };
      return document;
    };
    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    Sizzle.matchesSelector = function(elem, expr) {
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }
      expr = expr.replace(rattributeQuotes, "='$1']");
      if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
        try {
          var ret = matches.call(elem, expr);
          if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
            return ret;
          }
        } catch (e) {}
      }
      return Sizzle(expr, document, null, [elem]).length > 0;
    };
    Sizzle.contains = function(context, elem) {
      if ((context.ownerDocument || context) !== document) {
        setDocument(context);
      }
      return contains(context, elem);
    };
    Sizzle.attr = function(elem, name) {
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name.toLowerCase()],
          val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
      return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    };
    Sizzle.escape = function(sel) {
      return (sel + "").replace(rcssescape, fcssescape);
    };
    Sizzle.error = function(msg) {
      throw new Error("Syntax error, unrecognized expression: " + msg);
    };
    Sizzle.uniqueSort = function(results) {
      var elem,
          duplicates = [],
          j = 0,
          i = 0;
      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);
      if (hasDuplicate) {
        while ((elem = results[i++])) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }
        while (j--) {
          results.splice(duplicates[j], 1);
        }
      }
      sortInput = null;
      return results;
    };
    getText = Sizzle.getText = function(elem) {
      var node,
          ret = "",
          i = 0,
          nodeType = elem.nodeType;
      if (!nodeType) {
        while ((node = elem[i++])) {
          ret += getText(node);
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        if (typeof elem.textContent === "string") {
          return elem.textContent;
        } else {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            ret += getText(elem);
          }
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      }
      return ret;
    };
    Expr = Sizzle.selectors = {
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: true
        },
        " ": {dir: "parentNode"},
        "+": {
          dir: "previousSibling",
          first: true
        },
        "~": {dir: "previousSibling"}
      },
      preFilter: {
        "ATTR": function(match) {
          match[1] = match[1].replace(runescape, funescape);
          match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
          if (match[2] === "~=") {
            match[3] = " " + match[3] + " ";
          }
          return match.slice(0, 4);
        },
        "CHILD": function(match) {
          match[1] = match[1].toLowerCase();
          if (match[1].slice(0, 3) === "nth") {
            if (!match[3]) {
              Sizzle.error(match[0]);
            }
            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
            match[5] = +((match[7] + match[8]) || match[3] === "odd");
          } else if (match[3]) {
            Sizzle.error(match[0]);
          }
          return match;
        },
        "PSEUDO": function(match) {
          var excess,
              unquoted = !match[6] && match[2];
          if (matchExpr["CHILD"].test(match[0])) {
            return null;
          }
          if (match[3]) {
            match[2] = match[4] || match[5] || "";
          } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
            match[0] = match[0].slice(0, excess);
            match[2] = unquoted.slice(0, excess);
          }
          return match.slice(0, 3);
        }
      },
      filter: {
        "TAG": function(nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return nodeNameSelector === "*" ? function() {
            return true;
          } : function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        "CLASS": function(className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
            return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
          });
        },
        "ATTR": function(name, operator, check) {
          return function(elem) {
            var result = Sizzle.attr(elem, name);
            if (result == null) {
              return operator === "!=";
            }
            if (!operator) {
              return true;
            }
            result += "";
            return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
          };
        },
        "CHILD": function(type, what, argument, first, last) {
          var simple = type.slice(0, 3) !== "nth",
              forward = type.slice(-4) !== "last",
              ofType = what === "of-type";
          return first === 1 && last === 0 ? function(elem) {
            return !!elem.parentNode;
          } : function(elem, context, xml) {
            var cache,
                uniqueCache,
                outerCache,
                node,
                nodeIndex,
                start,
                dir = simple !== forward ? "nextSibling" : "previousSibling",
                parent = elem.parentNode,
                name = ofType && elem.nodeName.toLowerCase(),
                useCache = !xml && !ofType,
                diff = false;
            if (parent) {
              if (simple) {
                while (dir) {
                  node = elem;
                  while ((node = node[dir])) {
                    if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                      return false;
                    }
                  }
                  start = dir = type === "only" && !start && "nextSibling";
                }
                return true;
              }
              start = [forward ? parent.firstChild : parent.lastChild];
              if (forward && useCache) {
                node = parent;
                outerCache = node[expando] || (node[expando] = {});
                uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                cache = uniqueCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = nodeIndex && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];
                while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                  if (node.nodeType === 1 && ++diff && node === elem) {
                    uniqueCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else {
                if (useCache) {
                  node = elem;
                  outerCache = node[expando] || (node[expando] = {});
                  uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                  cache = uniqueCache[type] || [];
                  nodeIndex = cache[0] === dirruns && cache[1];
                  diff = nodeIndex;
                }
                if (diff === false) {
                  while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                    if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                      if (useCache) {
                        outerCache = node[expando] || (node[expando] = {});
                        uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                        uniqueCache[type] = [dirruns, diff];
                      }
                      if (node === elem) {
                        break;
                      }
                    }
                  }
                }
              }
              diff -= last;
              return diff === first || (diff % first === 0 && diff / first >= 0);
            }
          };
        },
        "PSEUDO": function(pseudo, argument) {
          var args,
              fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
          if (fn[expando]) {
            return fn(argument);
          }
          if (fn.length > 1) {
            args = [pseudo, pseudo, "", argument];
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
              var idx,
                  matched = fn(seed, argument),
                  i = matched.length;
              while (i--) {
                idx = indexOf(seed, matched[i]);
                seed[idx] = !(matches[idx] = matched[i]);
              }
            }) : function(elem) {
              return fn(elem, 0, args);
            };
          }
          return fn;
        }
      },
      pseudos: {
        "not": markFunction(function(selector) {
          var input = [],
              results = [],
              matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
            var elem,
                unmatched = matcher(seed, null, xml, []),
                i = seed.length;
            while (i--) {
              if ((elem = unmatched[i])) {
                seed[i] = !(matches[i] = elem);
              }
            }
          }) : function(elem, context, xml) {
            input[0] = elem;
            matcher(input, null, xml, results);
            input[0] = null;
            return !results.pop();
          };
        }),
        "has": markFunction(function(selector) {
          return function(elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        "contains": markFunction(function(text) {
          text = text.replace(runescape, funescape);
          return function(elem) {
            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
          };
        }),
        "lang": markFunction(function(lang) {
          if (!ridentifier.test(lang || "")) {
            Sizzle.error("unsupported lang: " + lang);
          }
          lang = lang.replace(runescape, funescape).toLowerCase();
          return function(elem) {
            var elemLang;
            do {
              if ((elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {
                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
              }
            } while ((elem = elem.parentNode) && elem.nodeType === 1);
            return false;
          };
        }),
        "target": function(elem) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice(1) === elem.id;
        },
        "root": function(elem) {
          return elem === docElem;
        },
        "focus": function(elem) {
          return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },
        "enabled": createDisabledPseudo(false),
        "disabled": createDisabledPseudo(true),
        "checked": function(elem) {
          var nodeName = elem.nodeName.toLowerCase();
          return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
        },
        "selected": function(elem) {
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
          return elem.selected === true;
        },
        "empty": function(elem) {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }
          return true;
        },
        "parent": function(elem) {
          return !Expr.pseudos["empty"](elem);
        },
        "header": function(elem) {
          return rheader.test(elem.nodeName);
        },
        "input": function(elem) {
          return rinputs.test(elem.nodeName);
        },
        "button": function(elem) {
          var name = elem.nodeName.toLowerCase();
          return name === "input" && elem.type === "button" || name === "button";
        },
        "text": function(elem) {
          var attr;
          return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
        },
        "first": createPositionalPseudo(function() {
          return [0];
        }),
        "last": createPositionalPseudo(function(matchIndexes, length) {
          return [length - 1];
        }),
        "eq": createPositionalPseudo(function(matchIndexes, length, argument) {
          return [argument < 0 ? argument + length : argument];
        }),
        "even": createPositionalPseudo(function(matchIndexes, length) {
          var i = 0;
          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        "odd": createPositionalPseudo(function(matchIndexes, length) {
          var i = 1;
          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        "lt": createPositionalPseudo(function(matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;
          for (; --i >= 0; ) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        "gt": createPositionalPseudo(function(matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;
          for (; ++i < length; ) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        })
      }
    };
    Expr.pseudos["nth"] = Expr.pseudos["eq"];
    for (i in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in {
      submit: true,
      reset: true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();
    tokenize = Sizzle.tokenize = function(selector, parseOnly) {
      var matched,
          match,
          tokens,
          type,
          soFar,
          groups,
          preFilters,
          cached = tokenCache[selector + " "];
      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }
      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;
      while (soFar) {
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push((tokens = []));
        }
        matched = false;
        if ((match = rcombinators.exec(soFar))) {
          matched = match.shift();
          tokens.push({
            value: matched,
            type: match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: type,
              matches: match
            });
            soFar = soFar.slice(matched.length);
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
    };
    function toSelector(tokens) {
      var i = 0,
          len = tokens.length,
          selector = "";
      for (; i < len; i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir,
          skip = combinator.next,
          key = skip || dir,
          checkNonElements = base && key === "parentNode",
          doneName = done++;
      return combinator.first ? function(elem, context, xml) {
        while ((elem = elem[dir])) {
          if (elem.nodeType === 1 || checkNonElements) {
            return matcher(elem, context, xml);
          }
        }
        return false;
      } : function(elem, context, xml) {
        var oldCache,
            uniqueCache,
            outerCache,
            newCache = [dirruns, doneName];
        if (xml) {
          while ((elem = elem[dir])) {
            if (elem.nodeType === 1 || checkNonElements) {
              if (matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        } else {
          while ((elem = elem[dir])) {
            if (elem.nodeType === 1 || checkNonElements) {
              outerCache = elem[expando] || (elem[expando] = {});
              uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});
              if (skip && skip === elem.nodeName.toLowerCase()) {
                elem = elem[dir] || elem;
              } else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                return (newCache[2] = oldCache[2]);
              } else {
                uniqueCache[key] = newCache;
                if ((newCache[2] = matcher(elem, context, xml))) {
                  return true;
                }
              }
            }
          }
        }
        return false;
      };
    }
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function(elem, context, xml) {
        var i = matchers.length;
        while (i--) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    function multipleContexts(selector, contexts, results) {
      var i = 0,
          len = contexts.length;
      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    function condense(unmatched, map, filter, context, xml) {
      var elem,
          newUnmatched = [],
          i = 0,
          len = unmatched.length,
          mapped = map != null;
      for (; i < len; i++) {
        if ((elem = unmatched[i])) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem);
            if (mapped) {
              map.push(i);
            }
          }
        }
      }
      return newUnmatched;
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter);
      }
      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector);
      }
      return markFunction(function(seed, results, context, xml) {
        var temp,
            i,
            elem,
            preMap = [],
            postMap = [],
            preexisting = results.length,
            elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
            matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
            matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml);
        }
        if (postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml);
          i = temp.length;
          while (i--) {
            if ((elem = temp[i])) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              temp = [];
              i = matcherOut.length;
              while (i--) {
                if ((elem = matcherOut[i])) {
                  temp.push((matcherIn[i] = elem));
                }
              }
              postFinder(null, (matcherOut = []), temp, xml);
            }
            i = matcherOut.length;
            while (i--) {
              if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {
                seed[temp] = !(results[temp] = elem);
              }
            }
          }
        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }
    function matcherFromTokens(tokens) {
      var checkContext,
          matcher,
          j,
          len = tokens.length,
          leadingRelative = Expr.relative[tokens[0].type],
          implicitRelative = leadingRelative || Expr.relative[" "],
          i = leadingRelative ? 1 : 0,
          matchContext = addCombinator(function(elem) {
            return elem === checkContext;
          }, implicitRelative, true),
          matchAnyContext = addCombinator(function(elem) {
            return indexOf(checkContext, elem) > -1;
          }, implicitRelative, true),
          matchers = [function(elem, context, xml) {
            var ret = (!leadingRelative && (xml || context !== outermostContext)) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            checkContext = null;
            return ret;
          }];
      for (; i < len; i++) {
        if ((matcher = Expr.relative[tokens[i].type])) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
          if (matcher[expando]) {
            j = ++i;
            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({value: tokens[i - 2].type === " " ? "*" : ""})).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens((tokens = tokens.slice(j))), j < len && toSelector(tokens));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0,
          byElement = elementMatchers.length > 0,
          superMatcher = function(seed, context, xml, results, outermost) {
            var elem,
                j,
                matcher,
                matchedCount = 0,
                i = "0",
                unmatched = seed && [],
                setMatched = [],
                contextBackup = outermostContext,
                elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                len = elems.length;
            if (outermost) {
              outermostContext = context === document || context || outermost;
            }
            for (; i !== len && (elem = elems[i]) != null; i++) {
              if (byElement && elem) {
                j = 0;
                if (!context && elem.ownerDocument !== document) {
                  setDocument(elem);
                  xml = !documentIsHTML;
                }
                while ((matcher = elementMatchers[j++])) {
                  if (matcher(elem, context || document, xml)) {
                    results.push(elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if ((elem = !matcher && elem)) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i;
            if (bySet && i !== matchedCount) {
              j = 0;
              while ((matcher = setMatchers[j++])) {
                matcher(unmatched, setMatched, context, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i--) {
                    if (!(unmatched[i] || setMatched[i])) {
                      setMatched[i] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && (matchedCount + setMatchers.length) > 1) {
                Sizzle.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    compile = Sizzle.compile = function(selector, match) {
      var i,
          setMatchers = [],
          elementMatchers = [],
          cached = compilerCache[selector + " "];
      if (!cached) {
        if (!match) {
          match = tokenize(selector);
        }
        i = match.length;
        while (i--) {
          cached = matcherFromTokens(match[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
        cached.selector = selector;
      }
      return cached;
    };
    select = Sizzle.select = function(selector, context, results, seed) {
      var i,
          tokens,
          token,
          type,
          find,
          compiled = typeof selector === "function" && selector,
          match = !seed && tokenize((selector = compiled.selector || selector));
      results = results || [];
      if (match.length === 1) {
        tokens = match[0] = match[0].slice(0);
        if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
          context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
          if (!context) {
            return results;
          } else if (compiled) {
            context = context.parentNode;
          }
          selector = selector.slice(tokens.shift().value.length);
        }
        i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
        while (i--) {
          token = tokens[i];
          if (Expr.relative[(type = token.type)]) {
            break;
          }
          if ((find = Expr.find[type])) {
            if ((seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
              tokens.splice(i, 1);
              selector = seed.length && toSelector(tokens);
              if (!selector) {
                push.apply(results, seed);
                return results;
              }
              break;
            }
          }
        }
      }
      (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
      return results;
    };
    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
    support.detectDuplicates = !!hasDuplicate;
    setDocument();
    support.sortDetached = assert(function(el) {
      return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
    });
    if (!assert(function(el) {
      el.innerHTML = "<a href='#'></a>";
      return el.firstChild.getAttribute("href") === "#";
    })) {
      addHandle("type|href|height|width", function(elem, name, isXML) {
        if (!isXML) {
          return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
        }
      });
    }
    if (!support.attributes || !assert(function(el) {
      el.innerHTML = "<input/>";
      el.firstChild.setAttribute("value", "");
      return el.firstChild.getAttribute("value") === "";
    })) {
      addHandle("value", function(elem, name, isXML) {
        if (!isXML && elem.nodeName.toLowerCase() === "input") {
          return elem.defaultValue;
        }
      });
    }
    if (!assert(function(el) {
      return el.getAttribute("disabled") == null;
    })) {
      addHandle(booleans, function(elem, name, isXML) {
        var val;
        if (!isXML) {
          return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        }
      });
    }
    return Sizzle;
  })(window);
  jQuery.find = Sizzle;
  jQuery.expr = Sizzle.selectors;
  jQuery.expr[":"] = jQuery.expr.pseudos;
  jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
  jQuery.text = Sizzle.getText;
  jQuery.isXMLDoc = Sizzle.isXML;
  jQuery.contains = Sizzle.contains;
  jQuery.escapeSelector = Sizzle.escape;
  var dir = function(elem, dir, until) {
    var matched = [],
        truncate = until !== undefined;
    while ((elem = elem[dir]) && elem.nodeType !== 9) {
      if (elem.nodeType === 1) {
        if (truncate && jQuery(elem).is(until)) {
          break;
        }
        matched.push(elem);
      }
    }
    return matched;
  };
  var siblings = function(n, elem) {
    var matched = [];
    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== elem) {
        matched.push(n);
      }
    }
    return matched;
  };
  var rneedsContext = jQuery.expr.match.needsContext;
  var rsingleTag = (/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i);
  var risSimple = /^.[^:#\[\.,]*$/;
  function winnow(elements, qualifier, not) {
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, function(elem, i) {
        return !!qualifier.call(elem, i, elem) !== not;
      });
    }
    if (qualifier.nodeType) {
      return jQuery.grep(elements, function(elem) {
        return (elem === qualifier) !== not;
      });
    }
    if (typeof qualifier !== "string") {
      return jQuery.grep(elements, function(elem) {
        return (indexOf.call(qualifier, elem) > -1) !== not;
      });
    }
    if (risSimple.test(qualifier)) {
      return jQuery.filter(qualifier, elements, not);
    }
    qualifier = jQuery.filter(qualifier, elements);
    return jQuery.grep(elements, function(elem) {
      return (indexOf.call(qualifier, elem) > -1) !== not && elem.nodeType === 1;
    });
  }
  jQuery.filter = function(expr, elems, not) {
    var elem = elems[0];
    if (not) {
      expr = ":not(" + expr + ")";
    }
    if (elems.length === 1 && elem.nodeType === 1) {
      return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
    }
    return jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
      return elem.nodeType === 1;
    }));
  };
  jQuery.fn.extend({
    find: function(selector) {
      var i,
          ret,
          len = this.length,
          self = this;
      if (typeof selector !== "string") {
        return this.pushStack(jQuery(selector).filter(function() {
          for (i = 0; i < len; i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }
      ret = this.pushStack([]);
      for (i = 0; i < len; i++) {
        jQuery.find(selector, self[i], ret);
      }
      return len > 1 ? jQuery.uniqueSort(ret) : ret;
    },
    filter: function(selector) {
      return this.pushStack(winnow(this, selector || [], false));
    },
    not: function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    is: function(selector) {
      return !!winnow(this, typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    }
  });
  var rootjQuery,
      rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
      init = jQuery.fn.init = function(selector, context, root) {
        var match,
            elem;
        if (!selector) {
          return this;
        }
        root = root || rootjQuery;
        if (typeof selector === "string") {
          if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
            match = [null, selector, null];
          } else {
            match = rquickExpr.exec(selector);
          }
          if (match && (match[1] || !context)) {
            if (match[1]) {
              context = context instanceof jQuery ? context[0] : context;
              jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
              if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                for (match in context) {
                  if (jQuery.isFunction(this[match])) {
                    this[match](context[match]);
                  } else {
                    this.attr(match, context[match]);
                  }
                }
              }
              return this;
            } else {
              elem = document.getElementById(match[2]);
              if (elem) {
                this[0] = elem;
                this.length = 1;
              }
              return this;
            }
          } else if (!context || context.jquery) {
            return (context || root).find(selector);
          } else {
            return this.constructor(context).find(selector);
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
          return this;
        } else if (jQuery.isFunction(selector)) {
          return root.ready !== undefined ? root.ready(selector) : selector(jQuery);
        }
        return jQuery.makeArray(selector, this);
      };
  init.prototype = jQuery.fn;
  rootjQuery = jQuery(document);
  var rparentsprev = /^(?:parents|prev(?:Until|All))/,
      guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
      };
  jQuery.fn.extend({
    has: function(target) {
      var targets = jQuery(target, this),
          l = targets.length;
      return this.filter(function() {
        var i = 0;
        for (; i < l; i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    closest: function(selectors, context) {
      var cur,
          i = 0,
          l = this.length,
          matched = [],
          targets = typeof selectors !== "string" && jQuery(selectors);
      if (!rneedsContext.test(selectors)) {
        for (; i < l; i++) {
          for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
            if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
              matched.push(cur);
              break;
            }
          }
        }
      }
      return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
    },
    index: function(elem) {
      if (!elem) {
        return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
      }
      if (typeof elem === "string") {
        return indexOf.call(jQuery(elem), this[0]);
      }
      return indexOf.call(this, elem.jquery ? elem[0] : elem);
    },
    add: function(selector, context) {
      return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
    },
    addBack: function(selector) {
      return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    }
  });
  function sibling(cur, dir) {
    while ((cur = cur[dir]) && cur.nodeType !== 1) {}
    return cur;
  }
  jQuery.each({
    parent: function(elem) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function(elem) {
      return dir(elem, "parentNode");
    },
    parentsUntil: function(elem, i, until) {
      return dir(elem, "parentNode", until);
    },
    next: function(elem) {
      return sibling(elem, "nextSibling");
    },
    prev: function(elem) {
      return sibling(elem, "previousSibling");
    },
    nextAll: function(elem) {
      return dir(elem, "nextSibling");
    },
    prevAll: function(elem) {
      return dir(elem, "previousSibling");
    },
    nextUntil: function(elem, i, until) {
      return dir(elem, "nextSibling", until);
    },
    prevUntil: function(elem, i, until) {
      return dir(elem, "previousSibling", until);
    },
    siblings: function(elem) {
      return siblings((elem.parentNode || {}).firstChild, elem);
    },
    children: function(elem) {
      return siblings(elem.firstChild);
    },
    contents: function(elem) {
      return elem.contentDocument || jQuery.merge([], elem.childNodes);
    }
  }, function(name, fn) {
    jQuery.fn[name] = function(until, selector) {
      var matched = jQuery.map(this, fn, until);
      if (name.slice(-5) !== "Until") {
        selector = until;
      }
      if (selector && typeof selector === "string") {
        matched = jQuery.filter(selector, matched);
      }
      if (this.length > 1) {
        if (!guaranteedUnique[name]) {
          jQuery.uniqueSort(matched);
        }
        if (rparentsprev.test(name)) {
          matched.reverse();
        }
      }
      return this.pushStack(matched);
    };
  });
  var rnothtmlwhite = (/[^\x20\t\r\n\f]+/g);
  function createOptions(options) {
    var object = {};
    jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
      object[flag] = true;
    });
    return object;
  }
  jQuery.Callbacks = function(options) {
    options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
    var firing,
        memory,
        fired,
        locked,
        list = [],
        queue = [],
        firingIndex = -1,
        fire = function() {
          locked = options.once;
          fired = firing = true;
          for (; queue.length; firingIndex = -1) {
            memory = queue.shift();
            while (++firingIndex < list.length) {
              if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                firingIndex = list.length;
                memory = false;
              }
            }
          }
          if (!options.memory) {
            memory = false;
          }
          firing = false;
          if (locked) {
            if (memory) {
              list = [];
            } else {
              list = "";
            }
          }
        },
        self = {
          add: function() {
            if (list) {
              if (memory && !firing) {
                firingIndex = list.length - 1;
                queue.push(memory);
              }
              (function add(args) {
                jQuery.each(args, function(_, arg) {
                  if (jQuery.isFunction(arg)) {
                    if (!options.unique || !self.has(arg)) {
                      list.push(arg);
                    }
                  } else if (arg && arg.length && jQuery.type(arg) !== "string") {
                    add(arg);
                  }
                });
              })(arguments);
              if (memory && !firing) {
                fire();
              }
            }
            return this;
          },
          remove: function() {
            jQuery.each(arguments, function(_, arg) {
              var index;
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                if (index <= firingIndex) {
                  firingIndex--;
                }
              }
            });
            return this;
          },
          has: function(fn) {
            return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
          },
          empty: function() {
            if (list) {
              list = [];
            }
            return this;
          },
          disable: function() {
            locked = queue = [];
            list = memory = "";
            return this;
          },
          disabled: function() {
            return !list;
          },
          lock: function() {
            locked = queue = [];
            if (!memory && !firing) {
              list = memory = "";
            }
            return this;
          },
          locked: function() {
            return !!locked;
          },
          fireWith: function(context, args) {
            if (!locked) {
              args = args || [];
              args = [context, args.slice ? args.slice() : args];
              queue.push(args);
              if (!firing) {
                fire();
              }
            }
            return this;
          },
          fire: function() {
            self.fireWith(this, arguments);
            return this;
          },
          fired: function() {
            return !!fired;
          }
        };
    return self;
  };
  function Identity(v) {
    return v;
  }
  function Thrower(ex) {
    throw ex;
  }
  function adoptValue(value, resolve, reject) {
    var method;
    try {
      if (value && jQuery.isFunction((method = value.promise))) {
        method.call(value).done(resolve).fail(reject);
      } else if (value && jQuery.isFunction((method = value.then))) {
        method.call(value, resolve, reject);
      } else {
        resolve.call(undefined, value);
      }
    } catch (value) {
      reject.call(undefined, value);
    }
  }
  jQuery.extend({
    Deferred: function(func) {
      var tuples = [["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory"), 2], ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 1, "rejected"]],
          state = "pending",
          promise = {
            state: function() {
              return state;
            },
            always: function() {
              deferred.done(arguments).fail(arguments);
              return this;
            },
            "catch": function(fn) {
              return promise.then(null, fn);
            },
            pipe: function() {
              var fns = arguments;
              return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(i, tuple) {
                  var fn = jQuery.isFunction(fns[tuple[4]]) && fns[tuple[4]];
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this, arguments);
                    if (returned && jQuery.isFunction(returned.promise)) {
                      returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                    } else {
                      newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
                    }
                  });
                });
                fns = null;
              }).promise();
            },
            then: function(onFulfilled, onRejected, onProgress) {
              var maxDepth = 0;
              function resolve(depth, deferred, handler, special) {
                return function() {
                  var that = this,
                      args = arguments,
                      mightThrow = function() {
                        var returned,
                            then;
                        if (depth < maxDepth) {
                          return;
                        }
                        returned = handler.apply(that, args);
                        if (returned === deferred.promise()) {
                          throw new TypeError("Thenable self-resolution");
                        }
                        then = returned && (typeof returned === "object" || typeof returned === "function") && returned.then;
                        if (jQuery.isFunction(then)) {
                          if (special) {
                            then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special));
                          } else {
                            maxDepth++;
                            then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith));
                          }
                        } else {
                          if (handler !== Identity) {
                            that = undefined;
                            args = [returned];
                          }
                          (special || deferred.resolveWith)(that, args);
                        }
                      },
                      process = special ? mightThrow : function() {
                        try {
                          mightThrow();
                        } catch (e) {
                          if (jQuery.Deferred.exceptionHook) {
                            jQuery.Deferred.exceptionHook(e, process.stackTrace);
                          }
                          if (depth + 1 >= maxDepth) {
                            if (handler !== Thrower) {
                              that = undefined;
                              args = [e];
                            }
                            deferred.rejectWith(that, args);
                          }
                        }
                      };
                  if (depth) {
                    process();
                  } else {
                    if (jQuery.Deferred.getStackHook) {
                      process.stackTrace = jQuery.Deferred.getStackHook();
                    }
                    window.setTimeout(process);
                  }
                };
              }
              return jQuery.Deferred(function(newDefer) {
                tuples[0][3].add(resolve(0, newDefer, jQuery.isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith));
                tuples[1][3].add(resolve(0, newDefer, jQuery.isFunction(onFulfilled) ? onFulfilled : Identity));
                tuples[2][3].add(resolve(0, newDefer, jQuery.isFunction(onRejected) ? onRejected : Thrower));
              }).promise();
            },
            promise: function(obj) {
              return obj != null ? jQuery.extend(obj, promise) : promise;
            }
          },
          deferred = {};
      jQuery.each(tuples, function(i, tuple) {
        var list = tuple[2],
            stateString = tuple[5];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function() {
            state = stateString;
          }, tuples[3 - i][2].disable, tuples[0][2].lock);
        }
        list.add(tuple[3].fire);
        deferred[tuple[0]] = function() {
          deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
          return this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      });
      promise.promise(deferred);
      if (func) {
        func.call(deferred, deferred);
      }
      return deferred;
    },
    when: function(singleValue) {
      var remaining = arguments.length,
          i = remaining,
          resolveContexts = Array(i),
          resolveValues = slice.call(arguments),
          master = jQuery.Deferred(),
          updateFunc = function(i) {
            return function(value) {
              resolveContexts[i] = this;
              resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;
              if (!(--remaining)) {
                master.resolveWith(resolveContexts, resolveValues);
              }
            };
          };
      if (remaining <= 1) {
        adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject);
        if (master.state() === "pending" || jQuery.isFunction(resolveValues[i] && resolveValues[i].then)) {
          return master.then();
        }
      }
      while (i--) {
        adoptValue(resolveValues[i], updateFunc(i), master.reject);
      }
      return master.promise();
    }
  });
  var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  jQuery.Deferred.exceptionHook = function(error, stack) {
    if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
      window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
    }
  };
  jQuery.readyException = function(error) {
    window.setTimeout(function() {
      throw error;
    });
  };
  var readyList = jQuery.Deferred();
  jQuery.fn.ready = function(fn) {
    readyList.then(fn).catch(function(error) {
      jQuery.readyException(error);
    });
    return this;
  };
  jQuery.extend({
    isReady: false,
    readyWait: 1,
    holdReady: function(hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    ready: function(wait) {
      if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
        return;
      }
      jQuery.isReady = true;
      if (wait !== true && --jQuery.readyWait > 0) {
        return;
      }
      readyList.resolveWith(document, [jQuery]);
    }
  });
  jQuery.ready.then = readyList.then;
  function completed() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    jQuery.ready();
  }
  if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    window.setTimeout(jQuery.ready);
  } else {
    document.addEventListener("DOMContentLoaded", completed);
    window.addEventListener("load", completed);
  }
  var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
    var i = 0,
        len = elems.length,
        bulk = key == null;
    if (jQuery.type(key) === "object") {
      chainable = true;
      for (i in key) {
        access(elems, fn, i, key[i], true, emptyGet, raw);
      }
    } else if (value !== undefined) {
      chainable = true;
      if (!jQuery.isFunction(value)) {
        raw = true;
      }
      if (bulk) {
        if (raw) {
          fn.call(elems, value);
          fn = null;
        } else {
          bulk = fn;
          fn = function(elem, key, value) {
            return bulk.call(jQuery(elem), value);
          };
        }
      }
      if (fn) {
        for (; i < len; i++) {
          fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
        }
      }
    }
    if (chainable) {
      return elems;
    }
    if (bulk) {
      return fn.call(elems);
    }
    return len ? fn(elems[0], key) : emptyGet;
  };
  var acceptData = function(owner) {
    return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
  };
  function Data() {
    this.expando = jQuery.expando + Data.uid++;
  }
  Data.uid = 1;
  Data.prototype = {
    cache: function(owner) {
      var value = owner[this.expando];
      if (!value) {
        value = {};
        if (acceptData(owner)) {
          if (owner.nodeType) {
            owner[this.expando] = value;
          } else {
            Object.defineProperty(owner, this.expando, {
              value: value,
              configurable: true
            });
          }
        }
      }
      return value;
    },
    set: function(owner, data, value) {
      var prop,
          cache = this.cache(owner);
      if (typeof data === "string") {
        cache[jQuery.camelCase(data)] = value;
      } else {
        for (prop in data) {
          cache[jQuery.camelCase(prop)] = data[prop];
        }
      }
      return cache;
    },
    get: function(owner, key) {
      return key === undefined ? this.cache(owner) : owner[this.expando] && owner[this.expando][jQuery.camelCase(key)];
    },
    access: function(owner, key, value) {
      if (key === undefined || ((key && typeof key === "string") && value === undefined)) {
        return this.get(owner, key);
      }
      this.set(owner, key, value);
      return value !== undefined ? value : key;
    },
    remove: function(owner, key) {
      var i,
          cache = owner[this.expando];
      if (cache === undefined) {
        return;
      }
      if (key !== undefined) {
        if (jQuery.isArray(key)) {
          key = key.map(jQuery.camelCase);
        } else {
          key = jQuery.camelCase(key);
          key = key in cache ? [key] : (key.match(rnothtmlwhite) || []);
        }
        i = key.length;
        while (i--) {
          delete cache[key[i]];
        }
      }
      if (key === undefined || jQuery.isEmptyObject(cache)) {
        if (owner.nodeType) {
          owner[this.expando] = undefined;
        } else {
          delete owner[this.expando];
        }
      }
    },
    hasData: function(owner) {
      var cache = owner[this.expando];
      return cache !== undefined && !jQuery.isEmptyObject(cache);
    }
  };
  var dataPriv = new Data();
  var dataUser = new Data();
  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      rmultiDash = /[A-Z]/g;
  function getData(data) {
    if (data === "true") {
      return true;
    }
    if (data === "false") {
      return false;
    }
    if (data === "null") {
      return null;
    }
    if (data === +data + "") {
      return +data;
    }
    if (rbrace.test(data)) {
      return JSON.parse(data);
    }
    return data;
  }
  function dataAttr(elem, key, data) {
    var name;
    if (data === undefined && elem.nodeType === 1) {
      name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
      data = elem.getAttribute(name);
      if (typeof data === "string") {
        try {
          data = getData(data);
        } catch (e) {}
        dataUser.set(elem, key, data);
      } else {
        data = undefined;
      }
    }
    return data;
  }
  jQuery.extend({
    hasData: function(elem) {
      return dataUser.hasData(elem) || dataPriv.hasData(elem);
    },
    data: function(elem, name, data) {
      return dataUser.access(elem, name, data);
    },
    removeData: function(elem, name) {
      dataUser.remove(elem, name);
    },
    _data: function(elem, name, data) {
      return dataPriv.access(elem, name, data);
    },
    _removeData: function(elem, name) {
      dataPriv.remove(elem, name);
    }
  });
  jQuery.fn.extend({
    data: function(key, value) {
      var i,
          name,
          data,
          elem = this[0],
          attrs = elem && elem.attributes;
      if (key === undefined) {
        if (this.length) {
          data = dataUser.get(elem);
          if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
            i = attrs.length;
            while (i--) {
              if (attrs[i]) {
                name = attrs[i].name;
                if (name.indexOf("data-") === 0) {
                  name = jQuery.camelCase(name.slice(5));
                  dataAttr(elem, name, data[name]);
                }
              }
            }
            dataPriv.set(elem, "hasDataAttrs", true);
          }
        }
        return data;
      }
      if (typeof key === "object") {
        return this.each(function() {
          dataUser.set(this, key);
        });
      }
      return access(this, function(value) {
        var data;
        if (elem && value === undefined) {
          data = dataUser.get(elem, key);
          if (data !== undefined) {
            return data;
          }
          data = dataAttr(elem, key);
          if (data !== undefined) {
            return data;
          }
          return;
        }
        this.each(function() {
          dataUser.set(this, key, value);
        });
      }, null, value, arguments.length > 1, null, true);
    },
    removeData: function(key) {
      return this.each(function() {
        dataUser.remove(this, key);
      });
    }
  });
  jQuery.extend({
    queue: function(elem, type, data) {
      var queue;
      if (elem) {
        type = (type || "fx") + "queue";
        queue = dataPriv.get(elem, type);
        if (data) {
          if (!queue || jQuery.isArray(data)) {
            queue = dataPriv.access(elem, type, jQuery.makeArray(data));
          } else {
            queue.push(data);
          }
        }
        return queue || [];
      }
    },
    dequeue: function(elem, type) {
      type = type || "fx";
      var queue = jQuery.queue(elem, type),
          startLength = queue.length,
          fn = queue.shift(),
          hooks = jQuery._queueHooks(elem, type),
          next = function() {
            jQuery.dequeue(elem, type);
          };
      if (fn === "inprogress") {
        fn = queue.shift();
        startLength--;
      }
      if (fn) {
        if (type === "fx") {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!startLength && hooks) {
        hooks.empty.fire();
      }
    },
    _queueHooks: function(elem, type) {
      var key = type + "queueHooks";
      return dataPriv.get(elem, key) || dataPriv.access(elem, key, {empty: jQuery.Callbacks("once memory").add(function() {
          dataPriv.remove(elem, [type + "queue", key]);
        })});
    }
  });
  jQuery.fn.extend({
    queue: function(type, data) {
      var setter = 2;
      if (typeof type !== "string") {
        data = type;
        type = "fx";
        setter--;
      }
      if (arguments.length < setter) {
        return jQuery.queue(this[0], type);
      }
      return data === undefined ? this : this.each(function() {
        var queue = jQuery.queue(this, type, data);
        jQuery._queueHooks(this, type);
        if (type === "fx" && queue[0] !== "inprogress") {
          jQuery.dequeue(this, type);
        }
      });
    },
    dequeue: function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    clearQueue: function(type) {
      return this.queue(type || "fx", []);
    },
    promise: function(type, obj) {
      var tmp,
          count = 1,
          defer = jQuery.Deferred(),
          elements = this,
          i = this.length,
          resolve = function() {
            if (!(--count)) {
              defer.resolveWith(elements, [elements]);
            }
          };
      if (typeof type !== "string") {
        obj = type;
        type = undefined;
      }
      type = type || "fx";
      while (i--) {
        tmp = dataPriv.get(elements[i], type + "queueHooks");
        if (tmp && tmp.empty) {
          count++;
          tmp.empty.add(resolve);
        }
      }
      resolve();
      return defer.promise(obj);
    }
  });
  var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
  var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  var isHiddenWithinTree = function(elem, el) {
    elem = el || elem;
    return elem.style.display === "none" || elem.style.display === "" && jQuery.contains(elem.ownerDocument, elem) && jQuery.css(elem, "display") === "none";
  };
  var swap = function(elem, options, callback, args) {
    var ret,
        name,
        old = {};
    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }
    ret = callback.apply(elem, args || []);
    for (name in options) {
      elem.style[name] = old[name];
    }
    return ret;
  };
  function adjustCSS(elem, prop, valueParts, tween) {
    var adjusted,
        scale = 1,
        maxIterations = 20,
        currentValue = tween ? function() {
          return tween.cur();
        } : function() {
          return jQuery.css(elem, prop, "");
        },
        initial = currentValue(),
        unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),
        initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
    if (initialInUnit && initialInUnit[3] !== unit) {
      unit = unit || initialInUnit[3];
      valueParts = valueParts || [];
      initialInUnit = +initial || 1;
      do {
        scale = scale || ".5";
        initialInUnit = initialInUnit / scale;
        jQuery.style(elem, prop, initialInUnit + unit);
      } while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
    }
    if (valueParts) {
      initialInUnit = +initialInUnit || +initial || 0;
      adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
      if (tween) {
        tween.unit = unit;
        tween.start = initialInUnit;
        tween.end = adjusted;
      }
    }
    return adjusted;
  }
  var defaultDisplayMap = {};
  function getDefaultDisplay(elem) {
    var temp,
        doc = elem.ownerDocument,
        nodeName = elem.nodeName,
        display = defaultDisplayMap[nodeName];
    if (display) {
      return display;
    }
    temp = doc.body.appendChild(doc.createElement(nodeName));
    display = jQuery.css(temp, "display");
    temp.parentNode.removeChild(temp);
    if (display === "none") {
      display = "block";
    }
    defaultDisplayMap[nodeName] = display;
    return display;
  }
  function showHide(elements, show) {
    var display,
        elem,
        values = [],
        index = 0,
        length = elements.length;
    for (; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      display = elem.style.display;
      if (show) {
        if (display === "none") {
          values[index] = dataPriv.get(elem, "display") || null;
          if (!values[index]) {
            elem.style.display = "";
          }
        }
        if (elem.style.display === "" && isHiddenWithinTree(elem)) {
          values[index] = getDefaultDisplay(elem);
        }
      } else {
        if (display !== "none") {
          values[index] = "none";
          dataPriv.set(elem, "display", display);
        }
      }
    }
    for (index = 0; index < length; index++) {
      if (values[index] != null) {
        elements[index].style.display = values[index];
      }
    }
    return elements;
  }
  jQuery.fn.extend({
    show: function() {
      return showHide(this, true);
    },
    hide: function() {
      return showHide(this);
    },
    toggle: function(state) {
      if (typeof state === "boolean") {
        return state ? this.show() : this.hide();
      }
      return this.each(function() {
        if (isHiddenWithinTree(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  var rcheckableType = (/^(?:checkbox|radio)$/i);
  var rtagName = (/<([a-z][^\/\0>\x20\t\r\n\f]+)/i);
  var rscriptType = (/^$|\/(?:java|ecma)script/i);
  var wrapMap = {
    option: [1, "<select multiple='multiple'>", "</select>"],
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""]
  };
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;
  function getAll(context, tag) {
    var ret;
    if (typeof context.getElementsByTagName !== "undefined") {
      ret = context.getElementsByTagName(tag || "*");
    } else if (typeof context.querySelectorAll !== "undefined") {
      ret = context.querySelectorAll(tag || "*");
    } else {
      ret = [];
    }
    if (tag === undefined || tag && jQuery.nodeName(context, tag)) {
      return jQuery.merge([context], ret);
    }
    return ret;
  }
  function setGlobalEval(elems, refElements) {
    var i = 0,
        l = elems.length;
    for (; i < l; i++) {
      dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
    }
  }
  var rhtml = /<|&#?\w+;/;
  function buildFragment(elems, context, scripts, selection, ignored) {
    var elem,
        tmp,
        tag,
        wrap,
        contains,
        j,
        fragment = context.createDocumentFragment(),
        nodes = [],
        i = 0,
        l = elems.length;
    for (; i < l; i++) {
      elem = elems[i];
      if (elem || elem === 0) {
        if (jQuery.type(elem) === "object") {
          jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
        } else if (!rhtml.test(elem)) {
          nodes.push(context.createTextNode(elem));
        } else {
          tmp = tmp || fragment.appendChild(context.createElement("div"));
          tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
          wrap = wrapMap[tag] || wrapMap._default;
          tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
          j = wrap[0];
          while (j--) {
            tmp = tmp.lastChild;
          }
          jQuery.merge(nodes, tmp.childNodes);
          tmp = fragment.firstChild;
          tmp.textContent = "";
        }
      }
    }
    fragment.textContent = "";
    i = 0;
    while ((elem = nodes[i++])) {
      if (selection && jQuery.inArray(elem, selection) > -1) {
        if (ignored) {
          ignored.push(elem);
        }
        continue;
      }
      contains = jQuery.contains(elem.ownerDocument, elem);
      tmp = getAll(fragment.appendChild(elem), "script");
      if (contains) {
        setGlobalEval(tmp);
      }
      if (scripts) {
        j = 0;
        while ((elem = tmp[j++])) {
          if (rscriptType.test(elem.type || "")) {
            scripts.push(elem);
          }
        }
      }
    }
    return fragment;
  }
  (function() {
    var fragment = document.createDocumentFragment(),
        div = fragment.appendChild(document.createElement("div")),
        input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("checked", "checked");
    input.setAttribute("name", "t");
    div.appendChild(input);
    support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
    div.innerHTML = "<textarea>x</textarea>";
    support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
  })();
  var documentElement = document.documentElement;
  var rkeyEvent = /^key/,
      rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
      rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
  function returnTrue() {
    return true;
  }
  function returnFalse() {
    return false;
  }
  function safeActiveElement() {
    try {
      return document.activeElement;
    } catch (err) {}
  }
  function on(elem, types, selector, data, fn, one) {
    var origFn,
        type;
    if (typeof types === "object") {
      if (typeof selector !== "string") {
        data = data || selector;
        selector = undefined;
      }
      for (type in types) {
        on(elem, type, selector, data, types[type], one);
      }
      return elem;
    }
    if (data == null && fn == null) {
      fn = selector;
      data = selector = undefined;
    } else if (fn == null) {
      if (typeof selector === "string") {
        fn = data;
        data = undefined;
      } else {
        fn = data;
        data = selector;
        selector = undefined;
      }
    }
    if (fn === false) {
      fn = returnFalse;
    } else if (!fn) {
      return elem;
    }
    if (one === 1) {
      origFn = fn;
      fn = function(event) {
        jQuery().off(event);
        return origFn.apply(this, arguments);
      };
      fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
    }
    return elem.each(function() {
      jQuery.event.add(this, types, fn, data, selector);
    });
  }
  jQuery.event = {
    global: {},
    add: function(elem, types, handler, data, selector) {
      var handleObjIn,
          eventHandle,
          tmp,
          events,
          t,
          handleObj,
          special,
          handlers,
          type,
          namespaces,
          origType,
          elemData = dataPriv.get(elem);
      if (!elemData) {
        return;
      }
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }
      if (selector) {
        jQuery.find.matchesSelector(documentElement, selector);
      }
      if (!handler.guid) {
        handler.guid = jQuery.guid++;
      }
      if (!(events = elemData.events)) {
        events = elemData.events = {};
      }
      if (!(eventHandle = elemData.handle)) {
        eventHandle = elemData.handle = function(e) {
          return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
        };
      }
      types = (types || "").match(rnothtmlwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        if (!type) {
          continue;
        }
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        special = jQuery.event.special[type] || {};
        handleObj = jQuery.extend({
          type: type,
          origType: origType,
          data: data,
          handler: handler,
          guid: handler.guid,
          selector: selector,
          needsContext: selector && jQuery.expr.match.needsContext.test(selector),
          namespace: namespaces.join(".")
        }, handleObjIn);
        if (!(handlers = events[type])) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;
          if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle);
            }
          }
        }
        if (special.add) {
          special.add.call(elem, handleObj);
          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        }
        jQuery.event.global[type] = true;
      }
    },
    remove: function(elem, types, handler, selector, mappedTypes) {
      var j,
          origCount,
          tmp,
          events,
          t,
          handleObj,
          special,
          handlers,
          type,
          namespaces,
          origType,
          elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
      if (!elemData || !(events = elemData.events)) {
        return;
      }
      types = (types || "").match(rnothtmlwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        if (!type) {
          for (type in events) {
            jQuery.event.remove(elem, type + types[t], handler, selector, true);
          }
          continue;
        }
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        handlers = events[type] || [];
        tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
        origCount = j = handlers.length;
        while (j--) {
          handleObj = handlers[j];
          if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
            handlers.splice(j, 1);
            if (handleObj.selector) {
              handlers.delegateCount--;
            }
            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        }
        if (origCount && !handlers.length) {
          if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
            jQuery.removeEvent(elem, type, elemData.handle);
          }
          delete events[type];
        }
      }
      if (jQuery.isEmptyObject(events)) {
        dataPriv.remove(elem, "handle events");
      }
    },
    dispatch: function(nativeEvent) {
      var event = jQuery.event.fix(nativeEvent);
      var i,
          j,
          ret,
          matched,
          handleObj,
          handlerQueue,
          args = new Array(arguments.length),
          handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
          special = jQuery.event.special[event.type] || {};
      args[0] = event;
      for (i = 1; i < arguments.length; i++) {
        args[i] = arguments[i];
      }
      event.delegateTarget = this;
      if (special.preDispatch && special.preDispatch.call(this, event) === false) {
        return;
      }
      handlerQueue = jQuery.event.handlers.call(this, event, handlers);
      i = 0;
      while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
        event.currentTarget = matched.elem;
        j = 0;
        while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
          if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {
            event.handleObj = handleObj;
            event.data = handleObj.data;
            ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
            if (ret !== undefined) {
              if ((event.result = ret) === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }
      if (special.postDispatch) {
        special.postDispatch.call(this, event);
      }
      return event.result;
    },
    handlers: function(event, handlers) {
      var i,
          handleObj,
          sel,
          matchedHandlers,
          matchedSelectors,
          handlerQueue = [],
          delegateCount = handlers.delegateCount,
          cur = event.target;
      if (delegateCount && cur.nodeType && !(event.type === "click" && event.button >= 1)) {
        for (; cur !== this; cur = cur.parentNode || this) {
          if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
            matchedHandlers = [];
            matchedSelectors = {};
            for (i = 0; i < delegateCount; i++) {
              handleObj = handlers[i];
              sel = handleObj.selector + " ";
              if (matchedSelectors[sel] === undefined) {
                matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
              }
              if (matchedSelectors[sel]) {
                matchedHandlers.push(handleObj);
              }
            }
            if (matchedHandlers.length) {
              handlerQueue.push({
                elem: cur,
                handlers: matchedHandlers
              });
            }
          }
        }
      }
      cur = this;
      if (delegateCount < handlers.length) {
        handlerQueue.push({
          elem: cur,
          handlers: handlers.slice(delegateCount)
        });
      }
      return handlerQueue;
    },
    addProp: function(name, hook) {
      Object.defineProperty(jQuery.Event.prototype, name, {
        enumerable: true,
        configurable: true,
        get: jQuery.isFunction(hook) ? function() {
          if (this.originalEvent) {
            return hook(this.originalEvent);
          }
        } : function() {
          if (this.originalEvent) {
            return this.originalEvent[name];
          }
        },
        set: function(value) {
          Object.defineProperty(this, name, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
          });
        }
      });
    },
    fix: function(originalEvent) {
      return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
    },
    special: {
      load: {noBubble: true},
      focus: {
        trigger: function() {
          if (this !== safeActiveElement() && this.focus) {
            this.focus();
            return false;
          }
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function() {
          if (this === safeActiveElement() && this.blur) {
            this.blur();
            return false;
          }
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function() {
          if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
            this.click();
            return false;
          }
        },
        _default: function(event) {
          return jQuery.nodeName(event.target, "a");
        }
      },
      beforeunload: {postDispatch: function(event) {
          if (event.result !== undefined && event.originalEvent) {
            event.originalEvent.returnValue = event.result;
          }
        }}
    }
  };
  jQuery.removeEvent = function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle);
    }
  };
  jQuery.Event = function(src, props) {
    if (!(this instanceof jQuery.Event)) {
      return new jQuery.Event(src, props);
    }
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false ? returnTrue : returnFalse;
      this.target = (src.target && src.target.nodeType === 3) ? src.target.parentNode : src.target;
      this.currentTarget = src.currentTarget;
      this.relatedTarget = src.relatedTarget;
    } else {
      this.type = src;
    }
    if (props) {
      jQuery.extend(this, props);
    }
    this.timeStamp = src && src.timeStamp || jQuery.now();
    this[jQuery.expando] = true;
  };
  jQuery.Event.prototype = {
    constructor: jQuery.Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    isSimulated: false,
    preventDefault: function() {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;
      if (e && !this.isSimulated) {
        e.preventDefault();
      }
    },
    stopPropagation: function() {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue;
      if (e && !this.isSimulated) {
        e.stopPropagation();
      }
    },
    stopImmediatePropagation: function() {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = returnTrue;
      if (e && !this.isSimulated) {
        e.stopImmediatePropagation();
      }
      this.stopPropagation();
    }
  };
  jQuery.each({
    altKey: true,
    bubbles: true,
    cancelable: true,
    changedTouches: true,
    ctrlKey: true,
    detail: true,
    eventPhase: true,
    metaKey: true,
    pageX: true,
    pageY: true,
    shiftKey: true,
    view: true,
    "char": true,
    charCode: true,
    key: true,
    keyCode: true,
    button: true,
    buttons: true,
    clientX: true,
    clientY: true,
    offsetX: true,
    offsetY: true,
    pointerId: true,
    pointerType: true,
    screenX: true,
    screenY: true,
    targetTouches: true,
    toElement: true,
    touches: true,
    which: function(event) {
      var button = event.button;
      if (event.which == null && rkeyEvent.test(event.type)) {
        return event.charCode != null ? event.charCode : event.keyCode;
      }
      if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
        if (button & 1) {
          return 1;
        }
        if (button & 2) {
          return 3;
        }
        if (button & 4) {
          return 2;
        }
        return 0;
      }
      return event.which;
    }
  }, jQuery.event.addProp);
  jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType: fix,
      bindType: fix,
      handle: function(event) {
        var ret,
            target = this,
            related = event.relatedTarget,
            handleObj = event.handleObj;
        if (!related || (related !== target && !jQuery.contains(target, related))) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply(this, arguments);
          event.type = fix;
        }
        return ret;
      }
    };
  });
  jQuery.fn.extend({
    on: function(types, selector, data, fn) {
      return on(this, types, selector, data, fn);
    },
    one: function(types, selector, data, fn) {
      return on(this, types, selector, data, fn, 1);
    },
    off: function(types, selector, fn) {
      var handleObj,
          type;
      if (types && types.preventDefault && types.handleObj) {
        handleObj = types.handleObj;
        jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
        return this;
      }
      if (typeof types === "object") {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === "function") {
        fn = selector;
        selector = undefined;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    }
  });
  var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
      rnoInnerhtml = /<script|<style|<link/i,
      rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
      rscriptTypeMasked = /^true\/(.*)/,
      rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  function manipulationTarget(elem, content) {
    if (jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
      return elem.getElementsByTagName("tbody")[0] || elem;
    }
    return elem;
  }
  function disableScript(elem) {
    elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
    return elem;
  }
  function restoreScript(elem) {
    var match = rscriptTypeMasked.exec(elem.type);
    if (match) {
      elem.type = match[1];
    } else {
      elem.removeAttribute("type");
    }
    return elem;
  }
  function cloneCopyEvent(src, dest) {
    var i,
        l,
        type,
        pdataOld,
        pdataCur,
        udataOld,
        udataCur,
        events;
    if (dest.nodeType !== 1) {
      return;
    }
    if (dataPriv.hasData(src)) {
      pdataOld = dataPriv.access(src);
      pdataCur = dataPriv.set(dest, pdataOld);
      events = pdataOld.events;
      if (events) {
        delete pdataCur.handle;
        pdataCur.events = {};
        for (type in events) {
          for (i = 0, l = events[type].length; i < l; i++) {
            jQuery.event.add(dest, type, events[type][i]);
          }
        }
      }
    }
    if (dataUser.hasData(src)) {
      udataOld = dataUser.access(src);
      udataCur = jQuery.extend({}, udataOld);
      dataUser.set(dest, udataCur);
    }
  }
  function fixInput(src, dest) {
    var nodeName = dest.nodeName.toLowerCase();
    if (nodeName === "input" && rcheckableType.test(src.type)) {
      dest.checked = src.checked;
    } else if (nodeName === "input" || nodeName === "textarea") {
      dest.defaultValue = src.defaultValue;
    }
  }
  function domManip(collection, args, callback, ignored) {
    args = concat.apply([], args);
    var fragment,
        first,
        scripts,
        hasScripts,
        node,
        doc,
        i = 0,
        l = collection.length,
        iNoClone = l - 1,
        value = args[0],
        isFunction = jQuery.isFunction(value);
    if (isFunction || (l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value))) {
      return collection.each(function(index) {
        var self = collection.eq(index);
        if (isFunction) {
          args[0] = value.call(this, index, self.html());
        }
        domManip(self, args, callback, ignored);
      });
    }
    if (l) {
      fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
      first = fragment.firstChild;
      if (fragment.childNodes.length === 1) {
        fragment = first;
      }
      if (first || ignored) {
        scripts = jQuery.map(getAll(fragment, "script"), disableScript);
        hasScripts = scripts.length;
        for (; i < l; i++) {
          node = fragment;
          if (i !== iNoClone) {
            node = jQuery.clone(node, true, true);
            if (hasScripts) {
              jQuery.merge(scripts, getAll(node, "script"));
            }
          }
          callback.call(collection[i], node, i);
        }
        if (hasScripts) {
          doc = scripts[scripts.length - 1].ownerDocument;
          jQuery.map(scripts, restoreScript);
          for (i = 0; i < hasScripts; i++) {
            node = scripts[i];
            if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
              if (node.src) {
                if (jQuery._evalUrl) {
                  jQuery._evalUrl(node.src);
                }
              } else {
                DOMEval(node.textContent.replace(rcleanScript, ""), doc);
              }
            }
          }
        }
      }
    }
    return collection;
  }
  function remove(elem, selector, keepData) {
    var node,
        nodes = selector ? jQuery.filter(selector, elem) : elem,
        i = 0;
    for (; (node = nodes[i]) != null; i++) {
      if (!keepData && node.nodeType === 1) {
        jQuery.cleanData(getAll(node));
      }
      if (node.parentNode) {
        if (keepData && jQuery.contains(node.ownerDocument, node)) {
          setGlobalEval(getAll(node, "script"));
        }
        node.parentNode.removeChild(node);
      }
    }
    return elem;
  }
  jQuery.extend({
    htmlPrefilter: function(html) {
      return html.replace(rxhtmlTag, "<$1></$2>");
    },
    clone: function(elem, dataAndEvents, deepDataAndEvents) {
      var i,
          l,
          srcElements,
          destElements,
          clone = elem.cloneNode(true),
          inPage = jQuery.contains(elem.ownerDocument, elem);
      if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
        destElements = getAll(clone);
        srcElements = getAll(elem);
        for (i = 0, l = srcElements.length; i < l; i++) {
          fixInput(srcElements[i], destElements[i]);
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);
          for (i = 0, l = srcElements.length; i < l; i++) {
            cloneCopyEvent(srcElements[i], destElements[i]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      }
      destElements = getAll(clone, "script");
      if (destElements.length > 0) {
        setGlobalEval(destElements, !inPage && getAll(elem, "script"));
      }
      return clone;
    },
    cleanData: function(elems) {
      var data,
          elem,
          type,
          special = jQuery.event.special,
          i = 0;
      for (; (elem = elems[i]) !== undefined; i++) {
        if (acceptData(elem)) {
          if ((data = elem[dataPriv.expando])) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  jQuery.event.remove(elem, type);
                } else {
                  jQuery.removeEvent(elem, type, data.handle);
                }
              }
            }
            elem[dataPriv.expando] = undefined;
          }
          if (elem[dataUser.expando]) {
            elem[dataUser.expando] = undefined;
          }
        }
      }
    }
  });
  jQuery.fn.extend({
    detach: function(selector) {
      return remove(this, selector, true);
    },
    remove: function(selector) {
      return remove(this, selector);
    },
    text: function(value) {
      return access(this, function(value) {
        return value === undefined ? jQuery.text(this) : this.empty().each(function() {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            this.textContent = value;
          }
        });
      }, null, value, arguments.length);
    },
    append: function() {
      return domManip(this, arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    prepend: function() {
      return domManip(this, arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    before: function() {
      return domManip(this, arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    after: function() {
      return domManip(this, arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    empty: function() {
      var elem,
          i = 0;
      for (; (elem = this[i]) != null; i++) {
        if (elem.nodeType === 1) {
          jQuery.cleanData(getAll(elem, false));
          elem.textContent = "";
        }
      }
      return this;
    },
    clone: function(dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      return this.map(function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function(value) {
      return access(this, function(value) {
        var elem = this[0] || {},
            i = 0,
            l = this.length;
        if (value === undefined && elem.nodeType === 1) {
          return elem.innerHTML;
        }
        if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
          value = jQuery.htmlPrefilter(value);
          try {
            for (; i < l; i++) {
              elem = this[i] || {};
              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.innerHTML = value;
              }
            }
            elem = 0;
          } catch (e) {}
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    replaceWith: function() {
      var ignored = [];
      return domManip(this, arguments, function(elem) {
        var parent = this.parentNode;
        if (jQuery.inArray(this, ignored) < 0) {
          jQuery.cleanData(getAll(this));
          if (parent) {
            parent.replaceChild(elem, this);
          }
        }
      }, ignored);
    }
  });
  jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(name, original) {
    jQuery.fn[name] = function(selector) {
      var elems,
          ret = [],
          insert = jQuery(selector),
          last = insert.length - 1,
          i = 0;
      for (; i <= last; i++) {
        elems = i === last ? this : this.clone(true);
        jQuery(insert[i])[original](elems);
        push.apply(ret, elems.get());
      }
      return this.pushStack(ret);
    };
  });
  var rmargin = (/^margin/);
  var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
  var getStyles = function(elem) {
    var view = elem.ownerDocument.defaultView;
    if (!view || !view.opener) {
      view = window;
    }
    return view.getComputedStyle(elem);
  };
  (function() {
    function computeStyleTests() {
      if (!div) {
        return;
      }
      div.style.cssText = "box-sizing:border-box;" + "position:relative;display:block;" + "margin:auto;border:1px;padding:1px;" + "top:1%;width:50%";
      div.innerHTML = "";
      documentElement.appendChild(container);
      var divStyle = window.getComputedStyle(div);
      pixelPositionVal = divStyle.top !== "1%";
      reliableMarginLeftVal = divStyle.marginLeft === "2px";
      boxSizingReliableVal = divStyle.width === "4px";
      div.style.marginRight = "50%";
      pixelMarginRightVal = divStyle.marginRight === "4px";
      documentElement.removeChild(container);
      div = null;
    }
    var pixelPositionVal,
        boxSizingReliableVal,
        pixelMarginRightVal,
        reliableMarginLeftVal,
        container = document.createElement("div"),
        div = document.createElement("div");
    if (!div.style) {
      return;
    }
    div.style.backgroundClip = "content-box";
    div.cloneNode(true).style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";
    container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" + "padding:0;margin-top:1px;position:absolute";
    container.appendChild(div);
    jQuery.extend(support, {
      pixelPosition: function() {
        computeStyleTests();
        return pixelPositionVal;
      },
      boxSizingReliable: function() {
        computeStyleTests();
        return boxSizingReliableVal;
      },
      pixelMarginRight: function() {
        computeStyleTests();
        return pixelMarginRightVal;
      },
      reliableMarginLeft: function() {
        computeStyleTests();
        return reliableMarginLeftVal;
      }
    });
  })();
  function curCSS(elem, name, computed) {
    var width,
        minWidth,
        maxWidth,
        ret,
        style = elem.style;
    computed = computed || getStyles(elem);
    if (computed) {
      ret = computed.getPropertyValue(name) || computed[name];
      if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
        ret = jQuery.style(elem, name);
      }
      if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;
        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;
        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }
    return ret !== undefined ? ret + "" : ret;
  }
  function addGetHookIf(conditionFn, hookFn) {
    return {get: function() {
        if (conditionFn()) {
          delete this.get;
          return;
        }
        return (this.get = hookFn).apply(this, arguments);
      }};
  }
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
      cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
      },
      cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
      },
      cssPrefixes = ["Webkit", "Moz", "ms"],
      emptyStyle = document.createElement("div").style;
  function vendorPropName(name) {
    if (name in emptyStyle) {
      return name;
    }
    var capName = name[0].toUpperCase() + name.slice(1),
        i = cssPrefixes.length;
    while (i--) {
      name = cssPrefixes[i] + capName;
      if (name in emptyStyle) {
        return name;
      }
    }
  }
  function setPositiveNumber(elem, value, subtract) {
    var matches = rcssNum.exec(value);
    return matches ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
  }
  function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
    var i,
        val = 0;
    if (extra === (isBorderBox ? "border" : "content")) {
      i = 4;
    } else {
      i = name === "width" ? 1 : 0;
    }
    for (; i < 4; i += 2) {
      if (extra === "margin") {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if (extra === "content") {
          val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        }
        if (extra !== "margin") {
          val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      } else {
        val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        if (extra !== "padding") {
          val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      }
    }
    return val;
  }
  function getWidthOrHeight(elem, name, extra) {
    var val,
        valueIsBorderBox = true,
        styles = getStyles(elem),
        isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
    if (elem.getClientRects().length) {
      val = elem.getBoundingClientRect()[name];
    }
    if (val <= 0 || val == null) {
      val = curCSS(elem, name, styles);
      if (val < 0 || val == null) {
        val = elem.style[name];
      }
      if (rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
      val = parseFloat(val) || 0;
    }
    return (val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles)) + "px";
  }
  jQuery.extend({
    cssHooks: {opacity: {get: function(elem, computed) {
          if (computed) {
            var ret = curCSS(elem, "opacity");
            return ret === "" ? "1" : ret;
          }
        }}},
    cssNumber: {
      "animationIterationCount": true,
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    },
    cssProps: {"float": "cssFloat"},
    style: function(elem, name, value, extra) {
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }
      var ret,
          type,
          hooks,
          origName = jQuery.camelCase(name),
          style = elem.style;
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
      if (value !== undefined) {
        type = typeof value;
        if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
          value = adjustCSS(elem, name, ret);
          type = "number";
        }
        if (value == null || value !== value) {
          return;
        }
        if (type === "number") {
          value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
        }
        if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
          style[name] = "inherit";
        }
        if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
          style[name] = value;
        }
      } else {
        if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
          return ret;
        }
        return style[name];
      }
    },
    css: function(elem, name, extra, styles) {
      var val,
          num,
          hooks,
          origName = jQuery.camelCase(name);
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
      if (hooks && "get" in hooks) {
        val = hooks.get(elem, true, extra);
      }
      if (val === undefined) {
        val = curCSS(elem, name, styles);
      }
      if (val === "normal" && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      }
      if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || isFinite(num) ? num || 0 : val;
      }
      return val;
    }
  });
  jQuery.each(["height", "width"], function(i, name) {
    jQuery.cssHooks[name] = {
      get: function(elem, computed, extra) {
        if (computed) {
          return rdisplayswap.test(jQuery.css(elem, "display")) && (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
            return getWidthOrHeight(elem, name, extra);
          }) : getWidthOrHeight(elem, name, extra);
        }
      },
      set: function(elem, value, extra) {
        var matches,
            styles = extra && getStyles(elem),
            subtract = extra && augmentWidthOrHeight(elem, name, extra, jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles);
        if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
          elem.style[name] = value;
          value = jQuery.css(elem, name);
        }
        return setPositiveNumber(elem, value, subtract);
      }
    };
  });
  jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function(elem, computed) {
    if (computed) {
      return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, {marginLeft: 0}, function() {
        return elem.getBoundingClientRect().left;
      })) + "px";
    }
  });
  jQuery.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {expand: function(value) {
        var i = 0,
            expanded = {},
            parts = typeof value === "string" ? value.split(" ") : [value];
        for (; i < 4; i++) {
          expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
        }
        return expanded;
      }};
    if (!rmargin.test(prefix)) {
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  jQuery.fn.extend({css: function(name, value) {
      return access(this, function(elem, name, value) {
        var styles,
            len,
            map = {},
            i = 0;
        if (jQuery.isArray(name)) {
          styles = getStyles(elem);
          len = name.length;
          for (; i < len; i++) {
            map[name[i]] = jQuery.css(elem, name[i], false, styles);
          }
          return map;
        }
        return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
      }, name, value, arguments.length > 1);
    }});
  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }
  jQuery.Tween = Tween;
  Tween.prototype = {
    constructor: Tween,
    init: function(elem, options, prop, end, easing, unit) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || jQuery.easing._default;
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    cur: function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    run: function(percent) {
      var eased,
          hooks = Tween.propHooks[this.prop];
      if (this.options.duration) {
        this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
      } else {
        this.pos = eased = percent;
      }
      this.now = (this.end - this.start) * eased + this.start;
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }
      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }
      return this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {_default: {
      get: function(tween) {
        var result;
        if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
          return tween.elem[tween.prop];
        }
        result = jQuery.css(tween.elem, tween.prop, "");
        return !result || result === "auto" ? 0 : result;
      },
      set: function(tween) {
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else if (tween.elem.nodeType === 1 && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
          jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
        } else {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }};
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {set: function(tween) {
      if (tween.elem.nodeType && tween.elem.parentNode) {
        tween.elem[tween.prop] = tween.now;
      }
    }};
  jQuery.easing = {
    linear: function(p) {
      return p;
    },
    swing: function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    _default: "swing"
  };
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.step = {};
  var fxNow,
      timerId,
      rfxtypes = /^(?:toggle|show|hide)$/,
      rrun = /queueHooks$/;
  function raf() {
    if (timerId) {
      window.requestAnimationFrame(raf);
      jQuery.fx.tick();
    }
  }
  function createFxNow() {
    window.setTimeout(function() {
      fxNow = undefined;
    });
    return (fxNow = jQuery.now());
  }
  function genFx(type, includeWidth) {
    var which,
        i = 0,
        attrs = {height: type};
    includeWidth = includeWidth ? 1 : 0;
    for (; i < 4; i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }
    return attrs;
  }
  function createTween(value, prop, animation) {
    var tween,
        collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
        index = 0,
        length = collection.length;
    for (; index < length; index++) {
      if ((tween = collection[index].call(animation, prop, value))) {
        return tween;
      }
    }
  }
  function defaultPrefilter(elem, props, opts) {
    var prop,
        value,
        toggle,
        hooks,
        oldfire,
        propTween,
        restoreDisplay,
        display,
        isBox = "width" in props || "height" in props,
        anim = this,
        orig = {},
        style = elem.style,
        hidden = elem.nodeType && isHiddenWithinTree(elem),
        dataShow = dataPriv.get(elem, "fxshow");
    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, "fx");
      if (hooks.unqueued == null) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function() {
        anim.always(function() {
          hooks.unqueued--;
          if (!jQuery.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    for (prop in props) {
      value = props[prop];
      if (rfxtypes.test(value)) {
        delete props[prop];
        toggle = toggle || value === "toggle";
        if (value === (hidden ? "hide" : "show")) {
          if (value === "show" && dataShow && dataShow[prop] !== undefined) {
            hidden = true;
          } else {
            continue;
          }
        }
        orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      }
    }
    propTween = !jQuery.isEmptyObject(props);
    if (!propTween && jQuery.isEmptyObject(orig)) {
      return;
    }
    if (isBox && elem.nodeType === 1) {
      opts.overflow = [style.overflow, style.overflowX, style.overflowY];
      restoreDisplay = dataShow && dataShow.display;
      if (restoreDisplay == null) {
        restoreDisplay = dataPriv.get(elem, "display");
      }
      display = jQuery.css(elem, "display");
      if (display === "none") {
        if (restoreDisplay) {
          display = restoreDisplay;
        } else {
          showHide([elem], true);
          restoreDisplay = elem.style.display || restoreDisplay;
          display = jQuery.css(elem, "display");
          showHide([elem]);
        }
      }
      if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
        if (jQuery.css(elem, "float") === "none") {
          if (!propTween) {
            anim.done(function() {
              style.display = restoreDisplay;
            });
            if (restoreDisplay == null) {
              display = style.display;
              restoreDisplay = display === "none" ? "" : display;
            }
          }
          style.display = "inline-block";
        }
      }
    }
    if (opts.overflow) {
      style.overflow = "hidden";
      anim.always(function() {
        style.overflow = opts.overflow[0];
        style.overflowX = opts.overflow[1];
        style.overflowY = opts.overflow[2];
      });
    }
    propTween = false;
    for (prop in orig) {
      if (!propTween) {
        if (dataShow) {
          if ("hidden" in dataShow) {
            hidden = dataShow.hidden;
          }
        } else {
          dataShow = dataPriv.access(elem, "fxshow", {display: restoreDisplay});
        }
        if (toggle) {
          dataShow.hidden = !hidden;
        }
        if (hidden) {
          showHide([elem], true);
        }
        anim.done(function() {
          if (!hidden) {
            showHide([elem]);
          }
          dataPriv.remove(elem, "fxshow");
          for (prop in orig) {
            jQuery.style(elem, prop, orig[prop]);
          }
        });
      }
      propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
      if (!(prop in dataShow)) {
        dataShow[prop] = propTween.start;
        if (hidden) {
          propTween.end = propTween.start;
          propTween.start = 0;
        }
      }
    }
  }
  function propFilter(props, specialEasing) {
    var index,
        name,
        easing,
        value,
        hooks;
    for (index in props) {
      name = jQuery.camelCase(index);
      easing = specialEasing[name];
      value = props[index];
      if (jQuery.isArray(value)) {
        easing = value[1];
        value = props[index] = value[0];
      }
      if (index !== name) {
        props[name] = value;
        delete props[index];
      }
      hooks = jQuery.cssHooks[name];
      if (hooks && "expand" in hooks) {
        value = hooks.expand(value);
        delete props[name];
        for (index in value) {
          if (!(index in props)) {
            props[index] = value[index];
            specialEasing[index] = easing;
          }
        }
      } else {
        specialEasing[name] = easing;
      }
    }
  }
  function Animation(elem, properties, options) {
    var result,
        stopped,
        index = 0,
        length = Animation.prefilters.length,
        deferred = jQuery.Deferred().always(function() {
          delete tick.elem;
        }),
        tick = function() {
          if (stopped) {
            return false;
          }
          var currentTime = fxNow || createFxNow(),
              remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
              temp = remaining / animation.duration || 0,
              percent = 1 - temp,
              index = 0,
              length = animation.tweens.length;
          for (; index < length; index++) {
            animation.tweens[index].run(percent);
          }
          deferred.notifyWith(elem, [animation, percent, remaining]);
          if (percent < 1 && length) {
            return remaining;
          } else {
            deferred.resolveWith(elem, [animation]);
            return false;
          }
        },
        animation = deferred.promise({
          elem: elem,
          props: jQuery.extend({}, properties),
          opts: jQuery.extend(true, {
            specialEasing: {},
            easing: jQuery.easing._default
          }, options),
          originalProperties: properties,
          originalOptions: options,
          startTime: fxNow || createFxNow(),
          duration: options.duration,
          tweens: [],
          createTween: function(prop, end) {
            var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
            animation.tweens.push(tween);
            return tween;
          },
          stop: function(gotoEnd) {
            var index = 0,
                length = gotoEnd ? animation.tweens.length : 0;
            if (stopped) {
              return this;
            }
            stopped = true;
            for (; index < length; index++) {
              animation.tweens[index].run(1);
            }
            if (gotoEnd) {
              deferred.notifyWith(elem, [animation, 1, 0]);
              deferred.resolveWith(elem, [animation, gotoEnd]);
            } else {
              deferred.rejectWith(elem, [animation, gotoEnd]);
            }
            return this;
          }
        }),
        props = animation.props;
    propFilter(props, animation.opts.specialEasing);
    for (; index < length; index++) {
      result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
      if (result) {
        if (jQuery.isFunction(result.stop)) {
          jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(result.stop, result);
        }
        return result;
      }
    }
    jQuery.map(props, createTween, animation);
    if (jQuery.isFunction(animation.opts.start)) {
      animation.opts.start.call(elem, animation);
    }
    jQuery.fx.timer(jQuery.extend(tick, {
      elem: elem,
      anim: animation,
      queue: animation.opts.queue
    }));
    return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  jQuery.Animation = jQuery.extend(Animation, {
    tweeners: {"*": [function(prop, value) {
        var tween = this.createTween(prop, value);
        adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
        return tween;
      }]},
    tweener: function(props, callback) {
      if (jQuery.isFunction(props)) {
        callback = props;
        props = ["*"];
      } else {
        props = props.match(rnothtmlwhite);
      }
      var prop,
          index = 0,
          length = props.length;
      for (; index < length; index++) {
        prop = props[index];
        Animation.tweeners[prop] = Animation.tweeners[prop] || [];
        Animation.tweeners[prop].unshift(callback);
      }
    },
    prefilters: [defaultPrefilter],
    prefilter: function(callback, prepend) {
      if (prepend) {
        Animation.prefilters.unshift(callback);
      } else {
        Animation.prefilters.push(callback);
      }
    }
  });
  jQuery.speed = function(speed, easing, fn) {
    var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
      complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
      duration: speed,
      easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
    };
    if (jQuery.fx.off || document.hidden) {
      opt.duration = 0;
    } else {
      if (typeof opt.duration !== "number") {
        if (opt.duration in jQuery.fx.speeds) {
          opt.duration = jQuery.fx.speeds[opt.duration];
        } else {
          opt.duration = jQuery.fx.speeds._default;
        }
      }
    }
    if (opt.queue == null || opt.queue === true) {
      opt.queue = "fx";
    }
    opt.old = opt.complete;
    opt.complete = function() {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    };
    return opt;
  };
  jQuery.fn.extend({
    fadeTo: function(speed, to, easing, callback) {
      return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({opacity: to}, speed, easing, callback);
    },
    animate: function(prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop),
          optall = jQuery.speed(speed, easing, callback),
          doAnimation = function() {
            var anim = Animation(this, jQuery.extend({}, prop), optall);
            if (empty || dataPriv.get(this, "finish")) {
              anim.stop(true);
            }
          };
      doAnimation.finish = doAnimation;
      return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    stop: function(type, clearQueue, gotoEnd) {
      var stopQueue = function(hooks) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop(gotoEnd);
      };
      if (typeof type !== "string") {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if (clearQueue && type !== false) {
        this.queue(type || "fx", []);
      }
      return this.each(function() {
        var dequeue = true,
            index = type != null && type + "queueHooks",
            timers = jQuery.timers,
            data = dataPriv.get(this);
        if (index) {
          if (data[index] && data[index].stop) {
            stopQueue(data[index]);
          }
        } else {
          for (index in data) {
            if (data[index] && data[index].stop && rrun.test(index)) {
              stopQueue(data[index]);
            }
          }
        }
        for (index = timers.length; index--; ) {
          if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
            timers[index].anim.stop(gotoEnd);
            dequeue = false;
            timers.splice(index, 1);
          }
        }
        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    },
    finish: function(type) {
      if (type !== false) {
        type = type || "fx";
      }
      return this.each(function() {
        var index,
            data = dataPriv.get(this),
            queue = data[type + "queue"],
            hooks = data[type + "queueHooks"],
            timers = jQuery.timers,
            length = queue ? queue.length : 0;
        data.finish = true;
        jQuery.queue(this, type, []);
        if (hooks && hooks.stop) {
          hooks.stop.call(this, true);
        }
        for (index = timers.length; index--; ) {
          if (timers[index].elem === this && timers[index].queue === type) {
            timers[index].anim.stop(true);
            timers.splice(index, 1);
          }
        }
        for (index = 0; index < length; index++) {
          if (queue[index] && queue[index].finish) {
            queue[index].finish.call(this);
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery.each(["toggle", "show", "hide"], function(i, name) {
    var cssFn = jQuery.fn[name];
    jQuery.fn[name] = function(speed, easing, callback) {
      return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
    };
  });
  jQuery.each({
    slideDown: genFx("show"),
    slideUp: genFx("hide"),
    slideToggle: genFx("toggle"),
    fadeIn: {opacity: "show"},
    fadeOut: {opacity: "hide"},
    fadeToggle: {opacity: "toggle"}
  }, function(name, props) {
    jQuery.fn[name] = function(speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  });
  jQuery.timers = [];
  jQuery.fx.tick = function() {
    var timer,
        i = 0,
        timers = jQuery.timers;
    fxNow = jQuery.now();
    for (; i < timers.length; i++) {
      timer = timers[i];
      if (!timer() && timers[i] === timer) {
        timers.splice(i--, 1);
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    fxNow = undefined;
  };
  jQuery.fx.timer = function(timer) {
    jQuery.timers.push(timer);
    if (timer()) {
      jQuery.fx.start();
    } else {
      jQuery.timers.pop();
    }
  };
  jQuery.fx.interval = 13;
  jQuery.fx.start = function() {
    if (!timerId) {
      timerId = window.requestAnimationFrame ? window.requestAnimationFrame(raf) : window.setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  jQuery.fx.stop = function() {
    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(timerId);
    } else {
      window.clearInterval(timerId);
    }
    timerId = null;
  };
  jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  };
  jQuery.fn.delay = function(time, type) {
    time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
    type = type || "fx";
    return this.queue(type, function(next, hooks) {
      var timeout = window.setTimeout(next, time);
      hooks.stop = function() {
        window.clearTimeout(timeout);
      };
    });
  };
  (function() {
    var input = document.createElement("input"),
        select = document.createElement("select"),
        opt = select.appendChild(document.createElement("option"));
    input.type = "checkbox";
    support.checkOn = input.value !== "";
    support.optSelected = opt.selected;
    input = document.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";
  })();
  var boolHook,
      attrHandle = jQuery.expr.attrHandle;
  jQuery.fn.extend({
    attr: function(name, value) {
      return access(this, jQuery.attr, name, value, arguments.length > 1);
    },
    removeAttr: function(name) {
      return this.each(function() {
        jQuery.removeAttr(this, name);
      });
    }
  });
  jQuery.extend({
    attr: function(elem, name, value) {
      var ret,
          hooks,
          nType = elem.nodeType;
      if (nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (typeof elem.getAttribute === "undefined") {
        return jQuery.prop(elem, name, value);
      }
      if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
        hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
      }
      if (value !== undefined) {
        if (value === null) {
          jQuery.removeAttr(elem, name);
          return;
        }
        if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
          return ret;
        }
        elem.setAttribute(name, value + "");
        return value;
      }
      if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      }
      ret = jQuery.find.attr(elem, name);
      return ret == null ? undefined : ret;
    },
    attrHooks: {type: {set: function(elem, value) {
          if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
            var val = elem.value;
            elem.setAttribute("type", value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        }}},
    removeAttr: function(elem, value) {
      var name,
          i = 0,
          attrNames = value && value.match(rnothtmlwhite);
      if (attrNames && elem.nodeType === 1) {
        while ((name = attrNames[i++])) {
          elem.removeAttribute(name);
        }
      }
    }
  });
  boolHook = {set: function(elem, value, name) {
      if (value === false) {
        jQuery.removeAttr(elem, name);
      } else {
        elem.setAttribute(name, name);
      }
      return name;
    }};
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
    var getter = attrHandle[name] || jQuery.find.attr;
    attrHandle[name] = function(elem, name, isXML) {
      var ret,
          handle,
          lowercaseName = name.toLowerCase();
      if (!isXML) {
        handle = attrHandle[lowercaseName];
        attrHandle[lowercaseName] = ret;
        ret = getter(elem, name, isXML) != null ? lowercaseName : null;
        attrHandle[lowercaseName] = handle;
      }
      return ret;
    };
  });
  var rfocusable = /^(?:input|select|textarea|button)$/i,
      rclickable = /^(?:a|area)$/i;
  jQuery.fn.extend({
    prop: function(name, value) {
      return access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    removeProp: function(name) {
      return this.each(function() {
        delete this[jQuery.propFix[name] || name];
      });
    }
  });
  jQuery.extend({
    prop: function(elem, name, value) {
      var ret,
          hooks,
          nType = elem.nodeType;
      if (nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
        name = jQuery.propFix[name] || name;
        hooks = jQuery.propHooks[name];
      }
      if (value !== undefined) {
        if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
          return ret;
        }
        return (elem[name] = value);
      }
      if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      }
      return elem[name];
    },
    propHooks: {tabIndex: {get: function(elem) {
          var tabindex = jQuery.find.attr(elem, "tabindex");
          if (tabindex) {
            return parseInt(tabindex, 10);
          }
          if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
            return 0;
          }
          return -1;
        }}},
    propFix: {
      "for": "htmlFor",
      "class": "className"
    }
  });
  if (!support.optSelected) {
    jQuery.propHooks.selected = {
      get: function(elem) {
        var parent = elem.parentNode;
        if (parent && parent.parentNode) {
          parent.parentNode.selectedIndex;
        }
        return null;
      },
      set: function(elem) {
        var parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
      }
    };
  }
  jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    jQuery.propFix[this.toLowerCase()] = this;
  });
  function stripAndCollapse(value) {
    var tokens = value.match(rnothtmlwhite) || [];
    return tokens.join(" ");
  }
  function getClass(elem) {
    return elem.getAttribute && elem.getAttribute("class") || "";
  }
  jQuery.fn.extend({
    addClass: function(value) {
      var classes,
          elem,
          cur,
          curValue,
          clazz,
          j,
          finalValue,
          i = 0;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).addClass(value.call(this, j, getClass(this)));
        });
      }
      if (typeof value === "string" && value) {
        classes = value.match(rnothtmlwhite) || [];
        while ((elem = this[i++])) {
          curValue = getClass(elem);
          cur = elem.nodeType === 1 && (" " + stripAndCollapse(curValue) + " ");
          if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
              if (cur.indexOf(" " + clazz + " ") < 0) {
                cur += clazz + " ";
              }
            }
            finalValue = stripAndCollapse(cur);
            if (curValue !== finalValue) {
              elem.setAttribute("class", finalValue);
            }
          }
        }
      }
      return this;
    },
    removeClass: function(value) {
      var classes,
          elem,
          cur,
          curValue,
          clazz,
          j,
          finalValue,
          i = 0;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).removeClass(value.call(this, j, getClass(this)));
        });
      }
      if (!arguments.length) {
        return this.attr("class", "");
      }
      if (typeof value === "string" && value) {
        classes = value.match(rnothtmlwhite) || [];
        while ((elem = this[i++])) {
          curValue = getClass(elem);
          cur = elem.nodeType === 1 && (" " + stripAndCollapse(curValue) + " ");
          if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
              while (cur.indexOf(" " + clazz + " ") > -1) {
                cur = cur.replace(" " + clazz + " ", " ");
              }
            }
            finalValue = stripAndCollapse(cur);
            if (curValue !== finalValue) {
              elem.setAttribute("class", finalValue);
            }
          }
        }
      }
      return this;
    },
    toggleClass: function(value, stateVal) {
      var type = typeof value;
      if (typeof stateVal === "boolean" && type === "string") {
        return stateVal ? this.addClass(value) : this.removeClass(value);
      }
      if (jQuery.isFunction(value)) {
        return this.each(function(i) {
          jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
        });
      }
      return this.each(function() {
        var className,
            i,
            self,
            classNames;
        if (type === "string") {
          i = 0;
          self = jQuery(this);
          classNames = value.match(rnothtmlwhite) || [];
          while ((className = classNames[i++])) {
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }
        } else if (value === undefined || type === "boolean") {
          className = getClass(this);
          if (className) {
            dataPriv.set(this, "__className__", className);
          }
          if (this.setAttribute) {
            this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
          }
        }
      });
    },
    hasClass: function(selector) {
      var className,
          elem,
          i = 0;
      className = " " + selector + " ";
      while ((elem = this[i++])) {
        if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
          return true;
        }
      }
      return false;
    }
  });
  var rreturn = /\r/g;
  jQuery.fn.extend({val: function(value) {
      var hooks,
          ret,
          isFunction,
          elem = this[0];
      if (!arguments.length) {
        if (elem) {
          hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
          if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
            return ret;
          }
          ret = elem.value;
          if (typeof ret === "string") {
            return ret.replace(rreturn, "");
          }
          return ret == null ? "" : ret;
        }
        return;
      }
      isFunction = jQuery.isFunction(value);
      return this.each(function(i) {
        var val;
        if (this.nodeType !== 1) {
          return;
        }
        if (isFunction) {
          val = value.call(this, i, jQuery(this).val());
        } else {
          val = value;
        }
        if (val == null) {
          val = "";
        } else if (typeof val === "number") {
          val += "";
        } else if (jQuery.isArray(val)) {
          val = jQuery.map(val, function(value) {
            return value == null ? "" : value + "";
          });
        }
        hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
        if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
          this.value = val;
        }
      });
    }});
  jQuery.extend({valHooks: {
      option: {get: function(elem) {
          var val = jQuery.find.attr(elem, "value");
          return val != null ? val : stripAndCollapse(jQuery.text(elem));
        }},
      select: {
        get: function(elem) {
          var value,
              option,
              i,
              options = elem.options,
              index = elem.selectedIndex,
              one = elem.type === "select-one",
              values = one ? null : [],
              max = one ? index + 1 : options.length;
          if (index < 0) {
            i = max;
          } else {
            i = one ? index : 0;
          }
          for (; i < max; i++) {
            option = options[i];
            if ((option.selected || i === index) && !option.disabled && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
              value = jQuery(option).val();
              if (one) {
                return value;
              }
              values.push(value);
            }
          }
          return values;
        },
        set: function(elem, value) {
          var optionSet,
              option,
              options = elem.options,
              values = jQuery.makeArray(value),
              i = options.length;
          while (i--) {
            option = options[i];
            if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
              optionSet = true;
            }
          }
          if (!optionSet) {
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    }});
  jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {set: function(elem, value) {
        if (jQuery.isArray(value)) {
          return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1);
        }
      }};
    if (!support.checkOn) {
      jQuery.valHooks[this].get = function(elem) {
        return elem.getAttribute("value") === null ? "on" : elem.value;
      };
    }
  });
  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
  jQuery.extend(jQuery.event, {
    trigger: function(event, data, elem, onlyHandlers) {
      var i,
          cur,
          tmp,
          bubbleType,
          ontype,
          handle,
          special,
          eventPath = [elem || document],
          type = hasOwn.call(event, "type") ? event.type : event,
          namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      cur = tmp = elem = elem || document;
      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }
      if (rfocusMorph.test(type + jQuery.event.triggered)) {
        return;
      }
      if (type.indexOf(".") > -1) {
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces.sort();
      }
      ontype = type.indexOf(":") < 0 && "on" + type;
      event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
      event.isTrigger = onlyHandlers ? 2 : 3;
      event.namespace = namespaces.join(".");
      event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
      event.result = undefined;
      if (!event.target) {
        event.target = elem;
      }
      data = data == null ? [event] : jQuery.makeArray(data, [event]);
      special = jQuery.event.special[type] || {};
      if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
        return;
      }
      if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
        bubbleType = special.delegateType || type;
        if (!rfocusMorph.test(bubbleType + type)) {
          cur = cur.parentNode;
        }
        for (; cur; cur = cur.parentNode) {
          eventPath.push(cur);
          tmp = cur;
        }
        if (tmp === (elem.ownerDocument || document)) {
          eventPath.push(tmp.defaultView || tmp.parentWindow || window);
        }
      }
      i = 0;
      while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
        event.type = i > 1 ? bubbleType : special.bindType || type;
        handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
        if (handle) {
          handle.apply(cur, data);
        }
        handle = ontype && cur[ontype];
        if (handle && handle.apply && acceptData(cur)) {
          event.result = handle.apply(cur, data);
          if (event.result === false) {
            event.preventDefault();
          }
        }
      }
      event.type = type;
      if (!onlyHandlers && !event.isDefaultPrevented()) {
        if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
          if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {
            tmp = elem[ontype];
            if (tmp) {
              elem[ontype] = null;
            }
            jQuery.event.triggered = type;
            elem[type]();
            jQuery.event.triggered = undefined;
            if (tmp) {
              elem[ontype] = tmp;
            }
          }
        }
      }
      return event.result;
    },
    simulate: function(type, elem, event) {
      var e = jQuery.extend(new jQuery.Event(), event, {
        type: type,
        isSimulated: true
      });
      jQuery.event.trigger(e, null, elem);
    }
  });
  jQuery.fn.extend({
    trigger: function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler: function(type, data) {
      var elem = this[0];
      if (elem) {
        return jQuery.event.trigger(type, data, elem, true);
      }
    }
  });
  jQuery.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "), function(i, name) {
    jQuery.fn[name] = function(data, fn) {
      return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({hover: function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    }});
  support.focusin = "onfocusin" in window;
  if (!support.focusin) {
    jQuery.each({
      focus: "focusin",
      blur: "focusout"
    }, function(orig, fix) {
      var handler = function(event) {
        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
      };
      jQuery.event.special[fix] = {
        setup: function() {
          var doc = this.ownerDocument || this,
              attaches = dataPriv.access(doc, fix);
          if (!attaches) {
            doc.addEventListener(orig, handler, true);
          }
          dataPriv.access(doc, fix, (attaches || 0) + 1);
        },
        teardown: function() {
          var doc = this.ownerDocument || this,
              attaches = dataPriv.access(doc, fix) - 1;
          if (!attaches) {
            doc.removeEventListener(orig, handler, true);
            dataPriv.remove(doc, fix);
          } else {
            dataPriv.access(doc, fix, attaches);
          }
        }
      };
    });
  }
  var location = window.location;
  var nonce = jQuery.now();
  var rquery = (/\?/);
  jQuery.parseXML = function(data) {
    var xml;
    if (!data || typeof data !== "string") {
      return null;
    }
    try {
      xml = (new window.DOMParser()).parseFromString(data, "text/xml");
    } catch (e) {
      xml = undefined;
    }
    if (!xml || xml.getElementsByTagName("parsererror").length) {
      jQuery.error("Invalid XML: " + data);
    }
    return xml;
  };
  var rbracket = /\[\]$/,
      rCRLF = /\r?\n/g,
      rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
      rsubmittable = /^(?:input|select|textarea|keygen)/i;
  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (jQuery.isArray(obj)) {
      jQuery.each(obj, function(i, v) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, traditional, add);
        }
      });
    } else if (!traditional && jQuery.type(obj) === "object") {
      for (name in obj) {
        buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  jQuery.param = function(a, traditional) {
    var prefix,
        s = [],
        add = function(key, valueOrFunction) {
          var value = jQuery.isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };
    if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
      jQuery.each(a, function() {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return s.join("&");
  };
  jQuery.fn.extend({
    serialize: function() {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function() {
        var type = this.type;
        return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
      }).map(function(i, elem) {
        var val = jQuery(this).val();
        if (val == null) {
          return null;
        }
        if (jQuery.isArray(val)) {
          return jQuery.map(val, function(val) {
            return {
              name: elem.name,
              value: val.replace(rCRLF, "\r\n")
            };
          });
        }
        return {
          name: elem.name,
          value: val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  });
  var r20 = /%20/g,
      rhash = /#.*$/,
      rantiCache = /([?&])_=[^&]*/,
      rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
      rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      rnoContent = /^(?:GET|HEAD)$/,
      rprotocol = /^\/\//,
      prefilters = {},
      transports = {},
      allTypes = "*/".concat("*"),
      originAnchor = document.createElement("a");
  originAnchor.href = location.href;
  function addToPrefiltersOrTransports(structure) {
    return function(dataTypeExpression, func) {
      if (typeof dataTypeExpression !== "string") {
        func = dataTypeExpression;
        dataTypeExpression = "*";
      }
      var dataType,
          i = 0,
          dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
      if (jQuery.isFunction(func)) {
        while ((dataType = dataTypes[i++])) {
          if (dataType[0] === "+") {
            dataType = dataType.slice(1) || "*";
            (structure[dataType] = structure[dataType] || []).unshift(func);
          } else {
            (structure[dataType] = structure[dataType] || []).push(func);
          }
        }
      }
    };
  }
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    var inspected = {},
        seekingTransport = (structure === transports);
    function inspect(dataType) {
      var selected;
      inspected[dataType] = true;
      jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
        var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
        if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
          options.dataTypes.unshift(dataTypeOrTransport);
          inspect(dataTypeOrTransport);
          return false;
        } else if (seekingTransport) {
          return !(selected = dataTypeOrTransport);
        }
      });
      return selected;
    }
    return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
  }
  function ajaxExtend(target, src) {
    var key,
        deep,
        flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
      }
    }
    if (deep) {
      jQuery.extend(true, target, deep);
    }
    return target;
  }
  function ajaxHandleResponses(s, jqXHR, responses) {
    var ct,
        type,
        finalDataType,
        firstDataType,
        contents = s.contents,
        dataTypes = s.dataTypes;
    while (dataTypes[0] === "*") {
      dataTypes.shift();
      if (ct === undefined) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      finalDataType = finalDataType || firstDataType;
    }
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }
      return responses[finalDataType];
    }
  }
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2,
        current,
        conv,
        tmp,
        prev,
        converters = {},
        dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    while (current) {
      if (s.responseFields[current]) {
        jqXHR[s.responseFields[current]] = response;
      }
      if (!prev && isSuccess && s.dataFilter) {
        response = s.dataFilter(response, s.dataType);
      }
      prev = current;
      current = dataTypes.shift();
      if (current) {
        if (current === "*") {
          current = prev;
        } else if (prev !== "*" && prev !== current) {
          conv = converters[prev + " " + current] || converters["* " + current];
          if (!conv) {
            for (conv2 in converters) {
              tmp = conv2.split(" ");
              if (tmp[1] === current) {
                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                if (conv) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.unshift(tmp[1]);
                  }
                  break;
                }
              }
            }
          }
          if (conv !== true) {
            if (conv && s.throws) {
              response = conv(response);
            } else {
              try {
                response = conv(response);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: conv ? e : "No conversion from " + prev + " to " + current
                };
              }
            }
          }
        }
      }
    }
    return {
      state: "success",
      data: response
    };
  }
  jQuery.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: location.href,
      type: "GET",
      isLocal: rlocalProtocol.test(location.protocol),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /\bxml\b/,
        html: /\bhtml/,
        json: /\bjson\b/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": true,
        "text json": JSON.parse,
        "text xml": jQuery.parseXML
      },
      flatOptions: {
        url: true,
        context: true
      }
    },
    ajaxSetup: function(target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    ajax: function(url, options) {
      if (typeof url === "object") {
        options = url;
        url = undefined;
      }
      options = options || {};
      var transport,
          cacheURL,
          responseHeadersString,
          responseHeaders,
          timeoutTimer,
          urlAnchor,
          completed,
          fireGlobals,
          i,
          uncached,
          s = jQuery.ajaxSetup({}, options),
          callbackContext = s.context || s,
          globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,
          deferred = jQuery.Deferred(),
          completeDeferred = jQuery.Callbacks("once memory"),
          statusCode = s.statusCode || {},
          requestHeaders = {},
          requestHeadersNames = {},
          strAbort = "canceled",
          jqXHR = {
            readyState: 0,
            getResponseHeader: function(key) {
              var match;
              if (completed) {
                if (!responseHeaders) {
                  responseHeaders = {};
                  while ((match = rheaders.exec(responseHeadersString))) {
                    responseHeaders[match[1].toLowerCase()] = match[2];
                  }
                }
                match = responseHeaders[key.toLowerCase()];
              }
              return match == null ? null : match;
            },
            getAllResponseHeaders: function() {
              return completed ? responseHeadersString : null;
            },
            setRequestHeader: function(name, value) {
              if (completed == null) {
                name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                requestHeaders[name] = value;
              }
              return this;
            },
            overrideMimeType: function(type) {
              if (completed == null) {
                s.mimeType = type;
              }
              return this;
            },
            statusCode: function(map) {
              var code;
              if (map) {
                if (completed) {
                  jqXHR.always(map[jqXHR.status]);
                } else {
                  for (code in map) {
                    statusCode[code] = [statusCode[code], map[code]];
                  }
                }
              }
              return this;
            },
            abort: function(statusText) {
              var finalText = statusText || strAbort;
              if (transport) {
                transport.abort(finalText);
              }
              done(0, finalText);
              return this;
            }
          };
      deferred.promise(jqXHR);
      s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
      s.type = options.method || options.type || s.method || s.type;
      s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
      if (s.crossDomain == null) {
        urlAnchor = document.createElement("a");
        try {
          urlAnchor.href = s.url;
          urlAnchor.href = urlAnchor.href;
          s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
        } catch (e) {
          s.crossDomain = true;
        }
      }
      if (s.data && s.processData && typeof s.data !== "string") {
        s.data = jQuery.param(s.data, s.traditional);
      }
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
      if (completed) {
        return jqXHR;
      }
      fireGlobals = jQuery.event && s.global;
      if (fireGlobals && jQuery.active++ === 0) {
        jQuery.event.trigger("ajaxStart");
      }
      s.type = s.type.toUpperCase();
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url.replace(rhash, "");
      if (!s.hasContent) {
        uncached = s.url.slice(cacheURL.length);
        if (s.data) {
          cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          cacheURL = cacheURL.replace(rantiCache, "$1");
          uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + (nonce++) + uncached;
        }
        s.url = cacheURL + uncached;
      } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
        s.data = s.data.replace(r20, "+");
      }
      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      }
      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }
      jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {
        return jqXHR.abort();
      }
      strAbort = "abort";
      completeDeferred.add(s.complete);
      jqXHR.done(s.success);
      jqXHR.fail(s.error);
      transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
      if (!transport) {
        done(-1, "No Transport");
      } else {
        jqXHR.readyState = 1;
        if (fireGlobals) {
          globalEventContext.trigger("ajaxSend", [jqXHR, s]);
        }
        if (completed) {
          return jqXHR;
        }
        if (s.async && s.timeout > 0) {
          timeoutTimer = window.setTimeout(function() {
            jqXHR.abort("timeout");
          }, s.timeout);
        }
        try {
          completed = false;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (completed) {
            throw e;
          }
          done(-1, e);
        }
      }
      function done(status, nativeStatusText, responses, headers) {
        var isSuccess,
            success,
            error,
            response,
            modified,
            statusText = nativeStatusText;
        if (completed) {
          return;
        }
        completed = true;
        if (timeoutTimer) {
          window.clearTimeout(timeoutTimer);
        }
        transport = undefined;
        responseHeadersString = headers || "";
        jqXHR.readyState = status > 0 ? 4 : 0;
        isSuccess = status >= 200 && status < 300 || status === 304;
        if (responses) {
          response = ajaxHandleResponses(s, jqXHR, responses);
        }
        response = ajaxConvert(s, response, jqXHR, isSuccess);
        if (isSuccess) {
          if (s.ifModified) {
            modified = jqXHR.getResponseHeader("Last-Modified");
            if (modified) {
              jQuery.lastModified[cacheURL] = modified;
            }
            modified = jqXHR.getResponseHeader("etag");
            if (modified) {
              jQuery.etag[cacheURL] = modified;
            }
          }
          if (status === 204 || s.type === "HEAD") {
            statusText = "nocontent";
          } else if (status === 304) {
            statusText = "notmodified";
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          error = statusText;
          if (status || !statusText) {
            statusText = "error";
            if (status < 0) {
              status = 0;
            }
          }
        }
        jqXHR.status = status;
        jqXHR.statusText = (nativeStatusText || statusText) + "";
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
        } else {
          deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
        }
        jqXHR.statusCode(statusCode);
        statusCode = undefined;
        if (fireGlobals) {
          globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
        }
        completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
        if (fireGlobals) {
          globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
          if (!(--jQuery.active)) {
            jQuery.event.trigger("ajaxStop");
          }
        }
      }
      return jqXHR;
    },
    getJSON: function(url, data, callback) {
      return jQuery.get(url, data, callback, "json");
    },
    getScript: function(url, callback) {
      return jQuery.get(url, undefined, callback, "script");
    }
  });
  jQuery.each(["get", "post"], function(i, method) {
    jQuery[method] = function(url, data, callback, type) {
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }
      return jQuery.ajax(jQuery.extend({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback
      }, jQuery.isPlainObject(url) && url));
    };
  });
  jQuery._evalUrl = function(url) {
    return jQuery.ajax({
      url: url,
      type: "GET",
      dataType: "script",
      cache: true,
      async: false,
      global: false,
      "throws": true
    });
  };
  jQuery.fn.extend({
    wrapAll: function(html) {
      var wrap;
      if (this[0]) {
        if (jQuery.isFunction(html)) {
          html = html.call(this[0]);
        }
        wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function() {
          var elem = this;
          while (elem.firstElementChild) {
            elem = elem.firstElementChild;
          }
          return elem;
        }).append(this);
      }
      return this;
    },
    wrapInner: function(html) {
      if (jQuery.isFunction(html)) {
        return this.each(function(i) {
          jQuery(this).wrapInner(html.call(this, i));
        });
      }
      return this.each(function() {
        var self = jQuery(this),
            contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap: function(html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function(i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    unwrap: function(selector) {
      this.parent(selector).not("body").each(function() {
        jQuery(this).replaceWith(this.childNodes);
      });
      return this;
    }
  });
  jQuery.expr.pseudos.hidden = function(elem) {
    return !jQuery.expr.pseudos.visible(elem);
  };
  jQuery.expr.pseudos.visible = function(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  };
  jQuery.ajaxSettings.xhr = function() {
    try {
      return new window.XMLHttpRequest();
    } catch (e) {}
  };
  var xhrSuccessStatus = {
    0: 200,
    1223: 204
  },
      xhrSupported = jQuery.ajaxSettings.xhr();
  support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
  support.ajax = xhrSupported = !!xhrSupported;
  jQuery.ajaxTransport(function(options) {
    var callback,
        errorCallback;
    if (support.cors || xhrSupported && !options.crossDomain) {
      return {
        send: function(headers, complete) {
          var i,
              xhr = options.xhr();
          xhr.open(options.type, options.url, options.async, options.username, options.password);
          if (options.xhrFields) {
            for (i in options.xhrFields) {
              xhr[i] = options.xhrFields[i];
            }
          }
          if (options.mimeType && xhr.overrideMimeType) {
            xhr.overrideMimeType(options.mimeType);
          }
          if (!options.crossDomain && !headers["X-Requested-With"]) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          }
          for (i in headers) {
            xhr.setRequestHeader(i, headers[i]);
          }
          callback = function(type) {
            return function() {
              if (callback) {
                callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
                if (type === "abort") {
                  xhr.abort();
                } else if (type === "error") {
                  if (typeof xhr.status !== "number") {
                    complete(0, "error");
                  } else {
                    complete(xhr.status, xhr.statusText);
                  }
                } else {
                  complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? {binary: xhr.response} : {text: xhr.responseText}, xhr.getAllResponseHeaders());
                }
              }
            };
          };
          xhr.onload = callback();
          errorCallback = xhr.onerror = callback("error");
          if (xhr.onabort !== undefined) {
            xhr.onabort = errorCallback;
          } else {
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                window.setTimeout(function() {
                  if (callback) {
                    errorCallback();
                  }
                });
              }
            };
          }
          callback = callback("abort");
          try {
            xhr.send(options.hasContent && options.data || null);
          } catch (e) {
            if (callback) {
              throw e;
            }
          }
        },
        abort: function() {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  jQuery.ajaxPrefilter(function(s) {
    if (s.crossDomain) {
      s.contents.script = false;
    }
  });
  jQuery.ajaxSetup({
    accepts: {script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"},
    contents: {script: /\b(?:java|ecma)script\b/},
    converters: {"text script": function(text) {
        jQuery.globalEval(text);
        return text;
      }}
  });
  jQuery.ajaxPrefilter("script", function(s) {
    if (s.cache === undefined) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = "GET";
    }
  });
  jQuery.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script,
          callback;
      return {
        send: function(_, complete) {
          script = jQuery("<script>").prop({
            charset: s.scriptCharset,
            src: s.url
          }).on("load error", callback = function(evt) {
            script.remove();
            callback = null;
            if (evt) {
              complete(evt.type === "error" ? 404 : 200, evt.type);
            }
          });
          document.head.appendChild(script[0]);
        },
        abort: function() {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  var oldCallbacks = [],
      rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
      this[callback] = true;
      return callback;
    }
  });
  jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var callbackName,
        overwritten,
        responseContainer,
        jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
    if (jsonProp || s.dataTypes[0] === "jsonp") {
      callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
      if (jsonProp) {
        s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
      } else if (s.jsonp !== false) {
        s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
      }
      s.converters["script json"] = function() {
        if (!responseContainer) {
          jQuery.error(callbackName + " was not called");
        }
        return responseContainer[0];
      };
      s.dataTypes[0] = "json";
      overwritten = window[callbackName];
      window[callbackName] = function() {
        responseContainer = arguments;
      };
      jqXHR.always(function() {
        if (overwritten === undefined) {
          jQuery(window).removeProp(callbackName);
        } else {
          window[callbackName] = overwritten;
        }
        if (s[callbackName]) {
          s.jsonpCallback = originalSettings.jsonpCallback;
          oldCallbacks.push(callbackName);
        }
        if (responseContainer && jQuery.isFunction(overwritten)) {
          overwritten(responseContainer[0]);
        }
        responseContainer = overwritten = undefined;
      });
      return "script";
    }
  });
  support.createHTMLDocument = (function() {
    var body = document.implementation.createHTMLDocument("").body;
    body.innerHTML = "<form></form><form></form>";
    return body.childNodes.length === 2;
  })();
  jQuery.parseHTML = function(data, context, keepScripts) {
    if (typeof data !== "string") {
      return [];
    }
    if (typeof context === "boolean") {
      keepScripts = context;
      context = false;
    }
    var base,
        parsed,
        scripts;
    if (!context) {
      if (support.createHTMLDocument) {
        context = document.implementation.createHTMLDocument("");
        base = context.createElement("base");
        base.href = document.location.href;
        context.head.appendChild(base);
      } else {
        context = document;
      }
    }
    parsed = rsingleTag.exec(data);
    scripts = !keepScripts && [];
    if (parsed) {
      return [context.createElement(parsed[1])];
    }
    parsed = buildFragment([data], context, scripts);
    if (scripts && scripts.length) {
      jQuery(scripts).remove();
    }
    return jQuery.merge([], parsed.childNodes);
  };
  jQuery.fn.load = function(url, params, callback) {
    var selector,
        type,
        response,
        self = this,
        off = url.indexOf(" ");
    if (off > -1) {
      selector = stripAndCollapse(url.slice(off));
      url = url.slice(0, off);
    }
    if (jQuery.isFunction(params)) {
      callback = params;
      params = undefined;
    } else if (params && typeof params === "object") {
      type = "POST";
    }
    if (self.length > 0) {
      jQuery.ajax({
        url: url,
        type: type || "GET",
        dataType: "html",
        data: params
      }).done(function(responseText) {
        response = arguments;
        self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
      }).always(callback && function(jqXHR, status) {
        self.each(function() {
          callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
        });
      });
    }
    return this;
  };
  jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(i, type) {
    jQuery.fn[type] = function(fn) {
      return this.on(type, fn);
    };
  });
  jQuery.expr.pseudos.animated = function(elem) {
    return jQuery.grep(jQuery.timers, function(fn) {
      return elem === fn.elem;
    }).length;
  };
  function getWindow(elem) {
    return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  }
  jQuery.offset = {setOffset: function(elem, options, i) {
      var curPosition,
          curLeft,
          curCSSTop,
          curTop,
          curOffset,
          curCSSLeft,
          calculatePosition,
          position = jQuery.css(elem, "position"),
          curElem = jQuery(elem),
          props = {};
      if (position === "static") {
        elem.style.position = "relative";
      }
      curOffset = curElem.offset();
      curCSSTop = jQuery.css(elem, "top");
      curCSSLeft = jQuery.css(elem, "left");
      calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, jQuery.extend({}, curOffset));
      }
      if (options.top != null) {
        props.top = (options.top - curOffset.top) + curTop;
      }
      if (options.left != null) {
        props.left = (options.left - curOffset.left) + curLeft;
      }
      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }};
  jQuery.fn.extend({
    offset: function(options) {
      if (arguments.length) {
        return options === undefined ? this : this.each(function(i) {
          jQuery.offset.setOffset(this, options, i);
        });
      }
      var docElem,
          win,
          rect,
          doc,
          elem = this[0];
      if (!elem) {
        return;
      }
      if (!elem.getClientRects().length) {
        return {
          top: 0,
          left: 0
        };
      }
      rect = elem.getBoundingClientRect();
      if (rect.width || rect.height) {
        doc = elem.ownerDocument;
        win = getWindow(doc);
        docElem = doc.documentElement;
        return {
          top: rect.top + win.pageYOffset - docElem.clientTop,
          left: rect.left + win.pageXOffset - docElem.clientLeft
        };
      }
      return rect;
    },
    position: function() {
      if (!this[0]) {
        return;
      }
      var offsetParent,
          offset,
          elem = this[0],
          parentOffset = {
            top: 0,
            left: 0
          };
      if (jQuery.css(elem, "position") === "fixed") {
        offset = elem.getBoundingClientRect();
      } else {
        offsetParent = this.offsetParent();
        offset = this.offset();
        if (!jQuery.nodeName(offsetParent[0], "html")) {
          parentOffset = offsetParent.offset();
        }
        parentOffset = {
          top: parentOffset.top + jQuery.css(offsetParent[0], "borderTopWidth", true),
          left: parentOffset.left + jQuery.css(offsetParent[0], "borderLeftWidth", true)
        };
      }
      return {
        top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
        left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
      };
    },
    offsetParent: function() {
      return this.map(function() {
        var offsetParent = this.offsetParent;
        while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || documentElement;
      });
    }
  });
  jQuery.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function(method, prop) {
    var top = "pageYOffset" === prop;
    jQuery.fn[method] = function(val) {
      return access(this, function(elem, method, val) {
        var win = getWindow(elem);
        if (val === undefined) {
          return win ? win[prop] : elem[method];
        }
        if (win) {
          win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
        } else {
          elem[method] = val;
        }
      }, method, val, arguments.length);
    };
  });
  jQuery.each(["top", "left"], function(i, prop) {
    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
      if (computed) {
        computed = curCSS(elem, prop);
        return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
      }
    });
  });
  jQuery.each({
    Height: "height",
    Width: "width"
  }, function(name, type) {
    jQuery.each({
      padding: "inner" + name,
      content: type,
      "": "outer" + name
    }, function(defaultExtra, funcName) {
      jQuery.fn[funcName] = function(margin, value) {
        var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
            extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
        return access(this, function(elem, type, value) {
          var doc;
          if (jQuery.isWindow(elem)) {
            return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
          }
          if (elem.nodeType === 9) {
            doc = elem.documentElement;
            return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
          }
          return value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
        }, type, chainable ? margin : undefined, chainable);
      };
    });
  });
  jQuery.fn.extend({
    bind: function(types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function(types, fn) {
      return this.off(types, null, fn);
    },
    delegate: function(selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function(selector, types, fn) {
      return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    }
  });
  jQuery.parseJSON = JSON.parse;
  if (typeof define === "function" && define.amd) {
    define("npm:jquery@3.1.1/dist/jquery.js", [], function() {
      return jQuery;
    }) && define("jquery", ["npm:jquery@3.1.1/dist/jquery.js"], function(m) {
      return m;
    });
  }
  var _jQuery = window.jQuery,
      _$ = window.$;
  jQuery.noConflict = function(deep) {
    if (window.$ === jQuery) {
      window.$ = _$;
    }
    if (deep && window.jQuery === jQuery) {
      window.jQuery = _jQuery;
    }
    return jQuery;
  };
  if (!noGlobal) {
    window.jQuery = window.$ = jQuery;
  }
  return jQuery;
});

})();
(function() {
var define = System.amdDefine;
define("npm:jquery@3.1.1.js", ["npm:jquery@3.1.1/dist/jquery.js"], function(main) {
  return main;
});

})();
System.registerDynamic('npm:semantic-ui-transition@2.2.3/index.js', ['npm:jquery@3.1.1.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /*!
   * # Semantic UI 2.2.3 - Transition
   * http://github.com/semantic-org/semantic-ui/
   *
   *
   * Released under the MIT license
   * http://opensource.org/licenses/MIT
   *
   */

  ;(function ($, window, document, undefined) {

    "use strict";

    window = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();

    var _module = module;
    module.exports = function () {
      var $allModules = $(this),
          moduleSelector = $allModules.selector || '',
          time = new Date().getTime(),
          performance = [],
          moduleArguments = arguments,
          query = moduleArguments[0],
          queryArguments = [].slice.call(arguments, 1),
          methodInvoked = typeof query === 'string',
          requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        setTimeout(callback, 0);
      },
          returnedValue;
      $allModules.each(function (index) {
        var $module = $(this),
            element = this,


        // set at run time
        settings,
            instance,
            error,
            className,
            metadata,
            animationEnd,
            animationName,
            namespace,
            moduleNamespace,
            eventNamespace,
            module;

        module = {

          initialize: function () {

            // get full settings
            settings = module.get.settings.apply(element, moduleArguments);

            // shorthand
            className = settings.className;
            error = settings.error;
            metadata = settings.metadata;

            // define namespace
            eventNamespace = '.' + settings.namespace;
            moduleNamespace = 'module-' + settings.namespace;
            instance = $module.data(moduleNamespace) || module;

            // get vendor specific events
            animationEnd = module.get.animationEndEvent();

            if (methodInvoked) {
              methodInvoked = module.invoke(query);
            }

            // method not invoked, lets run an animation
            if (methodInvoked === false) {
              module.verbose('Converted arguments into settings object', settings);
              if (settings.interval) {
                module.delay(settings.animate);
              } else {
                module.animate();
              }
              module.instantiate();
            }
          },

          instantiate: function () {
            module.verbose('Storing instance of module', module);
            instance = module;
            $module.data(moduleNamespace, instance);
          },

          destroy: function () {
            module.verbose('Destroying previous module for', element);
            $module.removeData(moduleNamespace);
          },

          refresh: function () {
            module.verbose('Refreshing display type on next animation');
            delete module.displayType;
          },

          forceRepaint: function () {
            module.verbose('Forcing element repaint');
            var $parentElement = $module.parent(),
                $nextElement = $module.next();
            if ($nextElement.length === 0) {
              $module.detach().appendTo($parentElement);
            } else {
              $module.detach().insertBefore($nextElement);
            }
          },

          repaint: function () {
            module.verbose('Repainting element');
            var fakeAssignment = element.offsetWidth;
          },

          delay: function (interval) {
            var direction = module.get.animationDirection(),
                shouldReverse,
                delay;
            if (!direction) {
              direction = module.can.transition() ? module.get.direction() : 'static';
            }
            interval = interval !== undefined ? interval : settings.interval;
            shouldReverse = settings.reverse == 'auto' && direction == className.outward;
            delay = shouldReverse || settings.reverse == true ? ($allModules.length - index) * settings.interval : index * settings.interval;
            module.debug('Delaying animation by', delay);
            setTimeout(module.animate, delay);
          },

          animate: function (overrideSettings) {
            settings = overrideSettings || settings;
            if (!module.is.supported()) {
              module.error(error.support);
              return false;
            }
            module.debug('Preparing animation', settings.animation);
            if (module.is.animating()) {
              if (settings.queue) {
                if (!settings.allowRepeats && module.has.direction() && module.is.occurring() && module.queuing !== true) {
                  module.debug('Animation is currently occurring, preventing queueing same animation', settings.animation);
                } else {
                  module.queue(settings.animation);
                }
                return false;
              } else if (!settings.allowRepeats && module.is.occurring()) {
                module.debug('Animation is already occurring, will not execute repeated animation', settings.animation);
                return false;
              } else {
                module.debug('New animation started, completing previous early', settings.animation);
                instance.complete();
              }
            }
            if (module.can.animate()) {
              module.set.animating(settings.animation);
            } else {
              module.error(error.noAnimation, settings.animation, element);
            }
          },

          reset: function () {
            module.debug('Resetting animation to beginning conditions');
            module.remove.animationCallbacks();
            module.restore.conditions();
            module.remove.animating();
          },

          queue: function (animation) {
            module.debug('Queueing animation of', animation);
            module.queuing = true;
            $module.one(animationEnd + '.queue' + eventNamespace, function () {
              module.queuing = false;
              module.repaint();
              module.animate.apply(this, settings);
            });
          },

          complete: function (event) {
            module.debug('Animation complete', settings.animation);
            module.remove.completeCallback();
            module.remove.failSafe();
            if (!module.is.looping()) {
              if (module.is.outward()) {
                module.verbose('Animation is outward, hiding element');
                module.restore.conditions();
                module.hide();
              } else if (module.is.inward()) {
                module.verbose('Animation is outward, showing element');
                module.restore.conditions();
                module.show();
              } else {
                module.verbose('Static animation completed');
                module.restore.conditions();
                settings.onComplete.call(element);
              }
            }
          },

          force: {
            visible: function () {
              var style = $module.attr('style'),
                  userStyle = module.get.userStyle(),
                  displayType = module.get.displayType(),
                  overrideStyle = userStyle + 'display: ' + displayType + ' !important;',
                  currentDisplay = $module.css('display'),
                  emptyStyle = style === undefined || style === '';
              if (currentDisplay !== displayType) {
                module.verbose('Overriding default display to show element', displayType);
                $module.attr('style', overrideStyle);
              } else if (emptyStyle) {
                $module.removeAttr('style');
              }
            },
            hidden: function () {
              var style = $module.attr('style'),
                  currentDisplay = $module.css('display'),
                  emptyStyle = style === undefined || style === '';
              if (currentDisplay !== 'none' && !module.is.hidden()) {
                module.verbose('Overriding default display to hide element');
                $module.css('display', 'none');
              } else if (emptyStyle) {
                $module.removeAttr('style');
              }
            }
          },

          has: {
            direction: function (animation) {
              var hasDirection = false;
              animation = animation || settings.animation;
              if (typeof animation === 'string') {
                animation = animation.split(' ');
                $.each(animation, function (index, word) {
                  if (word === className.inward || word === className.outward) {
                    hasDirection = true;
                  }
                });
              }
              return hasDirection;
            },
            inlineDisplay: function () {
              var style = $module.attr('style') || '';
              return $.isArray(style.match(/display.*?;/, ''));
            }
          },

          set: {
            animating: function (animation) {
              var animationClass, direction;
              // remove previous callbacks
              module.remove.completeCallback();

              // determine exact animation
              animation = animation || settings.animation;
              animationClass = module.get.animationClass(animation);

              // save animation class in cache to restore class names
              module.save.animation(animationClass);

              // override display if necessary so animation appears visibly
              module.force.visible();

              module.remove.hidden();
              module.remove.direction();

              module.start.animation(animationClass);
            },
            duration: function (animationName, duration) {
              duration = duration || settings.duration;
              duration = typeof duration == 'number' ? duration + 'ms' : duration;
              if (duration || duration === 0) {
                module.verbose('Setting animation duration', duration);
                $module.css({
                  'animation-duration': duration
                });
              }
            },
            direction: function (direction) {
              direction = direction || module.get.direction();
              if (direction == className.inward) {
                module.set.inward();
              } else {
                module.set.outward();
              }
            },
            looping: function () {
              module.debug('Transition set to loop');
              $module.addClass(className.looping);
            },
            hidden: function () {
              $module.addClass(className.transition).addClass(className.hidden);
            },
            inward: function () {
              module.debug('Setting direction to inward');
              $module.removeClass(className.outward).addClass(className.inward);
            },
            outward: function () {
              module.debug('Setting direction to outward');
              $module.removeClass(className.inward).addClass(className.outward);
            },
            visible: function () {
              $module.addClass(className.transition).addClass(className.visible);
            }
          },

          start: {
            animation: function (animationClass) {
              animationClass = animationClass || module.get.animationClass();
              module.debug('Starting tween', animationClass);
              $module.addClass(animationClass).one(animationEnd + '.complete' + eventNamespace, module.complete);
              if (settings.useFailSafe) {
                module.add.failSafe();
              }
              module.set.duration(settings.duration);
              settings.onStart.call(element);
            }
          },

          save: {
            animation: function (animation) {
              if (!module.cache) {
                module.cache = {};
              }
              module.cache.animation = animation;
            },
            displayType: function (displayType) {
              if (displayType !== 'none') {
                $module.data(metadata.displayType, displayType);
              }
            },
            transitionExists: function (animation, exists) {
              _module.exports.exists[animation] = exists;
              module.verbose('Saving existence of transition', animation, exists);
            }
          },

          restore: {
            conditions: function () {
              var animation = module.get.currentAnimation();
              if (animation) {
                $module.removeClass(animation);
                module.verbose('Removing animation class', module.cache);
              }
              module.remove.duration();
            }
          },

          add: {
            failSafe: function () {
              var duration = module.get.duration();
              module.timer = setTimeout(function () {
                $module.triggerHandler(animationEnd);
              }, duration + settings.failSafeDelay);
              module.verbose('Adding fail safe timer', module.timer);
            }
          },

          remove: {
            animating: function () {
              $module.removeClass(className.animating);
            },
            animationCallbacks: function () {
              module.remove.queueCallback();
              module.remove.completeCallback();
            },
            queueCallback: function () {
              $module.off('.queue' + eventNamespace);
            },
            completeCallback: function () {
              $module.off('.complete' + eventNamespace);
            },
            display: function () {
              $module.css('display', '');
            },
            direction: function () {
              $module.removeClass(className.inward).removeClass(className.outward);
            },
            duration: function () {
              $module.css('animation-duration', '');
            },
            failSafe: function () {
              module.verbose('Removing fail safe timer', module.timer);
              if (module.timer) {
                clearTimeout(module.timer);
              }
            },
            hidden: function () {
              $module.removeClass(className.hidden);
            },
            visible: function () {
              $module.removeClass(className.visible);
            },
            looping: function () {
              module.debug('Transitions are no longer looping');
              if (module.is.looping()) {
                module.reset();
                $module.removeClass(className.looping);
              }
            },
            transition: function () {
              $module.removeClass(className.visible).removeClass(className.hidden);
            }
          },
          get: {
            settings: function (animation, duration, onComplete) {
              // single settings object
              if (typeof animation == 'object') {
                return $.extend(true, {}, _module.exports.settings, animation);
              }
              // all arguments provided
              else if (typeof onComplete == 'function') {
                  return $.extend({}, _module.exports.settings, {
                    animation: animation,
                    onComplete: onComplete,
                    duration: duration
                  });
                }
                // only duration provided
                else if (typeof duration == 'string' || typeof duration == 'number') {
                    return $.extend({}, _module.exports.settings, {
                      animation: animation,
                      duration: duration
                    });
                  }
                  // duration is actually settings object
                  else if (typeof duration == 'object') {
                      return $.extend({}, _module.exports.settings, duration, {
                        animation: animation
                      });
                    }
                    // duration is actually callback
                    else if (typeof duration == 'function') {
                        return $.extend({}, _module.exports.settings, {
                          animation: animation,
                          onComplete: duration
                        });
                      }
                      // only animation provided
                      else {
                          return $.extend({}, _module.exports.settings, {
                            animation: animation
                          });
                        }
            },
            animationClass: function (animation) {
              var animationClass = animation || settings.animation,
                  directionClass = module.can.transition() && !module.has.direction() ? module.get.direction() + ' ' : '';
              return className.animating + ' ' + className.transition + ' ' + directionClass + animationClass;
            },
            currentAnimation: function () {
              return module.cache && module.cache.animation !== undefined ? module.cache.animation : false;
            },
            currentDirection: function () {
              return module.is.inward() ? className.inward : className.outward;
            },
            direction: function () {
              return module.is.hidden() || !module.is.visible() ? className.inward : className.outward;
            },
            animationDirection: function (animation) {
              var direction;
              animation = animation || settings.animation;
              if (typeof animation === 'string') {
                animation = animation.split(' ');
                // search animation name for out/in class
                $.each(animation, function (index, word) {
                  if (word === className.inward) {
                    direction = className.inward;
                  } else if (word === className.outward) {
                    direction = className.outward;
                  }
                });
              }
              // return found direction
              if (direction) {
                return direction;
              }
              return false;
            },
            duration: function (duration) {
              duration = duration || settings.duration;
              if (duration === false) {
                duration = $module.css('animation-duration') || 0;
              }
              return typeof duration === 'string' ? duration.indexOf('ms') > -1 ? parseFloat(duration) : parseFloat(duration) * 1000 : duration;
            },
            displayType: function () {
              if (settings.displayType) {
                return settings.displayType;
              }
              if ($module.data(metadata.displayType) === undefined) {
                // create fake element to determine display state
                module.can.transition(true);
              }
              return $module.data(metadata.displayType);
            },
            userStyle: function (style) {
              style = style || $module.attr('style') || '';
              return style.replace(/display.*?;/, '');
            },
            transitionExists: function (animation) {
              return _module.exports.exists[animation];
            },
            animationStartEvent: function () {
              var element = document.createElement('div'),
                  animations = {
                'animation': 'animationstart',
                'OAnimation': 'oAnimationStart',
                'MozAnimation': 'mozAnimationStart',
                'WebkitAnimation': 'webkitAnimationStart'
              },
                  animation;
              for (animation in animations) {
                if (element.style[animation] !== undefined) {
                  return animations[animation];
                }
              }
              return false;
            },
            animationEndEvent: function () {
              var element = document.createElement('div'),
                  animations = {
                'animation': 'animationend',
                'OAnimation': 'oAnimationEnd',
                'MozAnimation': 'mozAnimationEnd',
                'WebkitAnimation': 'webkitAnimationEnd'
              },
                  animation;
              for (animation in animations) {
                if (element.style[animation] !== undefined) {
                  return animations[animation];
                }
              }
              return false;
            }

          },

          can: {
            transition: function (forced) {
              var animation = settings.animation,
                  transitionExists = module.get.transitionExists(animation),
                  elementClass,
                  tagName,
                  $clone,
                  currentAnimation,
                  inAnimation,
                  directionExists,
                  displayType;
              if (transitionExists === undefined || forced) {
                module.verbose('Determining whether animation exists');
                elementClass = $module.attr('class');
                tagName = $module.prop('tagName');

                $clone = $('<' + tagName + ' />').addClass(elementClass).insertAfter($module);
                currentAnimation = $clone.addClass(animation).removeClass(className.inward).removeClass(className.outward).addClass(className.animating).addClass(className.transition).css('animationName');
                inAnimation = $clone.addClass(className.inward).css('animationName');
                displayType = $clone.attr('class', elementClass).removeAttr('style').removeClass(className.hidden).removeClass(className.visible).show().css('display');
                module.verbose('Determining final display state', displayType);
                module.save.displayType(displayType);

                $clone.remove();
                if (currentAnimation != inAnimation) {
                  module.debug('Direction exists for animation', animation);
                  directionExists = true;
                } else if (currentAnimation == 'none' || !currentAnimation) {
                  module.debug('No animation defined in css', animation);
                  return;
                } else {
                  module.debug('Static animation found', animation, displayType);
                  directionExists = false;
                }
                module.save.transitionExists(animation, directionExists);
              }
              return transitionExists !== undefined ? transitionExists : directionExists;
            },
            animate: function () {
              // can transition does not return a value if animation does not exist
              return module.can.transition() !== undefined;
            }
          },

          is: {
            animating: function () {
              return $module.hasClass(className.animating);
            },
            inward: function () {
              return $module.hasClass(className.inward);
            },
            outward: function () {
              return $module.hasClass(className.outward);
            },
            looping: function () {
              return $module.hasClass(className.looping);
            },
            occurring: function (animation) {
              animation = animation || settings.animation;
              animation = '.' + animation.replace(' ', '.');
              return $module.filter(animation).length > 0;
            },
            visible: function () {
              return $module.is(':visible');
            },
            hidden: function () {
              return $module.css('visibility') === 'hidden';
            },
            supported: function () {
              return animationEnd !== false;
            }
          },

          hide: function () {
            module.verbose('Hiding element');
            if (module.is.animating()) {
              module.reset();
            }
            element.blur(); // IE will trigger focus change if element is not blurred before hiding
            module.remove.display();
            module.remove.visible();
            module.set.hidden();
            module.force.hidden();
            settings.onHide.call(element);
            settings.onComplete.call(element);
            // module.repaint();
          },

          show: function (display) {
            module.verbose('Showing element', display);
            module.remove.hidden();
            module.set.visible();
            module.force.visible();
            settings.onShow.call(element);
            settings.onComplete.call(element);
            // module.repaint();
          },

          toggle: function () {
            if (module.is.visible()) {
              module.hide();
            } else {
              module.show();
            }
          },

          stop: function () {
            module.debug('Stopping current animation');
            $module.triggerHandler(animationEnd);
          },

          stopAll: function () {
            module.debug('Stopping all animation');
            module.remove.queueCallback();
            $module.triggerHandler(animationEnd);
          },

          clear: {
            queue: function () {
              module.debug('Clearing animation queue');
              module.remove.queueCallback();
            }
          },

          enable: function () {
            module.verbose('Starting animation');
            $module.removeClass(className.disabled);
          },

          disable: function () {
            module.debug('Stopping animation');
            $module.addClass(className.disabled);
          },

          setting: function (name, value) {
            module.debug('Changing setting', name, value);
            if ($.isPlainObject(name)) {
              $.extend(true, settings, name);
            } else if (value !== undefined) {
              if ($.isPlainObject(settings[name])) {
                $.extend(true, settings[name], value);
              } else {
                settings[name] = value;
              }
            } else {
              return settings[name];
            }
          },
          internal: function (name, value) {
            if ($.isPlainObject(name)) {
              $.extend(true, module, name);
            } else if (value !== undefined) {
              module[name] = value;
            } else {
              return module[name];
            }
          },
          debug: function () {
            if (!settings.silent && settings.debug) {
              if (settings.performance) {
                module.performance.log(arguments);
              } else {
                module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
                module.debug.apply(console, arguments);
              }
            }
          },
          verbose: function () {
            if (!settings.silent && settings.verbose && settings.debug) {
              if (settings.performance) {
                module.performance.log(arguments);
              } else {
                module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
                module.verbose.apply(console, arguments);
              }
            }
          },
          error: function () {
            if (!settings.silent) {
              module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
              module.error.apply(console, arguments);
            }
          },
          performance: {
            log: function (message) {
              var currentTime, executionTime, previousTime;
              if (settings.performance) {
                currentTime = new Date().getTime();
                previousTime = time || currentTime;
                executionTime = currentTime - previousTime;
                time = currentTime;
                performance.push({
                  'Name': message[0],
                  'Arguments': [].slice.call(message, 1) || '',
                  'Element': element,
                  'Execution Time': executionTime
                });
              }
              clearTimeout(module.performance.timer);
              module.performance.timer = setTimeout(module.performance.display, 500);
            },
            display: function () {
              var title = settings.name + ':',
                  totalTime = 0;
              time = false;
              clearTimeout(module.performance.timer);
              $.each(performance, function (index, data) {
                totalTime += data['Execution Time'];
              });
              title += ' ' + totalTime + 'ms';
              if (moduleSelector) {
                title += ' \'' + moduleSelector + '\'';
              }
              if ($allModules.length > 1) {
                title += ' ' + '(' + $allModules.length + ')';
              }
              if ((console.group !== undefined || console.table !== undefined) && performance.length > 0) {
                console.groupCollapsed(title);
                if (console.table) {
                  console.table(performance);
                } else {
                  $.each(performance, function (index, data) {
                    console.log(data['Name'] + ': ' + data['Execution Time'] + 'ms');
                  });
                }
                console.groupEnd();
              }
              performance = [];
            }
          },
          // modified for transition to return invoke success
          invoke: function (query, passedArguments, context) {
            var object = instance,
                maxDepth,
                found,
                response;
            passedArguments = passedArguments || queryArguments;
            context = element || context;
            if (typeof query == 'string' && object !== undefined) {
              query = query.split(/[\. ]/);
              maxDepth = query.length - 1;
              $.each(query, function (depth, value) {
                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth) {
                  object = object[camelCaseValue];
                } else if (object[camelCaseValue] !== undefined) {
                  found = object[camelCaseValue];
                  return false;
                } else if ($.isPlainObject(object[value]) && depth != maxDepth) {
                  object = object[value];
                } else if (object[value] !== undefined) {
                  found = object[value];
                  return false;
                } else {
                  return false;
                }
              });
            }
            if ($.isFunction(found)) {
              response = found.apply(context, passedArguments);
            } else if (found !== undefined) {
              response = found;
            }

            if ($.isArray(returnedValue)) {
              returnedValue.push(response);
            } else if (returnedValue !== undefined) {
              returnedValue = [returnedValue, response];
            } else if (response !== undefined) {
              returnedValue = response;
            }
            return found !== undefined ? found : false;
          }
        };
        module.initialize();
      });
      return returnedValue !== undefined ? returnedValue : this;
    };

    // Records if CSS transition is available
    _module.exports.exists = {};

    _module.exports.settings = {

      // module info
      name: 'Transition',

      // hide all output from this component regardless of other settings
      silent: false,

      // debug content outputted to console
      debug: false,

      // verbose debug output
      verbose: false,

      // performance data output
      performance: true,

      // event namespace
      namespace: 'transition',

      // delay between animations in group
      interval: 0,

      // whether group animations should be reversed
      reverse: 'auto',

      // animation callback event
      onStart: function () {},
      onComplete: function () {},
      onShow: function () {},
      onHide: function () {},

      // whether timeout should be used to ensure callback fires in cases animationend does not
      useFailSafe: true,

      // delay in ms for fail safe
      failSafeDelay: 100,

      // whether EXACT animation can occur twice in a row
      allowRepeats: false,

      // Override final display type on visible
      displayType: false,

      // animation duration
      animation: 'fade',
      duration: false,

      // new animations will occur after previous ones
      queue: true,

      metadata: {
        displayType: 'display'
      },

      className: {
        animating: 'animating',
        disabled: 'disabled',
        hidden: 'hidden',
        inward: 'in',
        loading: 'loading',
        looping: 'looping',
        outward: 'out',
        transition: 'transition',
        visible: 'visible'
      },

      // possible errors
      error: {
        noAnimation: 'Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.',
        repeated: 'That animation is already occurring, cancelling repeated animation',
        method: 'The method you called is not defined',
        support: 'This browser does not support CSS animations'
      }

    };
  })($__require('npm:jquery@3.1.1.js'), window, document);
  return module.exports;
});
System.registerDynamic("npm:semantic-ui-transition@2.2.3.js", ["npm:semantic-ui-transition@2.2.3/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:semantic-ui-transition@2.2.3/index.js");
  return module.exports;
});
System.register('app/searchable_dropdown_selector/view_model.js', ['npm:babel-runtime@5.8.38/helpers/create-class.js', 'npm:babel-runtime@5.8.38/helpers/class-call-check.js', 'npm:jquery@3.1.1.js', 'npm:knockout@3.4.0.js', 'npm:semantic-ui-dropdown@2.2.3.js', 'npm:semantic-ui-transition@2.2.3.js'], function (_export) {
  var _createClass, _classCallCheck, $, Knockout, Dropdown, Transition, SearchableDropdownSelectorViewModel;

  return {
    setters: [function (_npmBabelRuntime5838HelpersCreateClassJs) {
      _createClass = _npmBabelRuntime5838HelpersCreateClassJs['default'];
    }, function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs['default'];
    }, function (_npmJquery311Js) {
      $ = _npmJquery311Js['default'];
    }, function (_npmKnockout340Js) {
      Knockout = _npmKnockout340Js['default'];
    }, function (_npmSemanticUiDropdown223Js) {
      Dropdown = _npmSemanticUiDropdown223Js['default'];
    }, function (_npmSemanticUiTransition223Js) {
      Transition = _npmSemanticUiTransition223Js['default'];
    }],
    execute: function () {
      'use strict';

      $.fn.dropdown = Dropdown;
      $.fn.transition = Transition;

      SearchableDropdownSelectorViewModel = (function () {
        function SearchableDropdownSelectorViewModel() {
          var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var bindLabelTo = _ref.bindLabelTo;
          var bindSelectedOptionTo = _ref.bindSelectedOptionTo;
          var bindOptionsTo = _ref.bindOptionsTo;
          var defaultOption = _ref.defaultOption;

          _classCallCheck(this, SearchableDropdownSelectorViewModel);

          this.label = bindLabelTo || Knockout.observable();
          this.options = bindOptionsTo || Knockout.observable();
          this.selectedOption = bindSelectedOptionTo || Knockout.observable();
          this.selectedOption(defaultOption);
          this.initSelect();
        }

        _createClass(SearchableDropdownSelectorViewModel, [{
          key: 'initSelect',
          value: function initSelect() {
            $(".dropdown").dropdown();
          }
        }]);

        return SearchableDropdownSelectorViewModel;
      })();

      _export('default', SearchableDropdownSelectorViewModel);
    }
  };
});
System.register('app/searchable_dropdown_selector/component.js', ['app/optional_label/component.js', 'npm:knockout@3.4.0.js', 'app/searchable_dropdown_selector/view_model.js'], function (_export) {
  'use strict';

  var Knockout, ViewModel;
  return {
    setters: [function (_appOptional_labelComponentJs) {}, function (_npmKnockout340Js) {
      Knockout = _npmKnockout340Js['default'];
    }, function (_appSearchable_dropdown_selectorView_modelJs) {
      ViewModel = _appSearchable_dropdown_selectorView_modelJs['default'];
    }],
    execute: function () {

      (function () {
        'use strict';

        Knockout.components.register('searchable_dropdown_selector', {
          viewModel: ViewModel,
          template: '\n      <div class="ui field">\n        <optional_label params="text: label">\n        </optional_label>\n        <div class="ui search selection dropdown">\n          <input type="hidden" data-bind="textInput: selectedOption">\n          <i class="dropdown icon"/>\n          <div class="default text" data-bind="text: selectedOption">\n          </div>\n          <div class="menu" data-bind="foreach: options()">\n            <div class="item" data-bind="\n              attr: { \'data-value\': value }, text: name">\n            </div>\n          </div>\n        </div>\n      </div>\n    '
        });
      })();
    }
  };
});
System.registerDynamic('npm:process@0.11.9/browser.js', [], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    })();
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch (e) {
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e) {
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;

    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
        return '/';
    };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function () {
        return 0;
    };
    return module.exports;
});
System.registerDynamic("npm:process@0.11.9.js", ["npm:process@0.11.9/browser.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:process@0.11.9/browser.js");
  return module.exports;
});
System.registerDynamic('github:jspm/nodelibs-process@0.1.2/index.js', ['npm:process@0.11.9.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = System._nodeRequire ? process : $__require('npm:process@0.11.9.js');
  return module.exports;
});
System.registerDynamic("github:jspm/nodelibs-process@0.1.2.js", ["github:jspm/nodelibs-process@0.1.2/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("github:jspm/nodelibs-process@0.1.2/index.js");
  return module.exports;
});
System.registerDynamic('npm:knockout@3.4.0/build/output/knockout-latest.debug.js', ['github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  /* */
  "format cjs";

  var define,
      global = this || self,
      GLOBAL = global;
  (function (process) {
    (function () {
      var DEBUG = true;
      (function (undefined) {
        var window = this || (0, eval)('this'),
            document = window['document'],
            navigator = window['navigator'],
            jQueryInstance = window["jQuery"],
            JSON = window["JSON"];
        (function (factory) {
          if (typeof define === 'function' && define['amd']) {
            define(['exports', 'require'], factory);
          } else if (typeof exports === 'object' && typeof module === 'object') {
            factory(module['exports'] || exports);
          } else {
            factory(window['ko'] = {});
          }
        })(function (koExports, amdRequire) {
          var ko = typeof koExports !== 'undefined' ? koExports : {};
          ko.exportSymbol = function (koPath, object) {
            var tokens = koPath.split(".");
            var target = ko;
            for (var i = 0; i < tokens.length - 1; i++) target = target[tokens[i]];
            target[tokens[tokens.length - 1]] = object;
          };
          ko.exportProperty = function (owner, publicName, object) {
            owner[publicName] = object;
          };
          ko.version = "3.4.0";
          ko.exportSymbol('version', ko.version);
          ko.options = {
            'deferUpdates': false,
            'useOnlyNativeEvents': false
          };
          ko.utils = function () {
            function objectForEach(obj, action) {
              for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                  action(prop, obj[prop]);
                }
              }
            }
            function extend(target, source) {
              if (source) {
                for (var prop in source) {
                  if (source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                  }
                }
              }
              return target;
            }
            function setPrototypeOf(obj, proto) {
              obj.__proto__ = proto;
              return obj;
            }
            var canSetPrototype = { __proto__: [] } instanceof Array;
            var canUseSymbols = !DEBUG && typeof Symbol === 'function';
            var knownEvents = {},
                knownEventTypesByEventName = {};
            var keyEventTypeName = navigator && /Firefox\/2/i.test(navigator.userAgent) ? 'KeyboardEvent' : 'UIEvents';
            knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
            knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
            objectForEach(knownEvents, function (eventType, knownEventsForType) {
              if (knownEventsForType.length) {
                for (var i = 0, j = knownEventsForType.length; i < j; i++) knownEventTypesByEventName[knownEventsForType[i]] = eventType;
              }
            });
            var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true };
            var ieVersion = document && function () {
              var version = 3,
                  div = document.createElement('div'),
                  iElems = div.getElementsByTagName('i');
              while (div.innerHTML = '<!--[if gt IE ' + ++version + ']><i></i><![endif]-->', iElems[0]) {}
              return version > 4 ? version : undefined;
            }();
            var isIe6 = ieVersion === 6,
                isIe7 = ieVersion === 7;
            function isClickOnCheckableElement(element, eventType) {
              if (ko.utils.tagNameLower(element) !== "input" || !element.type) return false;
              if (eventType.toLowerCase() != "click") return false;
              var inputType = element.type;
              return inputType == "checkbox" || inputType == "radio";
            }
            var cssClassNameRegex = /\S+/g;
            function toggleDomNodeCssClass(node, classNames, shouldHaveClass) {
              var addOrRemoveFn;
              if (classNames) {
                if (typeof node.classList === 'object') {
                  addOrRemoveFn = node.classList[shouldHaveClass ? 'add' : 'remove'];
                  ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function (className) {
                    addOrRemoveFn.call(node.classList, className);
                  });
                } else if (typeof node.className['baseVal'] === 'string') {
                  toggleObjectClassPropertyString(node.className, 'baseVal', classNames, shouldHaveClass);
                } else {
                  toggleObjectClassPropertyString(node, 'className', classNames, shouldHaveClass);
                }
              }
            }
            function toggleObjectClassPropertyString(obj, prop, classNames, shouldHaveClass) {
              var currentClassNames = obj[prop].match(cssClassNameRegex) || [];
              ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function (className) {
                ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
              });
              obj[prop] = currentClassNames.join(" ");
            }
            return {
              fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],
              arrayForEach: function (array, action) {
                for (var i = 0, j = array.length; i < j; i++) action(array[i], i);
              },
              arrayIndexOf: function (array, item) {
                if (typeof Array.prototype.indexOf == "function") return Array.prototype.indexOf.call(array, item);
                for (var i = 0, j = array.length; i < j; i++) if (array[i] === item) return i;
                return -1;
              },
              arrayFirst: function (array, predicate, predicateOwner) {
                for (var i = 0, j = array.length; i < j; i++) if (predicate.call(predicateOwner, array[i], i)) return array[i];
                return null;
              },
              arrayRemoveItem: function (array, itemToRemove) {
                var index = ko.utils.arrayIndexOf(array, itemToRemove);
                if (index > 0) {
                  array.splice(index, 1);
                } else if (index === 0) {
                  array.shift();
                }
              },
              arrayGetDistinctValues: function (array) {
                array = array || [];
                var result = [];
                for (var i = 0, j = array.length; i < j; i++) {
                  if (ko.utils.arrayIndexOf(result, array[i]) < 0) result.push(array[i]);
                }
                return result;
              },
              arrayMap: function (array, mapping) {
                array = array || [];
                var result = [];
                for (var i = 0, j = array.length; i < j; i++) result.push(mapping(array[i], i));
                return result;
              },
              arrayFilter: function (array, predicate) {
                array = array || [];
                var result = [];
                for (var i = 0, j = array.length; i < j; i++) if (predicate(array[i], i)) result.push(array[i]);
                return result;
              },
              arrayPushAll: function (array, valuesToPush) {
                if (valuesToPush instanceof Array) array.push.apply(array, valuesToPush);else for (var i = 0, j = valuesToPush.length; i < j; i++) array.push(valuesToPush[i]);
                return array;
              },
              addOrRemoveItem: function (array, value, included) {
                var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
                if (existingEntryIndex < 0) {
                  if (included) array.push(value);
                } else {
                  if (!included) array.splice(existingEntryIndex, 1);
                }
              },
              canSetPrototype: canSetPrototype,
              extend: extend,
              setPrototypeOf: setPrototypeOf,
              setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend,
              objectForEach: objectForEach,
              objectMap: function (source, mapping) {
                if (!source) return source;
                var target = {};
                for (var prop in source) {
                  if (source.hasOwnProperty(prop)) {
                    target[prop] = mapping(source[prop], prop, source);
                  }
                }
                return target;
              },
              emptyDomNode: function (domNode) {
                while (domNode.firstChild) {
                  ko.removeNode(domNode.firstChild);
                }
              },
              moveCleanedNodesToContainerElement: function (nodes) {
                var nodesArray = ko.utils.makeArray(nodes);
                var templateDocument = nodesArray[0] && nodesArray[0].ownerDocument || document;
                var container = templateDocument.createElement('div');
                for (var i = 0, j = nodesArray.length; i < j; i++) {
                  container.appendChild(ko.cleanNode(nodesArray[i]));
                }
                return container;
              },
              cloneNodes: function (nodesArray, shouldCleanNodes) {
                for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                  var clonedNode = nodesArray[i].cloneNode(true);
                  newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
                }
                return newNodesArray;
              },
              setDomNodeChildren: function (domNode, childNodes) {
                ko.utils.emptyDomNode(domNode);
                if (childNodes) {
                  for (var i = 0, j = childNodes.length; i < j; i++) domNode.appendChild(childNodes[i]);
                }
              },
              replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
                var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
                if (nodesToReplaceArray.length > 0) {
                  var insertionPoint = nodesToReplaceArray[0];
                  var parent = insertionPoint.parentNode;
                  for (var i = 0, j = newNodesArray.length; i < j; i++) parent.insertBefore(newNodesArray[i], insertionPoint);
                  for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                  }
                }
              },
              fixUpContinuousNodeArray: function (continuousNodeArray, parentNode) {
                if (continuousNodeArray.length) {
                  parentNode = parentNode.nodeType === 8 && parentNode.parentNode || parentNode;
                  while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode) continuousNodeArray.splice(0, 1);
                  while (continuousNodeArray.length > 1 && continuousNodeArray[continuousNodeArray.length - 1].parentNode !== parentNode) continuousNodeArray.length--;
                  if (continuousNodeArray.length > 1) {
                    var current = continuousNodeArray[0],
                        last = continuousNodeArray[continuousNodeArray.length - 1];
                    continuousNodeArray.length = 0;
                    while (current !== last) {
                      continuousNodeArray.push(current);
                      current = current.nextSibling;
                    }
                    continuousNodeArray.push(last);
                  }
                }
                return continuousNodeArray;
              },
              setOptionNodeSelectionState: function (optionNode, isSelected) {
                if (ieVersion < 7) optionNode.setAttribute("selected", isSelected);else optionNode.selected = isSelected;
              },
              stringTrim: function (string) {
                return string === null || string === undefined ? '' : string.trim ? string.trim() : string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
              },
              stringStartsWith: function (string, startsWith) {
                string = string || "";
                if (startsWith.length > string.length) return false;
                return string.substring(0, startsWith.length) === startsWith;
              },
              domNodeIsContainedBy: function (node, containedByNode) {
                if (node === containedByNode) return true;
                if (node.nodeType === 11) return false;
                if (containedByNode.contains) return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
                if (containedByNode.compareDocumentPosition) return (containedByNode.compareDocumentPosition(node) & 16) == 16;
                while (node && node != containedByNode) {
                  node = node.parentNode;
                }
                return !!node;
              },
              domNodeIsAttachedToDocument: function (node) {
                return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
              },
              anyDomNodeIsAttachedToDocument: function (nodes) {
                return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
              },
              tagNameLower: function (element) {
                return element && element.tagName && element.tagName.toLowerCase();
              },
              catchFunctionErrors: function (delegate) {
                return ko['onError'] ? function () {
                  try {
                    return delegate.apply(this, arguments);
                  } catch (e) {
                    ko['onError'] && ko['onError'](e);
                    throw e;
                  }
                } : delegate;
              },
              setTimeout: function (handler, timeout) {
                return setTimeout(ko.utils.catchFunctionErrors(handler), timeout);
              },
              deferError: function (error) {
                setTimeout(function () {
                  ko['onError'] && ko['onError'](error);
                  throw error;
                }, 0);
              },
              registerEventHandler: function (element, eventType, handler) {
                var wrappedHandler = ko.utils.catchFunctionErrors(handler);
                var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
                if (!ko.options['useOnlyNativeEvents'] && !mustUseAttachEvent && jQueryInstance) {
                  jQueryInstance(element)['bind'](eventType, wrappedHandler);
                } else if (!mustUseAttachEvent && typeof element.addEventListener == "function") element.addEventListener(eventType, wrappedHandler, false);else if (typeof element.attachEvent != "undefined") {
                  var attachEventHandler = function (event) {
                    wrappedHandler.call(element, event);
                  },
                      attachEventName = "on" + eventType;
                  element.attachEvent(attachEventName, attachEventHandler);
                  ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    element.detachEvent(attachEventName, attachEventHandler);
                  });
                } else throw new Error("Browser doesn't support addEventListener or attachEvent");
              },
              triggerEvent: function (element, eventType) {
                if (!(element && element.nodeType)) throw new Error("element must be a DOM node when calling triggerEvent");
                var useClickWorkaround = isClickOnCheckableElement(element, eventType);
                if (!ko.options['useOnlyNativeEvents'] && jQueryInstance && !useClickWorkaround) {
                  jQueryInstance(element)['trigger'](eventType);
                } else if (typeof document.createEvent == "function") {
                  if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                  } else throw new Error("The supplied element doesn't support dispatchEvent");
                } else if (useClickWorkaround && element.click) {
                  element.click();
                } else if (typeof element.fireEvent != "undefined") {
                  element.fireEvent("on" + eventType);
                } else {
                  throw new Error("Browser doesn't support triggering events");
                }
              },
              unwrapObservable: function (value) {
                return ko.isObservable(value) ? value() : value;
              },
              peekObservable: function (value) {
                return ko.isObservable(value) ? value.peek() : value;
              },
              toggleDomNodeCssClass: toggleDomNodeCssClass,
              setTextContent: function (element, textContent) {
                var value = ko.utils.unwrapObservable(textContent);
                if (value === null || value === undefined) value = "";
                var innerTextNode = ko.virtualElements.firstChild(element);
                if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                  ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
                } else {
                  innerTextNode.data = value;
                }
                ko.utils.forceRefresh(element);
              },
              setElementName: function (element, name) {
                element.name = name;
                if (ieVersion <= 7) {
                  try {
                    element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                  } catch (e) {}
                }
              },
              forceRefresh: function (node) {
                if (ieVersion >= 9) {
                  var elem = node.nodeType == 1 ? node : node.parentNode;
                  if (elem.style) elem.style.zoom = elem.style.zoom;
                }
              },
              ensureSelectElementIsRenderedCorrectly: function (selectElement) {
                if (ieVersion) {
                  var originalWidth = selectElement.style.width;
                  selectElement.style.width = 0;
                  selectElement.style.width = originalWidth;
                }
              },
              range: function (min, max) {
                min = ko.utils.unwrapObservable(min);
                max = ko.utils.unwrapObservable(max);
                var result = [];
                for (var i = min; i <= max; i++) result.push(i);
                return result;
              },
              makeArray: function (arrayLikeObject) {
                var result = [];
                for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                  result.push(arrayLikeObject[i]);
                }
                ;
                return result;
              },
              createSymbolOrString: function (identifier) {
                return canUseSymbols ? Symbol(identifier) : identifier;
              },
              isIe6: isIe6,
              isIe7: isIe7,
              ieVersion: ieVersion,
              getFormFields: function (form, fieldName) {
                var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
                var isMatchingField = typeof fieldName == 'string' ? function (field) {
                  return field.name === fieldName;
                } : function (field) {
                  return fieldName.test(field.name);
                };
                var matches = [];
                for (var i = fields.length - 1; i >= 0; i--) {
                  if (isMatchingField(fields[i])) matches.push(fields[i]);
                }
                ;
                return matches;
              },
              parseJson: function (jsonString) {
                if (typeof jsonString == "string") {
                  jsonString = ko.utils.stringTrim(jsonString);
                  if (jsonString) {
                    if (JSON && JSON.parse) return JSON.parse(jsonString);
                    return new Function("return " + jsonString)();
                  }
                }
                return null;
              },
              stringifyJson: function (data, replacer, space) {
                if (!JSON || !JSON.stringify) throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
                return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
              },
              postJson: function (urlOrForm, data, options) {
                options = options || {};
                var params = options['params'] || {};
                var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
                var url = urlOrForm;
                if (typeof urlOrForm == 'object' && ko.utils.tagNameLower(urlOrForm) === "form") {
                  var originalForm = urlOrForm;
                  url = originalForm.action;
                  for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--) params[fields[j].name] = fields[j].value;
                  }
                }
                data = ko.utils.unwrapObservable(data);
                var form = document.createElement("form");
                form.style.display = "none";
                form.action = url;
                form.method = "post";
                for (var key in data) {
                  var input = document.createElement("input");
                  input.type = "hidden";
                  input.name = key;
                  input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                  form.appendChild(input);
                }
                objectForEach(params, function (key, value) {
                  var input = document.createElement("input");
                  input.type = "hidden";
                  input.name = key;
                  input.value = value;
                  form.appendChild(input);
                });
                document.body.appendChild(form);
                options['submitter'] ? options['submitter'](form) : form.submit();
                setTimeout(function () {
                  form.parentNode.removeChild(form);
                }, 0);
              }
            };
          }();
          ko.exportSymbol('utils', ko.utils);
          ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
          ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
          ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
          ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
          ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
          ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
          ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
          ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
          ko.exportSymbol('utils.extend', ko.utils.extend);
          ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
          ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
          ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
          ko.exportSymbol('utils.postJson', ko.utils.postJson);
          ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
          ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
          ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
          ko.exportSymbol('utils.range', ko.utils.range);
          ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
          ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
          ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
          ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
          ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
          ko.exportSymbol('utils.setTextContent', ko.utils.setTextContent);
          ko.exportSymbol('unwrap', ko.utils.unwrapObservable);
          if (!Function.prototype['bind']) {
            Function.prototype['bind'] = function (object) {
              var originalFunction = this;
              if (arguments.length === 1) {
                return function () {
                  return originalFunction.apply(object, arguments);
                };
              } else {
                var partialArgs = Array.prototype.slice.call(arguments, 1);
                return function () {
                  var args = partialArgs.slice(0);
                  args.push.apply(args, arguments);
                  return originalFunction.apply(object, args);
                };
              }
            };
          }
          ko.utils.domData = new function () {
            var uniqueId = 0;
            var dataStoreKeyExpandoPropertyName = "__ko__" + new Date().getTime();
            var dataStore = {};
            function getAll(node, createIfNotFound) {
              var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
              var hasExistingDataStore = dataStoreKey && dataStoreKey !== "null" && dataStore[dataStoreKey];
              if (!hasExistingDataStore) {
                if (!createIfNotFound) return undefined;
                dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                dataStore[dataStoreKey] = {};
              }
              return dataStore[dataStoreKey];
            }
            return {
              get: function (node, key) {
                var allDataForNode = getAll(node, false);
                return allDataForNode === undefined ? undefined : allDataForNode[key];
              },
              set: function (node, key, value) {
                if (value === undefined) {
                  if (getAll(node, false) === undefined) return;
                }
                var allDataForNode = getAll(node, true);
                allDataForNode[key] = value;
              },
              clear: function (node) {
                var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
                if (dataStoreKey) {
                  delete dataStore[dataStoreKey];
                  node[dataStoreKeyExpandoPropertyName] = null;
                  return true;
                }
                return false;
              },
              nextKey: function () {
                return uniqueId++ + dataStoreKeyExpandoPropertyName;
              }
            };
          }();
          ko.exportSymbol('utils.domData', ko.utils.domData);
          ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear);
          ko.utils.domNodeDisposal = new function () {
            var domDataKey = ko.utils.domData.nextKey();
            var cleanableNodeTypes = {
              1: true,
              8: true,
              9: true
            };
            var cleanableNodeTypesWithDescendants = {
              1: true,
              9: true
            };
            function getDisposeCallbacksCollection(node, createIfNotFound) {
              var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
              if (allDisposeCallbacks === undefined && createIfNotFound) {
                allDisposeCallbacks = [];
                ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
              }
              return allDisposeCallbacks;
            }
            function destroyCallbacksCollection(node) {
              ko.utils.domData.set(node, domDataKey, undefined);
            }
            function cleanSingleNode(node) {
              var callbacks = getDisposeCallbacksCollection(node, false);
              if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0; i < callbacks.length; i++) callbacks[i](node);
              }
              ko.utils.domData.clear(node);
              ko.utils.domNodeDisposal["cleanExternalData"](node);
              if (cleanableNodeTypesWithDescendants[node.nodeType]) cleanImmediateCommentTypeChildren(node);
            }
            function cleanImmediateCommentTypeChildren(nodeWithChildren) {
              var child,
                  nextChild = nodeWithChildren.firstChild;
              while (child = nextChild) {
                nextChild = child.nextSibling;
                if (child.nodeType === 8) cleanSingleNode(child);
              }
            }
            return {
              addDisposeCallback: function (node, callback) {
                if (typeof callback != "function") throw new Error("Callback must be a function");
                getDisposeCallbacksCollection(node, true).push(callback);
              },
              removeDisposeCallback: function (node, callback) {
                var callbacksCollection = getDisposeCallbacksCollection(node, false);
                if (callbacksCollection) {
                  ko.utils.arrayRemoveItem(callbacksCollection, callback);
                  if (callbacksCollection.length == 0) destroyCallbacksCollection(node);
                }
              },
              cleanNode: function (node) {
                if (cleanableNodeTypes[node.nodeType]) {
                  cleanSingleNode(node);
                  if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++) cleanSingleNode(descendants[i]);
                  }
                }
                return node;
              },
              removeNode: function (node) {
                ko.cleanNode(node);
                if (node.parentNode) node.parentNode.removeChild(node);
              },
              "cleanExternalData": function (node) {
                if (jQueryInstance && typeof jQueryInstance['cleanData'] == "function") jQueryInstance['cleanData']([node]);
              }
            };
          }();
          ko.cleanNode = ko.utils.domNodeDisposal.cleanNode;
          ko.removeNode = ko.utils.domNodeDisposal.removeNode;
          ko.exportSymbol('cleanNode', ko.cleanNode);
          ko.exportSymbol('removeNode', ko.removeNode);
          ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
          ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
          ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
          (function () {
            var none = [0, "", ""],
                table = [1, "<table>", "</table>"],
                tbody = [2, "<table><tbody>", "</tbody></table>"],
                tr = [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                select = [1, "<select multiple='multiple'>", "</select>"],
                lookup = {
              'thead': table,
              'tbody': table,
              'tfoot': table,
              'tr': tbody,
              'td': tr,
              'th': tr,
              'option': select,
              'optgroup': select
            },
                mayRequireCreateElementHack = ko.utils.ieVersion <= 8;
            function getWrap(tags) {
              var m = tags.match(/^<([a-z]+)[ >]/);
              return m && lookup[m[1]] || none;
            }
            function simpleHtmlParse(html, documentContext) {
              documentContext || (documentContext = document);
              var windowContext = documentContext['parentWindow'] || documentContext['defaultView'] || window;
              var tags = ko.utils.stringTrim(html).toLowerCase(),
                  div = documentContext.createElement("div"),
                  wrap = getWrap(tags),
                  depth = wrap[0];
              var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
              if (typeof windowContext['innerShiv'] == "function") {
                div.appendChild(windowContext['innerShiv'](markup));
              } else {
                if (mayRequireCreateElementHack) {
                  documentContext.appendChild(div);
                }
                div.innerHTML = markup;
                if (mayRequireCreateElementHack) {
                  div.parentNode.removeChild(div);
                }
              }
              while (depth--) div = div.lastChild;
              return ko.utils.makeArray(div.lastChild.childNodes);
            }
            function jQueryHtmlParse(html, documentContext) {
              if (jQueryInstance['parseHTML']) {
                return jQueryInstance['parseHTML'](html, documentContext) || [];
              } else {
                var elems = jQueryInstance['clean']([html], documentContext);
                if (elems && elems[0]) {
                  var elem = elems[0];
                  while (elem.parentNode && elem.parentNode.nodeType !== 11) elem = elem.parentNode;
                  if (elem.parentNode) elem.parentNode.removeChild(elem);
                }
                return elems;
              }
            }
            ko.utils.parseHtmlFragment = function (html, documentContext) {
              return jQueryInstance ? jQueryHtmlParse(html, documentContext) : simpleHtmlParse(html, documentContext);
            };
            ko.utils.setHtml = function (node, html) {
              ko.utils.emptyDomNode(node);
              html = ko.utils.unwrapObservable(html);
              if (html !== null && html !== undefined) {
                if (typeof html != 'string') html = html.toString();
                if (jQueryInstance) {
                  jQueryInstance(node)['html'](html);
                } else {
                  var parsedNodes = ko.utils.parseHtmlFragment(html, node.ownerDocument);
                  for (var i = 0; i < parsedNodes.length; i++) node.appendChild(parsedNodes[i]);
                }
              }
            };
          })();
          ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
          ko.exportSymbol('utils.setHtml', ko.utils.setHtml);
          ko.memoization = function () {
            var memos = {};
            function randomMax8HexChars() {
              return ((1 + Math.random()) * 0x100000000 | 0).toString(16).substring(1);
            }
            function generateRandomId() {
              return randomMax8HexChars() + randomMax8HexChars();
            }
            function findMemoNodes(rootNode, appendToArray) {
              if (!rootNode) return;
              if (rootNode.nodeType == 8) {
                var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
                if (memoId != null) appendToArray.push({
                  domNode: rootNode,
                  memoId: memoId
                });
              } else if (rootNode.nodeType == 1) {
                for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++) findMemoNodes(childNodes[i], appendToArray);
              }
            }
            return {
              memoize: function (callback) {
                if (typeof callback != "function") throw new Error("You can only pass a function to ko.memoization.memoize()");
                var memoId = generateRandomId();
                memos[memoId] = callback;
                return "<!--[ko_memo:" + memoId + "]-->";
              },
              unmemoize: function (memoId, callbackParams) {
                var callback = memos[memoId];
                if (callback === undefined) throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
                try {
                  callback.apply(null, callbackParams || []);
                  return true;
                } finally {
                  delete memos[memoId];
                }
              },
              unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
                var memos = [];
                findMemoNodes(domNode, memos);
                for (var i = 0, j = memos.length; i < j; i++) {
                  var node = memos[i].domNode;
                  var combinedParams = [node];
                  if (extraCallbackParamsArray) ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                  ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                  node.nodeValue = "";
                  if (node.parentNode) node.parentNode.removeChild(node);
                }
              },
              parseMemoText: function (memoText) {
                var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
                return match ? match[1] : null;
              }
            };
          }();
          ko.exportSymbol('memoization', ko.memoization);
          ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
          ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
          ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
          ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
          ko.tasks = function () {
            var scheduler,
                taskQueue = [],
                taskQueueLength = 0,
                nextHandle = 1,
                nextIndexToProcess = 0;
            if (window['MutationObserver']) {
              scheduler = function (callback) {
                var div = document.createElement("div");
                new MutationObserver(callback).observe(div, { attributes: true });
                return function () {
                  div.classList.toggle("foo");
                };
              }(scheduledProcess);
            } else if (document && "onreadystatechange" in document.createElement("script")) {
              scheduler = function (callback) {
                var script = document.createElement("script");
                script.onreadystatechange = function () {
                  script.onreadystatechange = null;
                  document.documentElement.removeChild(script);
                  script = null;
                  callback();
                };
                document.documentElement.appendChild(script);
              };
            } else {
              scheduler = function (callback) {
                setTimeout(callback, 0);
              };
            }
            function processTasks() {
              if (taskQueueLength) {
                var mark = taskQueueLength,
                    countMarks = 0;
                for (var task; nextIndexToProcess < taskQueueLength;) {
                  if (task = taskQueue[nextIndexToProcess++]) {
                    if (nextIndexToProcess > mark) {
                      if (++countMarks >= 5000) {
                        nextIndexToProcess = taskQueueLength;
                        ko.utils.deferError(Error("'Too much recursion' after processing " + countMarks + " task groups."));
                        break;
                      }
                      mark = taskQueueLength;
                    }
                    try {
                      task();
                    } catch (ex) {
                      ko.utils.deferError(ex);
                    }
                  }
                }
              }
            }
            function scheduledProcess() {
              processTasks();
              nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
            }
            function scheduleTaskProcessing() {
              ko.tasks['scheduler'](scheduledProcess);
            }
            var tasks = {
              'scheduler': scheduler,
              schedule: function (func) {
                if (!taskQueueLength) {
                  scheduleTaskProcessing();
                }
                taskQueue[taskQueueLength++] = func;
                return nextHandle++;
              },
              cancel: function (handle) {
                var index = handle - (nextHandle - taskQueueLength);
                if (index >= nextIndexToProcess && index < taskQueueLength) {
                  taskQueue[index] = null;
                }
              },
              'resetForTesting': function () {
                var length = taskQueueLength - nextIndexToProcess;
                nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
                return length;
              },
              runEarly: processTasks
            };
            return tasks;
          }();
          ko.exportSymbol('tasks', ko.tasks);
          ko.exportSymbol('tasks.schedule', ko.tasks.schedule);
          ko.exportSymbol('tasks.runEarly', ko.tasks.runEarly);
          ko.extenders = {
            'throttle': function (target, timeout) {
              target['throttleEvaluation'] = timeout;
              var writeTimeoutInstance = null;
              return ko.dependentObservable({
                'read': target,
                'write': function (value) {
                  clearTimeout(writeTimeoutInstance);
                  writeTimeoutInstance = ko.utils.setTimeout(function () {
                    target(value);
                  }, timeout);
                }
              });
            },
            'rateLimit': function (target, options) {
              var timeout, method, limitFunction;
              if (typeof options == 'number') {
                timeout = options;
              } else {
                timeout = options['timeout'];
                method = options['method'];
              }
              target._deferUpdates = false;
              limitFunction = method == 'notifyWhenChangesStop' ? debounce : throttle;
              target.limit(function (callback) {
                return limitFunction(callback, timeout);
              });
            },
            'deferred': function (target, options) {
              if (options !== true) {
                throw new Error('The \'deferred\' extender only accepts the value \'true\', because it is not supported to turn deferral off once enabled.');
              }
              if (!target._deferUpdates) {
                target._deferUpdates = true;
                target.limit(function (callback) {
                  var handle;
                  return function () {
                    ko.tasks.cancel(handle);
                    handle = ko.tasks.schedule(callback);
                    target['notifySubscribers'](undefined, 'dirty');
                  };
                });
              }
            },
            'notify': function (target, notifyWhen) {
              target["equalityComparer"] = notifyWhen == "always" ? null : valuesArePrimitiveAndEqual;
            }
          };
          var primitiveTypes = {
            'undefined': 1,
            'boolean': 1,
            'number': 1,
            'string': 1
          };
          function valuesArePrimitiveAndEqual(a, b) {
            var oldValueIsPrimitive = a === null || typeof a in primitiveTypes;
            return oldValueIsPrimitive ? a === b : false;
          }
          function throttle(callback, timeout) {
            var timeoutInstance;
            return function () {
              if (!timeoutInstance) {
                timeoutInstance = ko.utils.setTimeout(function () {
                  timeoutInstance = undefined;
                  callback();
                }, timeout);
              }
            };
          }
          function debounce(callback, timeout) {
            var timeoutInstance;
            return function () {
              clearTimeout(timeoutInstance);
              timeoutInstance = ko.utils.setTimeout(callback, timeout);
            };
          }
          function applyExtenders(requestedExtenders) {
            var target = this;
            if (requestedExtenders) {
              ko.utils.objectForEach(requestedExtenders, function (key, value) {
                var extenderHandler = ko.extenders[key];
                if (typeof extenderHandler == 'function') {
                  target = extenderHandler(target, value) || target;
                }
              });
            }
            return target;
          }
          ko.exportSymbol('extenders', ko.extenders);
          ko.subscription = function (target, callback, disposeCallback) {
            this._target = target;
            this.callback = callback;
            this.disposeCallback = disposeCallback;
            this.isDisposed = false;
            ko.exportProperty(this, 'dispose', this.dispose);
          };
          ko.subscription.prototype.dispose = function () {
            this.isDisposed = true;
            this.disposeCallback();
          };
          ko.subscribable = function () {
            ko.utils.setPrototypeOfOrExtend(this, ko_subscribable_fn);
            ko_subscribable_fn.init(this);
          };
          var defaultEvent = "change";
          function limitNotifySubscribers(value, event) {
            if (!event || event === defaultEvent) {
              this._limitChange(value);
            } else if (event === 'beforeChange') {
              this._limitBeforeChange(value);
            } else {
              this._origNotifySubscribers(value, event);
            }
          }
          var ko_subscribable_fn = {
            init: function (instance) {
              instance._subscriptions = {};
              instance._versionNumber = 1;
            },
            subscribe: function (callback, callbackTarget, event) {
              var self = this;
              event = event || defaultEvent;
              var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;
              var subscription = new ko.subscription(self, boundCallback, function () {
                ko.utils.arrayRemoveItem(self._subscriptions[event], subscription);
                if (self.afterSubscriptionRemove) self.afterSubscriptionRemove(event);
              });
              if (self.beforeSubscriptionAdd) self.beforeSubscriptionAdd(event);
              if (!self._subscriptions[event]) self._subscriptions[event] = [];
              self._subscriptions[event].push(subscription);
              return subscription;
            },
            "notifySubscribers": function (valueToNotify, event) {
              event = event || defaultEvent;
              if (event === defaultEvent) {
                this.updateVersion();
              }
              if (this.hasSubscriptionsForEvent(event)) {
                try {
                  ko.dependencyDetection.begin();
                  for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {
                    if (!subscription.isDisposed) subscription.callback(valueToNotify);
                  }
                } finally {
                  ko.dependencyDetection.end();
                }
              }
            },
            getVersion: function () {
              return this._versionNumber;
            },
            hasChanged: function (versionToCheck) {
              return this.getVersion() !== versionToCheck;
            },
            updateVersion: function () {
              ++this._versionNumber;
            },
            limit: function (limitFunction) {
              var self = this,
                  selfIsObservable = ko.isObservable(self),
                  ignoreBeforeChange,
                  previousValue,
                  pendingValue,
                  beforeChange = 'beforeChange';
              if (!self._origNotifySubscribers) {
                self._origNotifySubscribers = self["notifySubscribers"];
                self["notifySubscribers"] = limitNotifySubscribers;
              }
              var finish = limitFunction(function () {
                self._notificationIsPending = false;
                if (selfIsObservable && pendingValue === self) {
                  pendingValue = self();
                }
                ignoreBeforeChange = false;
                if (self.isDifferent(previousValue, pendingValue)) {
                  self._origNotifySubscribers(previousValue = pendingValue);
                }
              });
              self._limitChange = function (value) {
                self._notificationIsPending = ignoreBeforeChange = true;
                pendingValue = value;
                finish();
              };
              self._limitBeforeChange = function (value) {
                if (!ignoreBeforeChange) {
                  previousValue = value;
                  self._origNotifySubscribers(value, beforeChange);
                }
              };
            },
            hasSubscriptionsForEvent: function (event) {
              return this._subscriptions[event] && this._subscriptions[event].length;
            },
            getSubscriptionsCount: function (event) {
              if (event) {
                return this._subscriptions[event] && this._subscriptions[event].length || 0;
              } else {
                var total = 0;
                ko.utils.objectForEach(this._subscriptions, function (eventName, subscriptions) {
                  if (eventName !== 'dirty') total += subscriptions.length;
                });
                return total;
              }
            },
            isDifferent: function (oldValue, newValue) {
              return !this['equalityComparer'] || !this['equalityComparer'](oldValue, newValue);
            },
            extend: applyExtenders
          };
          ko.exportProperty(ko_subscribable_fn, 'subscribe', ko_subscribable_fn.subscribe);
          ko.exportProperty(ko_subscribable_fn, 'extend', ko_subscribable_fn.extend);
          ko.exportProperty(ko_subscribable_fn, 'getSubscriptionsCount', ko_subscribable_fn.getSubscriptionsCount);
          if (ko.utils.canSetPrototype) {
            ko.utils.setPrototypeOf(ko_subscribable_fn, Function.prototype);
          }
          ko.subscribable['fn'] = ko_subscribable_fn;
          ko.isSubscribable = function (instance) {
            return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
          };
          ko.exportSymbol('subscribable', ko.subscribable);
          ko.exportSymbol('isSubscribable', ko.isSubscribable);
          ko.computedContext = ko.dependencyDetection = function () {
            var outerFrames = [],
                currentFrame,
                lastId = 0;
            function getId() {
              return ++lastId;
            }
            function begin(options) {
              outerFrames.push(currentFrame);
              currentFrame = options;
            }
            function end() {
              currentFrame = outerFrames.pop();
            }
            return {
              begin: begin,
              end: end,
              registerDependency: function (subscribable) {
                if (currentFrame) {
                  if (!ko.isSubscribable(subscribable)) throw new Error("Only subscribable things can act as dependencies");
                  currentFrame.callback.call(currentFrame.callbackTarget, subscribable, subscribable._id || (subscribable._id = getId()));
                }
              },
              ignore: function (callback, callbackTarget, callbackArgs) {
                try {
                  begin();
                  return callback.apply(callbackTarget, callbackArgs || []);
                } finally {
                  end();
                }
              },
              getDependenciesCount: function () {
                if (currentFrame) return currentFrame.computed.getDependenciesCount();
              },
              isInitial: function () {
                if (currentFrame) return currentFrame.isInitial;
              }
            };
          }();
          ko.exportSymbol('computedContext', ko.computedContext);
          ko.exportSymbol('computedContext.getDependenciesCount', ko.computedContext.getDependenciesCount);
          ko.exportSymbol('computedContext.isInitial', ko.computedContext.isInitial);
          ko.exportSymbol('ignoreDependencies', ko.ignoreDependencies = ko.dependencyDetection.ignore);
          var observableLatestValue = ko.utils.createSymbolOrString('_latestValue');
          ko.observable = function (initialValue) {
            function observable() {
              if (arguments.length > 0) {
                if (observable.isDifferent(observable[observableLatestValue], arguments[0])) {
                  observable.valueWillMutate();
                  observable[observableLatestValue] = arguments[0];
                  observable.valueHasMutated();
                }
                return this;
              } else {
                ko.dependencyDetection.registerDependency(observable);
                return observable[observableLatestValue];
              }
            }
            observable[observableLatestValue] = initialValue;
            if (!ko.utils.canSetPrototype) {
              ko.utils.extend(observable, ko.subscribable['fn']);
            }
            ko.subscribable['fn'].init(observable);
            ko.utils.setPrototypeOfOrExtend(observable, observableFn);
            if (ko.options['deferUpdates']) {
              ko.extenders['deferred'](observable, true);
            }
            return observable;
          };
          var observableFn = {
            'equalityComparer': valuesArePrimitiveAndEqual,
            peek: function () {
              return this[observableLatestValue];
            },
            valueHasMutated: function () {
              this['notifySubscribers'](this[observableLatestValue]);
            },
            valueWillMutate: function () {
              this['notifySubscribers'](this[observableLatestValue], 'beforeChange');
            }
          };
          if (ko.utils.canSetPrototype) {
            ko.utils.setPrototypeOf(observableFn, ko.subscribable['fn']);
          }
          var protoProperty = ko.observable.protoProperty = '__ko_proto__';
          observableFn[protoProperty] = ko.observable;
          ko.hasPrototype = function (instance, prototype) {
            if (instance === null || instance === undefined || instance[protoProperty] === undefined) return false;
            if (instance[protoProperty] === prototype) return true;
            return ko.hasPrototype(instance[protoProperty], prototype);
          };
          ko.isObservable = function (instance) {
            return ko.hasPrototype(instance, ko.observable);
          };
          ko.isWriteableObservable = function (instance) {
            if (typeof instance == 'function' && instance[protoProperty] === ko.observable) return true;
            if (typeof instance == 'function' && instance[protoProperty] === ko.dependentObservable && instance.hasWriteFunction) return true;
            return false;
          };
          ko.exportSymbol('observable', ko.observable);
          ko.exportSymbol('isObservable', ko.isObservable);
          ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
          ko.exportSymbol('isWritableObservable', ko.isWriteableObservable);
          ko.exportSymbol('observable.fn', observableFn);
          ko.exportProperty(observableFn, 'peek', observableFn.peek);
          ko.exportProperty(observableFn, 'valueHasMutated', observableFn.valueHasMutated);
          ko.exportProperty(observableFn, 'valueWillMutate', observableFn.valueWillMutate);
          ko.observableArray = function (initialValues) {
            initialValues = initialValues || [];
            if (typeof initialValues != 'object' || !('length' in initialValues)) throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
            var result = ko.observable(initialValues);
            ko.utils.setPrototypeOfOrExtend(result, ko.observableArray['fn']);
            return result.extend({ 'trackArrayChanges': true });
          };
          ko.observableArray['fn'] = {
            'remove': function (valueOrPredicate) {
              var underlyingArray = this.peek();
              var removedValues = [];
              var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) {
                return value === valueOrPredicate;
              };
              for (var i = 0; i < underlyingArray.length; i++) {
                var value = underlyingArray[i];
                if (predicate(value)) {
                  if (removedValues.length === 0) {
                    this.valueWillMutate();
                  }
                  removedValues.push(value);
                  underlyingArray.splice(i, 1);
                  i--;
                }
              }
              if (removedValues.length) {
                this.valueHasMutated();
              }
              return removedValues;
            },
            'removeAll': function (arrayOfValues) {
              if (arrayOfValues === undefined) {
                var underlyingArray = this.peek();
                var allValues = underlyingArray.slice(0);
                this.valueWillMutate();
                underlyingArray.splice(0, underlyingArray.length);
                this.valueHasMutated();
                return allValues;
              }
              if (!arrayOfValues) return [];
              return this['remove'](function (value) {
                return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
              });
            },
            'destroy': function (valueOrPredicate) {
              var underlyingArray = this.peek();
              var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) {
                return value === valueOrPredicate;
              };
              this.valueWillMutate();
              for (var i = underlyingArray.length - 1; i >= 0; i--) {
                var value = underlyingArray[i];
                if (predicate(value)) underlyingArray[i]["_destroy"] = true;
              }
              this.valueHasMutated();
            },
            'destroyAll': function (arrayOfValues) {
              if (arrayOfValues === undefined) return this['destroy'](function () {
                return true;
              });
              if (!arrayOfValues) return [];
              return this['destroy'](function (value) {
                return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
              });
            },
            'indexOf': function (item) {
              var underlyingArray = this();
              return ko.utils.arrayIndexOf(underlyingArray, item);
            },
            'replace': function (oldItem, newItem) {
              var index = this['indexOf'](oldItem);
              if (index >= 0) {
                this.valueWillMutate();
                this.peek()[index] = newItem;
                this.valueHasMutated();
              }
            }
          };
          if (ko.utils.canSetPrototype) {
            ko.utils.setPrototypeOf(ko.observableArray['fn'], ko.observable['fn']);
          }
          ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
            ko.observableArray['fn'][methodName] = function () {
              var underlyingArray = this.peek();
              this.valueWillMutate();
              this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
              var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
              this.valueHasMutated();
              return methodCallResult === underlyingArray ? this : methodCallResult;
            };
          });
          ko.utils.arrayForEach(["slice"], function (methodName) {
            ko.observableArray['fn'][methodName] = function () {
              var underlyingArray = this();
              return underlyingArray[methodName].apply(underlyingArray, arguments);
            };
          });
          ko.exportSymbol('observableArray', ko.observableArray);
          var arrayChangeEventName = 'arrayChange';
          ko.extenders['trackArrayChanges'] = function (target, options) {
            target.compareArrayOptions = {};
            if (options && typeof options == "object") {
              ko.utils.extend(target.compareArrayOptions, options);
            }
            target.compareArrayOptions['sparse'] = true;
            if (target.cacheDiffForKnownOperation) {
              return;
            }
            var trackingChanges = false,
                cachedDiff = null,
                arrayChangeSubscription,
                pendingNotifications = 0,
                underlyingBeforeSubscriptionAddFunction = target.beforeSubscriptionAdd,
                underlyingAfterSubscriptionRemoveFunction = target.afterSubscriptionRemove;
            target.beforeSubscriptionAdd = function (event) {
              if (underlyingBeforeSubscriptionAddFunction) underlyingBeforeSubscriptionAddFunction.call(target, event);
              if (event === arrayChangeEventName) {
                trackChanges();
              }
            };
            target.afterSubscriptionRemove = function (event) {
              if (underlyingAfterSubscriptionRemoveFunction) underlyingAfterSubscriptionRemoveFunction.call(target, event);
              if (event === arrayChangeEventName && !target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                arrayChangeSubscription.dispose();
                trackingChanges = false;
              }
            };
            function trackChanges() {
              if (trackingChanges) {
                return;
              }
              trackingChanges = true;
              var underlyingNotifySubscribersFunction = target['notifySubscribers'];
              target['notifySubscribers'] = function (valueToNotify, event) {
                if (!event || event === defaultEvent) {
                  ++pendingNotifications;
                }
                return underlyingNotifySubscribersFunction.apply(this, arguments);
              };
              var previousContents = [].concat(target.peek() || []);
              cachedDiff = null;
              arrayChangeSubscription = target.subscribe(function (currentContents) {
                currentContents = [].concat(currentContents || []);
                if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                  var changes = getChanges(previousContents, currentContents);
                }
                previousContents = currentContents;
                cachedDiff = null;
                pendingNotifications = 0;
                if (changes && changes.length) {
                  target['notifySubscribers'](changes, arrayChangeEventName);
                }
              });
            }
            function getChanges(previousContents, currentContents) {
              if (!cachedDiff || pendingNotifications > 1) {
                cachedDiff = ko.utils.compareArrays(previousContents, currentContents, target.compareArrayOptions);
              }
              return cachedDiff;
            }
            target.cacheDiffForKnownOperation = function (rawArray, operationName, args) {
              if (!trackingChanges || pendingNotifications) {
                return;
              }
              var diff = [],
                  arrayLength = rawArray.length,
                  argsLength = args.length,
                  offset = 0;
              function pushDiff(status, value, index) {
                return diff[diff.length] = {
                  'status': status,
                  'value': value,
                  'index': index
                };
              }
              switch (operationName) {
                case 'push':
                  offset = arrayLength;
                case 'unshift':
                  for (var index = 0; index < argsLength; index++) {
                    pushDiff('added', args[index], offset + index);
                  }
                  break;
                case 'pop':
                  offset = arrayLength - 1;
                case 'shift':
                  if (arrayLength) {
                    pushDiff('deleted', rawArray[offset], offset);
                  }
                  break;
                case 'splice':
                  var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
                      endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
                      endAddIndex = startIndex + argsLength - 2,
                      endIndex = Math.max(endDeleteIndex, endAddIndex),
                      additions = [],
                      deletions = [];
                  for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
                    if (index < endDeleteIndex) deletions.push(pushDiff('deleted', rawArray[index], index));
                    if (index < endAddIndex) additions.push(pushDiff('added', args[argsIndex], index));
                  }
                  ko.utils.findMovesInArrayComparison(deletions, additions);
                  break;
                default:
                  return;
              }
              cachedDiff = diff;
            };
          };
          var computedState = ko.utils.createSymbolOrString('_state');
          ko.computed = ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
            if (typeof evaluatorFunctionOrOptions === "object") {
              options = evaluatorFunctionOrOptions;
            } else {
              options = options || {};
              if (evaluatorFunctionOrOptions) {
                options["read"] = evaluatorFunctionOrOptions;
              }
            }
            if (typeof options["read"] != "function") throw Error("Pass a function that returns the value of the ko.computed");
            var writeFunction = options["write"];
            var state = {
              latestValue: undefined,
              isStale: true,
              isBeingEvaluated: false,
              suppressDisposalUntilDisposeWhenReturnsFalse: false,
              isDisposed: false,
              pure: false,
              isSleeping: false,
              readFunction: options["read"],
              evaluatorFunctionTarget: evaluatorFunctionTarget || options["owner"],
              disposeWhenNodeIsRemoved: options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
              disposeWhen: options["disposeWhen"] || options.disposeWhen,
              domNodeDisposalCallback: null,
              dependencyTracking: {},
              dependenciesCount: 0,
              evaluationTimeoutInstance: null
            };
            function computedObservable() {
              if (arguments.length > 0) {
                if (typeof writeFunction === "function") {
                  writeFunction.apply(state.evaluatorFunctionTarget, arguments);
                } else {
                  throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
                }
                return this;
              } else {
                ko.dependencyDetection.registerDependency(computedObservable);
                if (state.isStale || state.isSleeping && computedObservable.haveDependenciesChanged()) {
                  computedObservable.evaluateImmediate();
                }
                return state.latestValue;
              }
            }
            computedObservable[computedState] = state;
            computedObservable.hasWriteFunction = typeof writeFunction === "function";
            if (!ko.utils.canSetPrototype) {
              ko.utils.extend(computedObservable, ko.subscribable['fn']);
            }
            ko.subscribable['fn'].init(computedObservable);
            ko.utils.setPrototypeOfOrExtend(computedObservable, computedFn);
            if (options['pure']) {
              state.pure = true;
              state.isSleeping = true;
              ko.utils.extend(computedObservable, pureComputedOverrides);
            } else if (options['deferEvaluation']) {
              ko.utils.extend(computedObservable, deferEvaluationOverrides);
            }
            if (ko.options['deferUpdates']) {
              ko.extenders['deferred'](computedObservable, true);
            }
            if (DEBUG) {
              computedObservable["_options"] = options;
            }
            if (state.disposeWhenNodeIsRemoved) {
              state.suppressDisposalUntilDisposeWhenReturnsFalse = true;
              if (!state.disposeWhenNodeIsRemoved.nodeType) {
                state.disposeWhenNodeIsRemoved = null;
              }
            }
            if (!state.isSleeping && !options['deferEvaluation']) {
              computedObservable.evaluateImmediate();
            }
            if (state.disposeWhenNodeIsRemoved && computedObservable.isActive()) {
              ko.utils.domNodeDisposal.addDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback = function () {
                computedObservable.dispose();
              });
            }
            return computedObservable;
          };
          function computedDisposeDependencyCallback(id, entryToDispose) {
            if (entryToDispose !== null && entryToDispose.dispose) {
              entryToDispose.dispose();
            }
          }
          function computedBeginDependencyDetectionCallback(subscribable, id) {
            var computedObservable = this.computedObservable,
                state = computedObservable[computedState];
            if (!state.isDisposed) {
              if (this.disposalCount && this.disposalCandidates[id]) {
                computedObservable.addDependencyTracking(id, subscribable, this.disposalCandidates[id]);
                this.disposalCandidates[id] = null;
                --this.disposalCount;
              } else if (!state.dependencyTracking[id]) {
                computedObservable.addDependencyTracking(id, subscribable, state.isSleeping ? { _target: subscribable } : computedObservable.subscribeToDependency(subscribable));
              }
            }
          }
          var computedFn = {
            "equalityComparer": valuesArePrimitiveAndEqual,
            getDependenciesCount: function () {
              return this[computedState].dependenciesCount;
            },
            addDependencyTracking: function (id, target, trackingObj) {
              if (this[computedState].pure && target === this) {
                throw Error("A 'pure' computed must not be called recursively");
              }
              this[computedState].dependencyTracking[id] = trackingObj;
              trackingObj._order = this[computedState].dependenciesCount++;
              trackingObj._version = target.getVersion();
            },
            haveDependenciesChanged: function () {
              var id,
                  dependency,
                  dependencyTracking = this[computedState].dependencyTracking;
              for (id in dependencyTracking) {
                if (dependencyTracking.hasOwnProperty(id)) {
                  dependency = dependencyTracking[id];
                  if (dependency._target.hasChanged(dependency._version)) {
                    return true;
                  }
                }
              }
            },
            markDirty: function () {
              if (this._evalDelayed && !this[computedState].isBeingEvaluated) {
                this._evalDelayed();
              }
            },
            isActive: function () {
              return this[computedState].isStale || this[computedState].dependenciesCount > 0;
            },
            respondToChange: function () {
              if (!this._notificationIsPending) {
                this.evaluatePossiblyAsync();
              }
            },
            subscribeToDependency: function (target) {
              if (target._deferUpdates && !this[computedState].disposeWhenNodeIsRemoved) {
                var dirtySub = target.subscribe(this.markDirty, this, 'dirty'),
                    changeSub = target.subscribe(this.respondToChange, this);
                return {
                  _target: target,
                  dispose: function () {
                    dirtySub.dispose();
                    changeSub.dispose();
                  }
                };
              } else {
                return target.subscribe(this.evaluatePossiblyAsync, this);
              }
            },
            evaluatePossiblyAsync: function () {
              var computedObservable = this,
                  throttleEvaluationTimeout = computedObservable['throttleEvaluation'];
              if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
                clearTimeout(this[computedState].evaluationTimeoutInstance);
                this[computedState].evaluationTimeoutInstance = ko.utils.setTimeout(function () {
                  computedObservable.evaluateImmediate(true);
                }, throttleEvaluationTimeout);
              } else if (computedObservable._evalDelayed) {
                computedObservable._evalDelayed();
              } else {
                computedObservable.evaluateImmediate(true);
              }
            },
            evaluateImmediate: function (notifyChange) {
              var computedObservable = this,
                  state = computedObservable[computedState],
                  disposeWhen = state.disposeWhen;
              if (state.isBeingEvaluated) {
                return;
              }
              if (state.isDisposed) {
                return;
              }
              if (state.disposeWhenNodeIsRemoved && !ko.utils.domNodeIsAttachedToDocument(state.disposeWhenNodeIsRemoved) || disposeWhen && disposeWhen()) {
                if (!state.suppressDisposalUntilDisposeWhenReturnsFalse) {
                  computedObservable.dispose();
                  return;
                }
              } else {
                state.suppressDisposalUntilDisposeWhenReturnsFalse = false;
              }
              state.isBeingEvaluated = true;
              try {
                this.evaluateImmediate_CallReadWithDependencyDetection(notifyChange);
              } finally {
                state.isBeingEvaluated = false;
              }
              if (!state.dependenciesCount) {
                computedObservable.dispose();
              }
            },
            evaluateImmediate_CallReadWithDependencyDetection: function (notifyChange) {
              var computedObservable = this,
                  state = computedObservable[computedState];
              var isInitial = state.pure ? undefined : !state.dependenciesCount,
                  dependencyDetectionContext = {
                computedObservable: computedObservable,
                disposalCandidates: state.dependencyTracking,
                disposalCount: state.dependenciesCount
              };
              ko.dependencyDetection.begin({
                callbackTarget: dependencyDetectionContext,
                callback: computedBeginDependencyDetectionCallback,
                computed: computedObservable,
                isInitial: isInitial
              });
              state.dependencyTracking = {};
              state.dependenciesCount = 0;
              var newValue = this.evaluateImmediate_CallReadThenEndDependencyDetection(state, dependencyDetectionContext);
              if (computedObservable.isDifferent(state.latestValue, newValue)) {
                if (!state.isSleeping) {
                  computedObservable["notifySubscribers"](state.latestValue, "beforeChange");
                }
                state.latestValue = newValue;
                if (state.isSleeping) {
                  computedObservable.updateVersion();
                } else if (notifyChange) {
                  computedObservable["notifySubscribers"](state.latestValue);
                }
              }
              if (isInitial) {
                computedObservable["notifySubscribers"](state.latestValue, "awake");
              }
            },
            evaluateImmediate_CallReadThenEndDependencyDetection: function (state, dependencyDetectionContext) {
              try {
                var readFunction = state.readFunction;
                return state.evaluatorFunctionTarget ? readFunction.call(state.evaluatorFunctionTarget) : readFunction();
              } finally {
                ko.dependencyDetection.end();
                if (dependencyDetectionContext.disposalCount && !state.isSleeping) {
                  ko.utils.objectForEach(dependencyDetectionContext.disposalCandidates, computedDisposeDependencyCallback);
                }
                state.isStale = false;
              }
            },
            peek: function () {
              var state = this[computedState];
              if (state.isStale && !state.dependenciesCount || state.isSleeping && this.haveDependenciesChanged()) {
                this.evaluateImmediate();
              }
              return state.latestValue;
            },
            limit: function (limitFunction) {
              ko.subscribable['fn'].limit.call(this, limitFunction);
              this._evalDelayed = function () {
                this._limitBeforeChange(this[computedState].latestValue);
                this[computedState].isStale = true;
                this._limitChange(this);
              };
            },
            dispose: function () {
              var state = this[computedState];
              if (!state.isSleeping && state.dependencyTracking) {
                ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                  if (dependency.dispose) dependency.dispose();
                });
              }
              if (state.disposeWhenNodeIsRemoved && state.domNodeDisposalCallback) {
                ko.utils.domNodeDisposal.removeDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback);
              }
              state.dependencyTracking = null;
              state.dependenciesCount = 0;
              state.isDisposed = true;
              state.isStale = false;
              state.isSleeping = false;
              state.disposeWhenNodeIsRemoved = null;
            }
          };
          var pureComputedOverrides = {
            beforeSubscriptionAdd: function (event) {
              var computedObservable = this,
                  state = computedObservable[computedState];
              if (!state.isDisposed && state.isSleeping && event == 'change') {
                state.isSleeping = false;
                if (state.isStale || computedObservable.haveDependenciesChanged()) {
                  state.dependencyTracking = null;
                  state.dependenciesCount = 0;
                  state.isStale = true;
                  computedObservable.evaluateImmediate();
                } else {
                  var dependeciesOrder = [];
                  ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                    dependeciesOrder[dependency._order] = id;
                  });
                  ko.utils.arrayForEach(dependeciesOrder, function (id, order) {
                    var dependency = state.dependencyTracking[id],
                        subscription = computedObservable.subscribeToDependency(dependency._target);
                    subscription._order = order;
                    subscription._version = dependency._version;
                    state.dependencyTracking[id] = subscription;
                  });
                }
                if (!state.isDisposed) {
                  computedObservable["notifySubscribers"](state.latestValue, "awake");
                }
              }
            },
            afterSubscriptionRemove: function (event) {
              var state = this[computedState];
              if (!state.isDisposed && event == 'change' && !this.hasSubscriptionsForEvent('change')) {
                ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                  if (dependency.dispose) {
                    state.dependencyTracking[id] = {
                      _target: dependency._target,
                      _order: dependency._order,
                      _version: dependency._version
                    };
                    dependency.dispose();
                  }
                });
                state.isSleeping = true;
                this["notifySubscribers"](undefined, "asleep");
              }
            },
            getVersion: function () {
              var state = this[computedState];
              if (state.isSleeping && (state.isStale || this.haveDependenciesChanged())) {
                this.evaluateImmediate();
              }
              return ko.subscribable['fn'].getVersion.call(this);
            }
          };
          var deferEvaluationOverrides = { beforeSubscriptionAdd: function (event) {
              if (event == 'change' || event == 'beforeChange') {
                this.peek();
              }
            } };
          if (ko.utils.canSetPrototype) {
            ko.utils.setPrototypeOf(computedFn, ko.subscribable['fn']);
          }
          var protoProp = ko.observable.protoProperty;
          ko.computed[protoProp] = ko.observable;
          computedFn[protoProp] = ko.computed;
          ko.isComputed = function (instance) {
            return ko.hasPrototype(instance, ko.computed);
          };
          ko.isPureComputed = function (instance) {
            return ko.hasPrototype(instance, ko.computed) && instance[computedState] && instance[computedState].pure;
          };
          ko.exportSymbol('computed', ko.computed);
          ko.exportSymbol('dependentObservable', ko.computed);
          ko.exportSymbol('isComputed', ko.isComputed);
          ko.exportSymbol('isPureComputed', ko.isPureComputed);
          ko.exportSymbol('computed.fn', computedFn);
          ko.exportProperty(computedFn, 'peek', computedFn.peek);
          ko.exportProperty(computedFn, 'dispose', computedFn.dispose);
          ko.exportProperty(computedFn, 'isActive', computedFn.isActive);
          ko.exportProperty(computedFn, 'getDependenciesCount', computedFn.getDependenciesCount);
          ko.pureComputed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
            if (typeof evaluatorFunctionOrOptions === 'function') {
              return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, { 'pure': true });
            } else {
              evaluatorFunctionOrOptions = ko.utils.extend({}, evaluatorFunctionOrOptions);
              evaluatorFunctionOrOptions['pure'] = true;
              return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
            }
          };
          ko.exportSymbol('pureComputed', ko.pureComputed);
          (function () {
            var maxNestedObservableDepth = 10;
            ko.toJS = function (rootObject) {
              if (arguments.length == 0) throw new Error("When calling ko.toJS, pass the object you want to convert.");
              return mapJsObjectGraph(rootObject, function (valueToMap) {
                for (var i = 0; ko.isObservable(valueToMap) && i < maxNestedObservableDepth; i++) valueToMap = valueToMap();
                return valueToMap;
              });
            };
            ko.toJSON = function (rootObject, replacer, space) {
              var plainJavaScriptObject = ko.toJS(rootObject);
              return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
            };
            function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
              visitedObjects = visitedObjects || new objectLookup();
              rootObject = mapInputCallback(rootObject);
              var canHaveProperties = typeof rootObject == "object" && rootObject !== null && rootObject !== undefined && !(rootObject instanceof RegExp) && !(rootObject instanceof Date) && !(rootObject instanceof String) && !(rootObject instanceof Number) && !(rootObject instanceof Boolean);
              if (!canHaveProperties) return rootObject;
              var outputProperties = rootObject instanceof Array ? [] : {};
              visitedObjects.save(rootObject, outputProperties);
              visitPropertiesOrArrayEntries(rootObject, function (indexer) {
                var propertyValue = mapInputCallback(rootObject[indexer]);
                switch (typeof propertyValue) {
                  case "boolean":
                  case "number":
                  case "string":
                  case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                  case "object":
                  case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = previouslyMappedValue !== undefined ? previouslyMappedValue : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
                }
              });
              return outputProperties;
            }
            function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
              if (rootObject instanceof Array) {
                for (var i = 0; i < rootObject.length; i++) visitorCallback(i);
                if (typeof rootObject['toJSON'] == 'function') visitorCallback('toJSON');
              } else {
                for (var propertyName in rootObject) {
                  visitorCallback(propertyName);
                }
              }
            }
            ;
            function objectLookup() {
              this.keys = [];
              this.values = [];
            }
            ;
            objectLookup.prototype = {
              constructor: objectLookup,
              save: function (key, value) {
                var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
                if (existingIndex >= 0) this.values[existingIndex] = value;else {
                  this.keys.push(key);
                  this.values.push(value);
                }
              },
              get: function (key) {
                var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
                return existingIndex >= 0 ? this.values[existingIndex] : undefined;
              }
            };
          })();
          ko.exportSymbol('toJS', ko.toJS);
          ko.exportSymbol('toJSON', ko.toJSON);
          (function () {
            var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';
            ko.selectExtensions = {
              readValue: function (element) {
                switch (ko.utils.tagNameLower(element)) {
                  case 'option':
                    if (element[hasDomDataExpandoProperty] === true) return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return ko.utils.ieVersion <= 7 ? element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text : element.value;
                  case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                  default:
                    return element.value;
                }
              },
              writeValue: function (element, value, allowUnset) {
                switch (ko.utils.tagNameLower(element)) {
                  case 'option':
                    switch (typeof value) {
                      case "string":
                        ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                        if (hasDomDataExpandoProperty in element) {
                          delete element[hasDomDataExpandoProperty];
                        }
                        element.value = value;
                        break;
                      default:
                        ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                        element[hasDomDataExpandoProperty] = true;
                        element.value = typeof value === "number" ? value : "";
                        break;
                    }
                    break;
                  case 'select':
                    if (value === "" || value === null) value = undefined;
                    var selection = -1;
                    for (var i = 0, n = element.options.length, optionValue; i < n; ++i) {
                      optionValue = ko.selectExtensions.readValue(element.options[i]);
                      if (optionValue == value || optionValue == "" && value === undefined) {
                        selection = i;
                        break;
                      }
                    }
                    if (allowUnset || selection >= 0 || value === undefined && element.size > 1) {
                      element.selectedIndex = selection;
                    }
                    break;
                  default:
                    if (value === null || value === undefined) value = "";
                    element.value = value;
                    break;
                }
              }
            };
          })();
          ko.exportSymbol('selectExtensions', ko.selectExtensions);
          ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
          ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
          ko.expressionRewriting = function () {
            var javaScriptReservedWords = ["true", "false", "null", "undefined"];
            var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;
            function getWriteableValue(expression) {
              if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0) return false;
              var match = expression.match(javaScriptAssignmentTarget);
              return match === null ? false : match[1] ? 'Object(' + match[1] + ')' + match[2] : expression;
            }
            var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
                stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
                stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
                specials = ',"\'{}()/:[\\]',
                everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
                oneNotSpace = '[^\\s]',
                bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),
                divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
                keywordRegexLookBehind = {
              'in': 1,
              'return': 1,
              'typeof': 1
            };
            function parseObjectLiteral(objectLiteralString) {
              var str = ko.utils.stringTrim(objectLiteralString);
              if (str.charCodeAt(0) === 123) str = str.slice(1, -1);
              var result = [],
                  toks = str.match(bindingToken),
                  key,
                  values = [],
                  depth = 0;
              if (toks) {
                toks.push(',');
                for (var i = 0, tok; tok = toks[i]; ++i) {
                  var c = tok.charCodeAt(0);
                  if (c === 44) {
                    if (depth <= 0) {
                      result.push(key && values.length ? {
                        key: key,
                        value: values.join('')
                      } : { 'unknown': key || values.join('') });
                      key = depth = 0;
                      values = [];
                      continue;
                    }
                  } else if (c === 58) {
                    if (!depth && !key && values.length === 1) {
                      key = values.pop();
                      continue;
                    }
                  } else if (c === 47 && i && tok.length > 1) {
                    var match = toks[i - 1].match(divisionLookBehind);
                    if (match && !keywordRegexLookBehind[match[0]]) {
                      str = str.substr(str.indexOf(tok) + 1);
                      toks = str.match(bindingToken);
                      toks.push(',');
                      i = -1;
                      tok = '/';
                    }
                  } else if (c === 40 || c === 123 || c === 91) {
                    ++depth;
                  } else if (c === 41 || c === 125 || c === 93) {
                    --depth;
                  } else if (!key && !values.length && (c === 34 || c === 39)) {
                    tok = tok.slice(1, -1);
                  }
                  values.push(tok);
                }
              }
              return result;
            }
            var twoWayBindings = {};
            function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
              bindingOptions = bindingOptions || {};
              function processKeyValue(key, val) {
                var writableVal;
                function callPreprocessHook(obj) {
                  return obj && obj['preprocess'] ? val = obj['preprocess'](val, key, processKeyValue) : true;
                }
                if (!bindingParams) {
                  if (!callPreprocessHook(ko['getBindingHandler'](key))) return;
                  if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
                    propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
                  }
                }
                if (makeValueAccessors) {
                  val = 'function(){return ' + val + ' }';
                }
                resultStrings.push("'" + key + "':" + val);
              }
              var resultStrings = [],
                  propertyAccessorResultStrings = [],
                  makeValueAccessors = bindingOptions['valueAccessors'],
                  bindingParams = bindingOptions['bindingParams'],
                  keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ? parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;
              ko.utils.arrayForEach(keyValueArray, function (keyValue) {
                processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
              });
              if (propertyAccessorResultStrings.length) processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + " }");
              return resultStrings.join(",");
            }
            return {
              bindingRewriteValidators: [],
              twoWayBindings: twoWayBindings,
              parseObjectLiteral: parseObjectLiteral,
              preProcessBindings: preProcessBindings,
              keyValueArrayContainsKey: function (keyValueArray, key) {
                for (var i = 0; i < keyValueArray.length; i++) if (keyValueArray[i]['key'] == key) return true;
                return false;
              },
              writeValueToProperty: function (property, allBindings, key, value, checkIfDifferent) {
                if (!property || !ko.isObservable(property)) {
                  var propWriters = allBindings.get('_ko_property_writers');
                  if (propWriters && propWriters[key]) propWriters[key](value);
                } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
                  property(value);
                }
              }
            };
          }();
          ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
          ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
          ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
          ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);
          ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);
          ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
          ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
          (function () {
            var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";
            var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
            var endCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
            var htmlTagsWithOptionallyClosingChildren = {
              'ul': true,
              'ol': true
            };
            function isStartComment(node) {
              return node.nodeType == 8 && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
            }
            function isEndComment(node) {
              return node.nodeType == 8 && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
            }
            function getVirtualChildren(startComment, allowUnbalanced) {
              var currentNode = startComment;
              var depth = 1;
              var children = [];
              while (currentNode = currentNode.nextSibling) {
                if (isEndComment(currentNode)) {
                  depth--;
                  if (depth === 0) return children;
                }
                children.push(currentNode);
                if (isStartComment(currentNode)) depth++;
              }
              if (!allowUnbalanced) throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
              return null;
            }
            function getMatchingEndComment(startComment, allowUnbalanced) {
              var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
              if (allVirtualChildren) {
                if (allVirtualChildren.length > 0) return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
                return startComment.nextSibling;
              } else return null;
            }
            function getUnbalancedChildTags(node) {
              var childNode = node.firstChild,
                  captureRemaining = null;
              if (childNode) {
                do {
                  if (captureRemaining) captureRemaining.push(childNode);else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, true);
                    if (matchingEndComment) childNode = matchingEndComment;else captureRemaining = [childNode];
                  } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];
                  }
                } while (childNode = childNode.nextSibling);
              }
              return captureRemaining;
            }
            ko.virtualElements = {
              allowedBindings: {},
              childNodes: function (node) {
                return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
              },
              emptyNode: function (node) {
                if (!isStartComment(node)) ko.utils.emptyDomNode(node);else {
                  var virtualChildren = ko.virtualElements.childNodes(node);
                  for (var i = 0, j = virtualChildren.length; i < j; i++) ko.removeNode(virtualChildren[i]);
                }
              },
              setDomNodeChildren: function (node, childNodes) {
                if (!isStartComment(node)) ko.utils.setDomNodeChildren(node, childNodes);else {
                  ko.virtualElements.emptyNode(node);
                  var endCommentNode = node.nextSibling;
                  for (var i = 0, j = childNodes.length; i < j; i++) endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
                }
              },
              prepend: function (containerNode, nodeToPrepend) {
                if (!isStartComment(containerNode)) {
                  if (containerNode.firstChild) containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);else containerNode.appendChild(nodeToPrepend);
                } else {
                  containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
                }
              },
              insertAfter: function (containerNode, nodeToInsert, insertAfterNode) {
                if (!insertAfterNode) {
                  ko.virtualElements.prepend(containerNode, nodeToInsert);
                } else if (!isStartComment(containerNode)) {
                  if (insertAfterNode.nextSibling) containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);else containerNode.appendChild(nodeToInsert);
                } else {
                  containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                }
              },
              firstChild: function (node) {
                if (!isStartComment(node)) return node.firstChild;
                if (!node.nextSibling || isEndComment(node.nextSibling)) return null;
                return node.nextSibling;
              },
              nextSibling: function (node) {
                if (isStartComment(node)) node = getMatchingEndComment(node);
                if (node.nextSibling && isEndComment(node.nextSibling)) return null;
                return node.nextSibling;
              },
              hasBindingValue: isStartComment,
              virtualNodeBindingValue: function (node) {
                var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
                return regexMatch ? regexMatch[1] : null;
              },
              normaliseVirtualElementDomStructure: function (elementVerified) {
                if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)]) return;
                var childNode = elementVerified.firstChild;
                if (childNode) {
                  do {
                    if (childNode.nodeType === 1) {
                      var unbalancedTags = getUnbalancedChildTags(childNode);
                      if (unbalancedTags) {
                        var nodeToInsertBefore = childNode.nextSibling;
                        for (var i = 0; i < unbalancedTags.length; i++) {
                          if (nodeToInsertBefore) elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);else elementVerified.appendChild(unbalancedTags[i]);
                        }
                      }
                    }
                  } while (childNode = childNode.nextSibling);
                }
              }
            };
          })();
          ko.exportSymbol('virtualElements', ko.virtualElements);
          ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
          ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
          ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
          ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
          ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
          (function () {
            var defaultBindingAttributeName = "data-bind";
            ko.bindingProvider = function () {
              this.bindingCache = {};
            };
            ko.utils.extend(ko.bindingProvider.prototype, {
              'nodeHasBindings': function (node) {
                switch (node.nodeType) {
                  case 1:
                    return node.getAttribute(defaultBindingAttributeName) != null || ko.components['getComponentNameForNode'](node);
                  case 8:
                    return ko.virtualElements.hasBindingValue(node);
                  default:
                    return false;
                }
              },
              'getBindings': function (node, bindingContext) {
                var bindingsString = this['getBindingsString'](node, bindingContext),
                    parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
                return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, false);
              },
              'getBindingAccessors': function (node, bindingContext) {
                var bindingsString = this['getBindingsString'](node, bindingContext),
                    parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
                return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, true);
              },
              'getBindingsString': function (node, bindingContext) {
                switch (node.nodeType) {
                  case 1:
                    return node.getAttribute(defaultBindingAttributeName);
                  case 8:
                    return ko.virtualElements.virtualNodeBindingValue(node);
                  default:
                    return null;
                }
              },
              'parseBindingsString': function (bindingsString, bindingContext, node, options) {
                try {
                  var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
                  return bindingFunction(bindingContext, node);
                } catch (ex) {
                  ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
                  throw ex;
                }
              }
            });
            ko.bindingProvider['instance'] = new ko.bindingProvider();
            function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
              var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
              return cache[cacheKey] || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
            }
            function createBindingsStringEvaluator(bindingsString, options) {
              var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
                  functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
              return new Function("$context", "$element", functionBody);
            }
          })();
          ko.exportSymbol('bindingProvider', ko.bindingProvider);
          (function () {
            ko.bindingHandlers = {};
            var bindingDoesNotRecurseIntoElementTypes = {
              'script': true,
              'textarea': true,
              'template': true
            };
            ko['getBindingHandler'] = function (bindingKey) {
              return ko.bindingHandlers[bindingKey];
            };
            ko.bindingContext = function (dataItemOrAccessor, parentContext, dataItemAlias, extendCallback) {
              function updateContext() {
                var dataItemOrObservable = isFunc ? dataItemOrAccessor() : dataItemOrAccessor,
                    dataItem = ko.utils.unwrapObservable(dataItemOrObservable);
                if (parentContext) {
                  if (parentContext._subscribable) parentContext._subscribable();
                  ko.utils.extend(self, parentContext);
                  if (subscribable) {
                    self._subscribable = subscribable;
                  }
                } else {
                  self['$parents'] = [];
                  self['$root'] = dataItem;
                  self['ko'] = ko;
                }
                self['$rawData'] = dataItemOrObservable;
                self['$data'] = dataItem;
                if (dataItemAlias) self[dataItemAlias] = dataItem;
                if (extendCallback) extendCallback(self, parentContext, dataItem);
                return self['$data'];
              }
              function disposeWhen() {
                return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
              }
              var self = this,
                  isFunc = typeof dataItemOrAccessor == "function" && !ko.isObservable(dataItemOrAccessor),
                  nodes,
                  subscribable = ko.dependentObservable(updateContext, null, {
                disposeWhen: disposeWhen,
                disposeWhenNodeIsRemoved: true
              });
              if (subscribable.isActive()) {
                self._subscribable = subscribable;
                subscribable['equalityComparer'] = null;
                nodes = [];
                subscribable._addNode = function (node) {
                  nodes.push(node);
                  ko.utils.domNodeDisposal.addDisposeCallback(node, function (node) {
                    ko.utils.arrayRemoveItem(nodes, node);
                    if (!nodes.length) {
                      subscribable.dispose();
                      self._subscribable = subscribable = undefined;
                    }
                  });
                };
              }
            };
            ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback) {
              return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function (self, parentContext) {
                self['$parentContext'] = parentContext;
                self['$parent'] = parentContext['$data'];
                self['$parents'] = (parentContext['$parents'] || []).slice(0);
                self['$parents'].unshift(self['$parent']);
                if (extendCallback) extendCallback(self);
              });
            };
            ko.bindingContext.prototype['extend'] = function (properties) {
              return new ko.bindingContext(this._subscribable || this['$data'], this, null, function (self, parentContext) {
                self['$rawData'] = parentContext['$rawData'];
                ko.utils.extend(self, typeof properties == "function" ? properties() : properties);
              });
            };
            function makeValueAccessor(value) {
              return function () {
                return value;
              };
            }
            function evaluateValueAccessor(valueAccessor) {
              return valueAccessor();
            }
            function makeAccessorsFromFunction(callback) {
              return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function (value, key) {
                return function () {
                  return callback()[key];
                };
              });
            }
            function makeBindingAccessors(bindings, context, node) {
              if (typeof bindings === 'function') {
                return makeAccessorsFromFunction(bindings.bind(null, context, node));
              } else {
                return ko.utils.objectMap(bindings, makeValueAccessor);
              }
            }
            function getBindingsAndMakeAccessors(node, context) {
              return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
            }
            function validateThatBindingIsAllowedForVirtualElements(bindingName) {
              var validator = ko.virtualElements.allowedBindings[bindingName];
              if (!validator) throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements");
            }
            function applyBindingsToDescendantsInternal(bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
              var currentChild,
                  nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
                  provider = ko.bindingProvider['instance'],
                  preprocessNode = provider['preprocessNode'];
              if (preprocessNode) {
                while (currentChild = nextInQueue) {
                  nextInQueue = ko.virtualElements.nextSibling(currentChild);
                  preprocessNode.call(provider, currentChild);
                }
                nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
              }
              while (currentChild = nextInQueue) {
                nextInQueue = ko.virtualElements.nextSibling(currentChild);
                applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
              }
            }
            function applyBindingsToNodeAndDescendantsInternal(bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
              var shouldBindDescendants = true;
              var isElement = nodeVerified.nodeType === 1;
              if (isElement) ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);
              var shouldApplyBindings = isElement && bindingContextMayDifferFromDomParentElement || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);
              if (shouldApplyBindings) shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];
              if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
                applyBindingsToDescendantsInternal(bindingContext, nodeVerified, !isElement);
              }
            }
            var boundElementDomDataKey = ko.utils.domData.nextKey();
            function topologicalSortBindings(bindings) {
              var result = [],
                  bindingsConsidered = {},
                  cyclicDependencyStack = [];
              ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
                if (!bindingsConsidered[bindingKey]) {
                  var binding = ko['getBindingHandler'](bindingKey);
                  if (binding) {
                    if (binding['after']) {
                      cyclicDependencyStack.push(bindingKey);
                      ko.utils.arrayForEach(binding['after'], function (bindingDependencyKey) {
                        if (bindings[bindingDependencyKey]) {
                          if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
                            throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
                          } else {
                            pushBinding(bindingDependencyKey);
                          }
                        }
                      });
                      cyclicDependencyStack.length--;
                    }
                    result.push({
                      key: bindingKey,
                      handler: binding
                    });
                  }
                  bindingsConsidered[bindingKey] = true;
                }
              });
              return result;
            }
            function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
              var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
              if (!sourceBindings) {
                if (alreadyBound) {
                  throw Error("You cannot apply bindings multiple times to the same element.");
                }
                ko.utils.domData.set(node, boundElementDomDataKey, true);
              }
              if (!alreadyBound && bindingContextMayDifferFromDomParentElement) ko.storedBindingContextForNode(node, bindingContext);
              var bindings;
              if (sourceBindings && typeof sourceBindings !== 'function') {
                bindings = sourceBindings;
              } else {
                var provider = ko.bindingProvider['instance'],
                    getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;
                var bindingsUpdater = ko.dependentObservable(function () {
                  bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
                  if (bindings && bindingContext._subscribable) bindingContext._subscribable();
                  return bindings;
                }, null, { disposeWhenNodeIsRemoved: node });
                if (!bindings || !bindingsUpdater.isActive()) bindingsUpdater = null;
              }
              var bindingHandlerThatControlsDescendantBindings;
              if (bindings) {
                var getValueAccessor = bindingsUpdater ? function (bindingKey) {
                  return function () {
                    return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
                  };
                } : function (bindingKey) {
                  return bindings[bindingKey];
                };
                function allBindings() {
                  return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
                }
                allBindings['get'] = function (key) {
                  return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
                };
                allBindings['has'] = function (key) {
                  return key in bindings;
                };
                var orderedBindings = topologicalSortBindings(bindings);
                ko.utils.arrayForEach(orderedBindings, function (bindingKeyAndHandler) {
                  var handlerInitFn = bindingKeyAndHandler.handler["init"],
                      handlerUpdateFn = bindingKeyAndHandler.handler["update"],
                      bindingKey = bindingKeyAndHandler.key;
                  if (node.nodeType === 8) {
                    validateThatBindingIsAllowedForVirtualElements(bindingKey);
                  }
                  try {
                    if (typeof handlerInitFn == "function") {
                      ko.dependencyDetection.ignore(function () {
                        var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
                        if (initResult && initResult['controlsDescendantBindings']) {
                          if (bindingHandlerThatControlsDescendantBindings !== undefined) throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                          bindingHandlerThatControlsDescendantBindings = bindingKey;
                        }
                      });
                    }
                    if (typeof handlerUpdateFn == "function") {
                      ko.dependentObservable(function () {
                        handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
                      }, null, { disposeWhenNodeIsRemoved: node });
                    }
                  } catch (ex) {
                    ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
                    throw ex;
                  }
                });
              }
              return { 'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined };
            }
            ;
            var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
            ko.storedBindingContextForNode = function (node, bindingContext) {
              if (arguments.length == 2) {
                ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
                if (bindingContext._subscribable) bindingContext._subscribable._addNode(node);
              } else {
                return ko.utils.domData.get(node, storedBindingContextDomDataKey);
              }
            };
            function getBindingContext(viewModelOrBindingContext) {
              return viewModelOrBindingContext && viewModelOrBindingContext instanceof ko.bindingContext ? viewModelOrBindingContext : new ko.bindingContext(viewModelOrBindingContext);
            }
            ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
              if (node.nodeType === 1) ko.virtualElements.normaliseVirtualElementDomStructure(node);
              return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
            };
            ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
              var context = getBindingContext(viewModelOrBindingContext);
              return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
            };
            ko.applyBindingsToDescendants = function (viewModelOrBindingContext, rootNode) {
              if (rootNode.nodeType === 1 || rootNode.nodeType === 8) applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
            };
            ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
              if (!jQueryInstance && window['jQuery']) {
                jQueryInstance = window['jQuery'];
              }
              if (rootNode && rootNode.nodeType !== 1 && rootNode.nodeType !== 8) throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
              rootNode = rootNode || window.document.body;
              applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
            };
            ko.contextFor = function (node) {
              switch (node.nodeType) {
                case 1:
                case 8:
                  var context = ko.storedBindingContextForNode(node);
                  if (context) return context;
                  if (node.parentNode) return ko.contextFor(node.parentNode);
                  break;
              }
              return undefined;
            };
            ko.dataFor = function (node) {
              var context = ko.contextFor(node);
              return context ? context['$data'] : undefined;
            };
            ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
            ko.exportSymbol('applyBindings', ko.applyBindings);
            ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
            ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
            ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
            ko.exportSymbol('contextFor', ko.contextFor);
            ko.exportSymbol('dataFor', ko.dataFor);
          })();
          (function (undefined) {
            var loadingSubscribablesCache = {},
                loadedDefinitionsCache = {};
            ko.components = {
              get: function (componentName, callback) {
                var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
                if (cachedDefinition) {
                  if (cachedDefinition.isSynchronousComponent) {
                    ko.dependencyDetection.ignore(function () {
                      callback(cachedDefinition.definition);
                    });
                  } else {
                    ko.tasks.schedule(function () {
                      callback(cachedDefinition.definition);
                    });
                  }
                } else {
                  loadComponentAndNotify(componentName, callback);
                }
              },
              clearCachedDefinition: function (componentName) {
                delete loadedDefinitionsCache[componentName];
              },
              _getFirstResultFromLoaders: getFirstResultFromLoaders
            };
            function getObjectOwnProperty(obj, propName) {
              return obj.hasOwnProperty(propName) ? obj[propName] : undefined;
            }
            function loadComponentAndNotify(componentName, callback) {
              var subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName),
                  completedAsync;
              if (!subscribable) {
                subscribable = loadingSubscribablesCache[componentName] = new ko.subscribable();
                subscribable.subscribe(callback);
                beginLoadingComponent(componentName, function (definition, config) {
                  var isSynchronousComponent = !!(config && config['synchronous']);
                  loadedDefinitionsCache[componentName] = {
                    definition: definition,
                    isSynchronousComponent: isSynchronousComponent
                  };
                  delete loadingSubscribablesCache[componentName];
                  if (completedAsync || isSynchronousComponent) {
                    subscribable['notifySubscribers'](definition);
                  } else {
                    ko.tasks.schedule(function () {
                      subscribable['notifySubscribers'](definition);
                    });
                  }
                });
                completedAsync = true;
              } else {
                subscribable.subscribe(callback);
              }
            }
            function beginLoadingComponent(componentName, callback) {
              getFirstResultFromLoaders('getConfig', [componentName], function (config) {
                if (config) {
                  getFirstResultFromLoaders('loadComponent', [componentName, config], function (definition) {
                    callback(definition, config);
                  });
                } else {
                  callback(null, null);
                }
              });
            }
            function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
              if (!candidateLoaders) {
                candidateLoaders = ko.components['loaders'].slice(0);
              }
              var currentCandidateLoader = candidateLoaders.shift();
              if (currentCandidateLoader) {
                var methodInstance = currentCandidateLoader[methodName];
                if (methodInstance) {
                  var wasAborted = false,
                      synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function (result) {
                    if (wasAborted) {
                      callback(null);
                    } else if (result !== null) {
                      callback(result);
                    } else {
                      getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                    }
                  }));
                  if (synchronousReturnValue !== undefined) {
                    wasAborted = true;
                    if (!currentCandidateLoader['suppressLoaderExceptions']) {
                      throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
                    }
                  }
                } else {
                  getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                }
              } else {
                callback(null);
              }
            }
            ko.components['loaders'] = [];
            ko.exportSymbol('components', ko.components);
            ko.exportSymbol('components.get', ko.components.get);
            ko.exportSymbol('components.clearCachedDefinition', ko.components.clearCachedDefinition);
          })();
          (function (undefined) {
            var defaultConfigRegistry = {};
            ko.components.register = function (componentName, config) {
              if (!config) {
                throw new Error('Invalid configuration for ' + componentName);
              }
              if (ko.components.isRegistered(componentName)) {
                throw new Error('Component ' + componentName + ' is already registered');
              }
              defaultConfigRegistry[componentName] = config;
            };
            ko.components.isRegistered = function (componentName) {
              return defaultConfigRegistry.hasOwnProperty(componentName);
            };
            ko.components.unregister = function (componentName) {
              delete defaultConfigRegistry[componentName];
              ko.components.clearCachedDefinition(componentName);
            };
            ko.components.defaultLoader = {
              'getConfig': function (componentName, callback) {
                var result = defaultConfigRegistry.hasOwnProperty(componentName) ? defaultConfigRegistry[componentName] : null;
                callback(result);
              },
              'loadComponent': function (componentName, config, callback) {
                var errorCallback = makeErrorCallback(componentName);
                possiblyGetConfigFromAmd(errorCallback, config, function (loadedConfig) {
                  resolveConfig(componentName, errorCallback, loadedConfig, callback);
                });
              },
              'loadTemplate': function (componentName, templateConfig, callback) {
                resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
              },
              'loadViewModel': function (componentName, viewModelConfig, callback) {
                resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
              }
            };
            var createViewModelKey = 'createViewModel';
            function resolveConfig(componentName, errorCallback, config, callback) {
              var result = {},
                  makeCallBackWhenZero = 2,
                  tryIssueCallback = function () {
                if (--makeCallBackWhenZero === 0) {
                  callback(result);
                }
              },
                  templateConfig = config['template'],
                  viewModelConfig = config['viewModel'];
              if (templateConfig) {
                possiblyGetConfigFromAmd(errorCallback, templateConfig, function (loadedConfig) {
                  ko.components._getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function (resolvedTemplate) {
                    result['template'] = resolvedTemplate;
                    tryIssueCallback();
                  });
                });
              } else {
                tryIssueCallback();
              }
              if (viewModelConfig) {
                possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function (loadedConfig) {
                  ko.components._getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function (resolvedViewModel) {
                    result[createViewModelKey] = resolvedViewModel;
                    tryIssueCallback();
                  });
                });
              } else {
                tryIssueCallback();
              }
            }
            function resolveTemplate(errorCallback, templateConfig, callback) {
              if (typeof templateConfig === 'string') {
                callback(ko.utils.parseHtmlFragment(templateConfig));
              } else if (templateConfig instanceof Array) {
                callback(templateConfig);
              } else if (isDocumentFragment(templateConfig)) {
                callback(ko.utils.makeArray(templateConfig.childNodes));
              } else if (templateConfig['element']) {
                var element = templateConfig['element'];
                if (isDomElement(element)) {
                  callback(cloneNodesFromTemplateSourceElement(element));
                } else if (typeof element === 'string') {
                  var elemInstance = document.getElementById(element);
                  if (elemInstance) {
                    callback(cloneNodesFromTemplateSourceElement(elemInstance));
                  } else {
                    errorCallback('Cannot find element with ID ' + element);
                  }
                } else {
                  errorCallback('Unknown element type: ' + element);
                }
              } else {
                errorCallback('Unknown template value: ' + templateConfig);
              }
            }
            function resolveViewModel(errorCallback, viewModelConfig, callback) {
              if (typeof viewModelConfig === 'function') {
                callback(function (params) {
                  return new viewModelConfig(params);
                });
              } else if (typeof viewModelConfig[createViewModelKey] === 'function') {
                callback(viewModelConfig[createViewModelKey]);
              } else if ('instance' in viewModelConfig) {
                var fixedInstance = viewModelConfig['instance'];
                callback(function (params, componentInfo) {
                  return fixedInstance;
                });
              } else if ('viewModel' in viewModelConfig) {
                resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
              } else {
                errorCallback('Unknown viewModel value: ' + viewModelConfig);
              }
            }
            function cloneNodesFromTemplateSourceElement(elemInstance) {
              switch (ko.utils.tagNameLower(elemInstance)) {
                case 'script':
                  return ko.utils.parseHtmlFragment(elemInstance.text);
                case 'textarea':
                  return ko.utils.parseHtmlFragment(elemInstance.value);
                case 'template':
                  if (isDocumentFragment(elemInstance.content)) {
                    return ko.utils.cloneNodes(elemInstance.content.childNodes);
                  }
              }
              return ko.utils.cloneNodes(elemInstance.childNodes);
            }
            function isDomElement(obj) {
              if (window['HTMLElement']) {
                return obj instanceof HTMLElement;
              } else {
                return obj && obj.tagName && obj.nodeType === 1;
              }
            }
            function isDocumentFragment(obj) {
              if (window['DocumentFragment']) {
                return obj instanceof DocumentFragment;
              } else {
                return obj && obj.nodeType === 11;
              }
            }
            function possiblyGetConfigFromAmd(errorCallback, config, callback) {
              if (typeof config['require'] === 'string') {
                if (amdRequire || window['require']) {
                  (amdRequire || window['require'])([config['require']], callback);
                } else {
                  errorCallback('Uses require, but no AMD loader is present');
                }
              } else {
                callback(config);
              }
            }
            function makeErrorCallback(componentName) {
              return function (message) {
                throw new Error('Component \'' + componentName + '\': ' + message);
              };
            }
            ko.exportSymbol('components.register', ko.components.register);
            ko.exportSymbol('components.isRegistered', ko.components.isRegistered);
            ko.exportSymbol('components.unregister', ko.components.unregister);
            ko.exportSymbol('components.defaultLoader', ko.components.defaultLoader);
            ko.components['loaders'].push(ko.components.defaultLoader);
            ko.components._allRegisteredComponents = defaultConfigRegistry;
          })();
          (function (undefined) {
            ko.components['getComponentNameForNode'] = function (node) {
              var tagNameLower = ko.utils.tagNameLower(node);
              if (ko.components.isRegistered(tagNameLower)) {
                if (tagNameLower.indexOf('-') != -1 || '' + node == "[object HTMLUnknownElement]" || ko.utils.ieVersion <= 8 && node.tagName === tagNameLower) {
                  return tagNameLower;
                }
              }
            };
            ko.components.addBindingsForCustomElement = function (allBindings, node, bindingContext, valueAccessors) {
              if (node.nodeType === 1) {
                var componentName = ko.components['getComponentNameForNode'](node);
                if (componentName) {
                  allBindings = allBindings || {};
                  if (allBindings['component']) {
                    throw new Error('Cannot use the "component" binding on a custom element matching a component');
                  }
                  var componentBindingValue = {
                    'name': componentName,
                    'params': getComponentParamsFromCustomElement(node, bindingContext)
                  };
                  allBindings['component'] = valueAccessors ? function () {
                    return componentBindingValue;
                  } : componentBindingValue;
                }
              }
              return allBindings;
            };
            var nativeBindingProviderInstance = new ko.bindingProvider();
            function getComponentParamsFromCustomElement(elem, bindingContext) {
              var paramsAttribute = elem.getAttribute('params');
              if (paramsAttribute) {
                var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, {
                  'valueAccessors': true,
                  'bindingParams': true
                }),
                    rawParamComputedValues = ko.utils.objectMap(params, function (paramValue, paramName) {
                  return ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
                }),
                    result = ko.utils.objectMap(rawParamComputedValues, function (paramValueComputed, paramName) {
                  var paramValue = paramValueComputed.peek();
                  if (!paramValueComputed.isActive()) {
                    return paramValue;
                  } else {
                    return ko.computed({
                      'read': function () {
                        return ko.utils.unwrapObservable(paramValueComputed());
                      },
                      'write': ko.isWriteableObservable(paramValue) && function (value) {
                        paramValueComputed()(value);
                      },
                      disposeWhenNodeIsRemoved: elem
                    });
                  }
                });
                if (!result.hasOwnProperty('$raw')) {
                  result['$raw'] = rawParamComputedValues;
                }
                return result;
              } else {
                return { '$raw': {} };
              }
            }
            if (ko.utils.ieVersion < 9) {
              ko.components['register'] = function (originalFunction) {
                return function (componentName) {
                  document.createElement(componentName);
                  return originalFunction.apply(this, arguments);
                };
              }(ko.components['register']);
              document.createDocumentFragment = function (originalFunction) {
                return function () {
                  var newDocFrag = originalFunction(),
                      allComponents = ko.components._allRegisteredComponents;
                  for (var componentName in allComponents) {
                    if (allComponents.hasOwnProperty(componentName)) {
                      newDocFrag.createElement(componentName);
                    }
                  }
                  return newDocFrag;
                };
              }(document.createDocumentFragment);
            }
          })();
          (function (undefined) {
            var componentLoadingOperationUniqueId = 0;
            ko.bindingHandlers['component'] = { 'init': function (element, valueAccessor, ignored1, ignored2, bindingContext) {
                var currentViewModel,
                    currentLoadingOperationId,
                    disposeAssociatedComponentViewModel = function () {
                  var currentViewModelDispose = currentViewModel && currentViewModel['dispose'];
                  if (typeof currentViewModelDispose === 'function') {
                    currentViewModelDispose.call(currentViewModel);
                  }
                  currentViewModel = null;
                  currentLoadingOperationId = null;
                },
                    originalChildNodes = ko.utils.makeArray(ko.virtualElements.childNodes(element));
                ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);
                ko.computed(function () {
                  var value = ko.utils.unwrapObservable(valueAccessor()),
                      componentName,
                      componentParams;
                  if (typeof value === 'string') {
                    componentName = value;
                  } else {
                    componentName = ko.utils.unwrapObservable(value['name']);
                    componentParams = ko.utils.unwrapObservable(value['params']);
                  }
                  if (!componentName) {
                    throw new Error('No component name specified');
                  }
                  var loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                  ko.components.get(componentName, function (componentDefinition) {
                    if (currentLoadingOperationId !== loadingOperationId) {
                      return;
                    }
                    disposeAssociatedComponentViewModel();
                    if (!componentDefinition) {
                      throw new Error('Unknown component \'' + componentName + '\'');
                    }
                    cloneTemplateIntoElement(componentName, componentDefinition, element);
                    var componentViewModel = createViewModel(componentDefinition, element, originalChildNodes, componentParams),
                        childBindingContext = bindingContext['createChildContext'](componentViewModel, undefined, function (ctx) {
                      ctx['$component'] = componentViewModel;
                      ctx['$componentTemplateNodes'] = originalChildNodes;
                    });
                    currentViewModel = componentViewModel;
                    ko.applyBindingsToDescendants(childBindingContext, element);
                  });
                }, null, { disposeWhenNodeIsRemoved: element });
                return { 'controlsDescendantBindings': true };
              } };
            ko.virtualElements.allowedBindings['component'] = true;
            function cloneTemplateIntoElement(componentName, componentDefinition, element) {
              var template = componentDefinition['template'];
              if (!template) {
                throw new Error('Component \'' + componentName + '\' has no template');
              }
              var clonedNodesArray = ko.utils.cloneNodes(template);
              ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
            }
            function createViewModel(componentDefinition, element, originalChildNodes, componentParams) {
              var componentViewModelFactory = componentDefinition['createViewModel'];
              return componentViewModelFactory ? componentViewModelFactory.call(componentDefinition, componentParams, {
                'element': element,
                'templateNodes': originalChildNodes
              }) : componentParams;
            }
          })();
          var attrHtmlToJavascriptMap = {
            'class': 'className',
            'for': 'htmlFor'
          };
          ko.bindingHandlers['attr'] = { 'update': function (element, valueAccessor, allBindings) {
              var value = ko.utils.unwrapObservable(valueAccessor()) || {};
              ko.utils.objectForEach(value, function (attrName, attrValue) {
                attrValue = ko.utils.unwrapObservable(attrValue);
                var toRemove = attrValue === false || attrValue === null || attrValue === undefined;
                if (toRemove) element.removeAttribute(attrName);
                if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                  attrName = attrHtmlToJavascriptMap[attrName];
                  if (toRemove) element.removeAttribute(attrName);else element[attrName] = attrValue;
                } else if (!toRemove) {
                  element.setAttribute(attrName, attrValue.toString());
                }
                if (attrName === "name") {
                  ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
                }
              });
            } };
          (function () {
            ko.bindingHandlers['checked'] = {
              'after': ['value', 'attr'],
              'init': function (element, valueAccessor, allBindings) {
                var checkedValue = ko.pureComputed(function () {
                  if (allBindings['has']('checkedValue')) {
                    return ko.utils.unwrapObservable(allBindings.get('checkedValue'));
                  } else if (allBindings['has']('value')) {
                    return ko.utils.unwrapObservable(allBindings.get('value'));
                  }
                  return element.value;
                });
                function updateModel() {
                  var isChecked = element.checked,
                      elemValue = useCheckedValue ? checkedValue() : isChecked;
                  if (ko.computedContext.isInitial()) {
                    return;
                  }
                  if (isRadio && !isChecked) {
                    return;
                  }
                  var modelValue = ko.dependencyDetection.ignore(valueAccessor);
                  if (valueIsArray) {
                    var writableValue = rawValueIsNonArrayObservable ? modelValue.peek() : modelValue;
                    if (oldElemValue !== elemValue) {
                      if (isChecked) {
                        ko.utils.addOrRemoveItem(writableValue, elemValue, true);
                        ko.utils.addOrRemoveItem(writableValue, oldElemValue, false);
                      }
                      oldElemValue = elemValue;
                    } else {
                      ko.utils.addOrRemoveItem(writableValue, elemValue, isChecked);
                    }
                    if (rawValueIsNonArrayObservable && ko.isWriteableObservable(modelValue)) {
                      modelValue(writableValue);
                    }
                  } else {
                    ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
                  }
                }
                ;
                function updateView() {
                  var modelValue = ko.utils.unwrapObservable(valueAccessor());
                  if (valueIsArray) {
                    element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
                  } else if (isCheckbox) {
                    element.checked = modelValue;
                  } else {
                    element.checked = checkedValue() === modelValue;
                  }
                }
                ;
                var isCheckbox = element.type == "checkbox",
                    isRadio = element.type == "radio";
                if (!isCheckbox && !isRadio) {
                  return;
                }
                var rawValue = valueAccessor(),
                    valueIsArray = isCheckbox && ko.utils.unwrapObservable(rawValue) instanceof Array,
                    rawValueIsNonArrayObservable = !(valueIsArray && rawValue.push && rawValue.splice),
                    oldElemValue = valueIsArray ? checkedValue() : undefined,
                    useCheckedValue = isRadio || valueIsArray;
                if (isRadio && !element.name) ko.bindingHandlers['uniqueName']['init'](element, function () {
                  return true;
                });
                ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
                ko.utils.registerEventHandler(element, "click", updateModel);
                ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
                rawValue = undefined;
              }
            };
            ko.expressionRewriting.twoWayBindings['checked'] = true;
            ko.bindingHandlers['checkedValue'] = { 'update': function (element, valueAccessor) {
                element.value = ko.utils.unwrapObservable(valueAccessor());
              } };
          })();
          var classesWrittenByBindingKey = '__ko__cssValue';
          ko.bindingHandlers['css'] = { 'update': function (element, valueAccessor) {
              var value = ko.utils.unwrapObservable(valueAccessor());
              if (value !== null && typeof value == "object") {
                ko.utils.objectForEach(value, function (className, shouldHaveClass) {
                  shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
                  ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
                });
              } else {
                value = ko.utils.stringTrim(String(value || ''));
                ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
                element[classesWrittenByBindingKey] = value;
                ko.utils.toggleDomNodeCssClass(element, value, true);
              }
            } };
          ko.bindingHandlers['enable'] = { 'update': function (element, valueAccessor) {
              var value = ko.utils.unwrapObservable(valueAccessor());
              if (value && element.disabled) element.removeAttribute("disabled");else if (!value && !element.disabled) element.disabled = true;
            } };
          ko.bindingHandlers['disable'] = { 'update': function (element, valueAccessor) {
              ko.bindingHandlers['enable']['update'](element, function () {
                return !ko.utils.unwrapObservable(valueAccessor());
              });
            } };
          function makeEventHandlerShortcut(eventName) {
            ko.bindingHandlers[eventName] = { 'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var newValueAccessor = function () {
                  var result = {};
                  result[eventName] = valueAccessor();
                  return result;
                };
                return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
              } };
          }
          ko.bindingHandlers['event'] = { 'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
              var eventsToHandle = valueAccessor() || {};
              ko.utils.objectForEach(eventsToHandle, function (eventName) {
                if (typeof eventName == "string") {
                  ko.utils.registerEventHandler(element, eventName, function (event) {
                    var handlerReturnValue;
                    var handlerFunction = valueAccessor()[eventName];
                    if (!handlerFunction) return;
                    try {
                      var argsForHandler = ko.utils.makeArray(arguments);
                      viewModel = bindingContext['$data'];
                      argsForHandler.unshift(viewModel);
                      handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                    } finally {
                      if (handlerReturnValue !== true) {
                        if (event.preventDefault) event.preventDefault();else event.returnValue = false;
                      }
                    }
                    var bubble = allBindings.get(eventName + 'Bubble') !== false;
                    if (!bubble) {
                      event.cancelBubble = true;
                      if (event.stopPropagation) event.stopPropagation();
                    }
                  });
                }
              });
            } };
          ko.bindingHandlers['foreach'] = {
            makeTemplateValueAccessor: function (valueAccessor) {
              return function () {
                var modelValue = valueAccessor(),
                    unwrappedValue = ko.utils.peekObservable(modelValue);
                if (!unwrappedValue || typeof unwrappedValue.length == "number") return {
                  'foreach': modelValue,
                  'templateEngine': ko.nativeTemplateEngine.instance
                };
                ko.utils.unwrapObservable(modelValue);
                return {
                  'foreach': unwrappedValue['data'],
                  'as': unwrappedValue['as'],
                  'includeDestroyed': unwrappedValue['includeDestroyed'],
                  'afterAdd': unwrappedValue['afterAdd'],
                  'beforeRemove': unwrappedValue['beforeRemove'],
                  'afterRender': unwrappedValue['afterRender'],
                  'beforeMove': unwrappedValue['beforeMove'],
                  'afterMove': unwrappedValue['afterMove'],
                  'templateEngine': ko.nativeTemplateEngine.instance
                };
              };
            },
            'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
              return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
            },
            'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
              return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
            }
          };
          ko.expressionRewriting.bindingRewriteValidators['foreach'] = false;
          ko.virtualElements.allowedBindings['foreach'] = true;
          var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
          var hasfocusLastValue = '__ko_hasfocusLastValue';
          ko.bindingHandlers['hasfocus'] = {
            'init': function (element, valueAccessor, allBindings) {
              var handleElementFocusChange = function (isFocused) {
                element[hasfocusUpdatingProperty] = true;
                var ownerDoc = element.ownerDocument;
                if ("activeElement" in ownerDoc) {
                  var active;
                  try {
                    active = ownerDoc.activeElement;
                  } catch (e) {
                    active = ownerDoc.body;
                  }
                  isFocused = active === element;
                }
                var modelValue = valueAccessor();
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);
                element[hasfocusLastValue] = isFocused;
                element[hasfocusUpdatingProperty] = false;
              };
              var handleElementFocusIn = handleElementFocusChange.bind(null, true);
              var handleElementFocusOut = handleElementFocusChange.bind(null, false);
              ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
              ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn);
              ko.utils.registerEventHandler(element, "blur", handleElementFocusOut);
              ko.utils.registerEventHandler(element, "focusout", handleElementFocusOut);
            },
            'update': function (element, valueAccessor) {
              var value = !!ko.utils.unwrapObservable(valueAccessor());
              if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
                value ? element.focus() : element.blur();
                if (!value && element[hasfocusLastValue]) {
                  element.ownerDocument.body.focus();
                }
                ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]);
              }
            }
          };
          ko.expressionRewriting.twoWayBindings['hasfocus'] = true;
          ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus'];
          ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
          ko.bindingHandlers['html'] = {
            'init': function () {
              return { 'controlsDescendantBindings': true };
            },
            'update': function (element, valueAccessor) {
              ko.utils.setHtml(element, valueAccessor());
            }
          };
          function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
            ko.bindingHandlers[bindingKey] = { 'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var didDisplayOnLastUpdate, savedNodes;
                ko.computed(function () {
                  var dataValue = ko.utils.unwrapObservable(valueAccessor()),
                      shouldDisplay = !isNot !== !dataValue,
                      isFirstRender = !savedNodes,
                      needsRefresh = isFirstRender || isWith || shouldDisplay !== didDisplayOnLastUpdate;
                  if (needsRefresh) {
                    if (isFirstRender && ko.computedContext.getDependenciesCount()) {
                      savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true);
                    }
                    if (shouldDisplay) {
                      if (!isFirstRender) {
                        ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
                      }
                      ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
                    } else {
                      ko.virtualElements.emptyNode(element);
                    }
                    didDisplayOnLastUpdate = shouldDisplay;
                  }
                }, null, { disposeWhenNodeIsRemoved: element });
                return { 'controlsDescendantBindings': true };
              } };
            ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false;
            ko.virtualElements.allowedBindings[bindingKey] = true;
          }
          makeWithIfBinding('if');
          makeWithIfBinding('ifnot', false, true);
          makeWithIfBinding('with', true, false, function (bindingContext, dataValue) {
            return bindingContext['createChildContext'](dataValue);
          });
          var captionPlaceholder = {};
          ko.bindingHandlers['options'] = {
            'init': function (element) {
              if (ko.utils.tagNameLower(element) !== "select") throw new Error("options binding applies only to SELECT elements");
              while (element.length > 0) {
                element.remove(0);
              }
              return { 'controlsDescendantBindings': true };
            },
            'update': function (element, valueAccessor, allBindings) {
              function selectedOptions() {
                return ko.utils.arrayFilter(element.options, function (node) {
                  return node.selected;
                });
              }
              var selectWasPreviouslyEmpty = element.length == 0,
                  multiple = element.multiple,
                  previousScrollTop = !selectWasPreviouslyEmpty && multiple ? element.scrollTop : null,
                  unwrappedArray = ko.utils.unwrapObservable(valueAccessor()),
                  valueAllowUnset = allBindings.get('valueAllowUnset') && allBindings['has']('value'),
                  includeDestroyed = allBindings.get('optionsIncludeDestroyed'),
                  arrayToDomNodeChildrenOptions = {},
                  captionValue,
                  filteredArray,
                  previousSelectedValues = [];
              if (!valueAllowUnset) {
                if (multiple) {
                  previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
                } else if (element.selectedIndex >= 0) {
                  previousSelectedValues.push(ko.selectExtensions.readValue(element.options[element.selectedIndex]));
                }
              }
              if (unwrappedArray) {
                if (typeof unwrappedArray.length == "undefined") unwrappedArray = [unwrappedArray];
                filteredArray = ko.utils.arrayFilter(unwrappedArray, function (item) {
                  return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
                });
                if (allBindings['has']('optionsCaption')) {
                  captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
                  if (captionValue !== null && captionValue !== undefined) {
                    filteredArray.unshift(captionPlaceholder);
                  }
                }
              } else {}
              function applyToObject(object, predicate, defaultValue) {
                var predicateType = typeof predicate;
                if (predicateType == "function") return predicate(object);else if (predicateType == "string") return object[predicate];else return defaultValue;
              }
              var itemUpdate = false;
              function optionForArrayItem(arrayEntry, index, oldOptions) {
                if (oldOptions.length) {
                  previousSelectedValues = !valueAllowUnset && oldOptions[0].selected ? [ko.selectExtensions.readValue(oldOptions[0])] : [];
                  itemUpdate = true;
                }
                var option = element.ownerDocument.createElement("option");
                if (arrayEntry === captionPlaceholder) {
                  ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
                  ko.selectExtensions.writeValue(option, undefined);
                } else {
                  var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
                  ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));
                  var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
                  ko.utils.setTextContent(option, optionText);
                }
                return [option];
              }
              arrayToDomNodeChildrenOptions['beforeRemove'] = function (option) {
                element.removeChild(option);
              };
              function setSelectionCallback(arrayEntry, newOptions) {
                if (itemUpdate && valueAllowUnset) {
                  ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true);
                } else if (previousSelectedValues.length) {
                  var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
                  ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);
                  if (itemUpdate && !isSelected) {
                    ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                  }
                }
              }
              var callback = setSelectionCallback;
              if (allBindings['has']('optionsAfterRender') && typeof allBindings.get('optionsAfterRender') == "function") {
                callback = function (arrayEntry, newOptions) {
                  setSelectionCallback(arrayEntry, newOptions);
                  ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
                };
              }
              ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);
              ko.dependencyDetection.ignore(function () {
                if (valueAllowUnset) {
                  ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true);
                } else {
                  var selectionChanged;
                  if (multiple) {
                    selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
                  } else {
                    selectionChanged = previousSelectedValues.length && element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0] : previousSelectedValues.length || element.selectedIndex >= 0;
                  }
                  if (selectionChanged) {
                    ko.utils.triggerEvent(element, "change");
                  }
                }
              });
              ko.utils.ensureSelectElementIsRenderedCorrectly(element);
              if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20) element.scrollTop = previousScrollTop;
            }
          };
          ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
          ko.bindingHandlers['selectedOptions'] = {
            'after': ['options', 'foreach'],
            'init': function (element, valueAccessor, allBindings) {
              ko.utils.registerEventHandler(element, "change", function () {
                var value = valueAccessor(),
                    valueToWrite = [];
                ko.utils.arrayForEach(element.getElementsByTagName("option"), function (node) {
                  if (node.selected) valueToWrite.push(ko.selectExtensions.readValue(node));
                });
                ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
              });
            },
            'update': function (element, valueAccessor) {
              if (ko.utils.tagNameLower(element) != "select") throw new Error("values binding applies only to SELECT elements");
              var newValue = ko.utils.unwrapObservable(valueAccessor()),
                  previousScrollTop = element.scrollTop;
              if (newValue && typeof newValue.length == "number") {
                ko.utils.arrayForEach(element.getElementsByTagName("option"), function (node) {
                  var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                  if (node.selected != isSelected) {
                    ko.utils.setOptionNodeSelectionState(node, isSelected);
                  }
                });
              }
              element.scrollTop = previousScrollTop;
            }
          };
          ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
          ko.bindingHandlers['style'] = { 'update': function (element, valueAccessor) {
              var value = ko.utils.unwrapObservable(valueAccessor() || {});
              ko.utils.objectForEach(value, function (styleName, styleValue) {
                styleValue = ko.utils.unwrapObservable(styleValue);
                if (styleValue === null || styleValue === undefined || styleValue === false) {
                  styleValue = "";
                }
                element.style[styleName] = styleValue;
              });
            } };
          ko.bindingHandlers['submit'] = { 'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
              if (typeof valueAccessor() != "function") throw new Error("The value for a submit binding must be a function");
              ko.utils.registerEventHandler(element, "submit", function (event) {
                var handlerReturnValue;
                var value = valueAccessor();
                try {
                  handlerReturnValue = value.call(bindingContext['$data'], element);
                } finally {
                  if (handlerReturnValue !== true) {
                    if (event.preventDefault) event.preventDefault();else event.returnValue = false;
                  }
                }
              });
            } };
          ko.bindingHandlers['text'] = {
            'init': function () {
              return { 'controlsDescendantBindings': true };
            },
            'update': function (element, valueAccessor) {
              ko.utils.setTextContent(element, valueAccessor());
            }
          };
          ko.virtualElements.allowedBindings['text'] = true;
          (function () {
            if (window && window.navigator) {
              var parseVersion = function (matches) {
                if (matches) {
                  return parseFloat(matches[1]);
                }
              };
              var operaVersion = window.opera && window.opera.version && parseInt(window.opera.version()),
                  userAgent = window.navigator.userAgent,
                  safariVersion = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),
                  firefoxVersion = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
            }
            if (ko.utils.ieVersion < 10) {
              var selectionChangeRegisteredName = ko.utils.domData.nextKey(),
                  selectionChangeHandlerName = ko.utils.domData.nextKey();
              var selectionChangeHandler = function (event) {
                var target = this.activeElement,
                    handler = target && ko.utils.domData.get(target, selectionChangeHandlerName);
                if (handler) {
                  handler(event);
                }
              };
              var registerForSelectionChangeEvent = function (element, handler) {
                var ownerDoc = element.ownerDocument;
                if (!ko.utils.domData.get(ownerDoc, selectionChangeRegisteredName)) {
                  ko.utils.domData.set(ownerDoc, selectionChangeRegisteredName, true);
                  ko.utils.registerEventHandler(ownerDoc, 'selectionchange', selectionChangeHandler);
                }
                ko.utils.domData.set(element, selectionChangeHandlerName, handler);
              };
            }
            ko.bindingHandlers['textInput'] = { 'init': function (element, valueAccessor, allBindings) {
                var previousElementValue = element.value,
                    timeoutHandle,
                    elementValueBeforeEvent;
                var updateModel = function (event) {
                  clearTimeout(timeoutHandle);
                  elementValueBeforeEvent = timeoutHandle = undefined;
                  var elementValue = element.value;
                  if (previousElementValue !== elementValue) {
                    if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;
                    previousElementValue = elementValue;
                    ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'textInput', elementValue);
                  }
                };
                var deferUpdateModel = function (event) {
                  if (!timeoutHandle) {
                    elementValueBeforeEvent = element.value;
                    var handler = DEBUG ? updateModel.bind(element, { type: event.type }) : updateModel;
                    timeoutHandle = ko.utils.setTimeout(handler, 4);
                  }
                };
                var ieUpdateModel = ko.utils.ieVersion == 9 ? deferUpdateModel : updateModel;
                var updateView = function () {
                  var modelValue = ko.utils.unwrapObservable(valueAccessor());
                  if (modelValue === null || modelValue === undefined) {
                    modelValue = '';
                  }
                  if (elementValueBeforeEvent !== undefined && modelValue === elementValueBeforeEvent) {
                    ko.utils.setTimeout(updateView, 4);
                    return;
                  }
                  if (element.value !== modelValue) {
                    previousElementValue = modelValue;
                    element.value = modelValue;
                  }
                };
                var onEvent = function (event, handler) {
                  ko.utils.registerEventHandler(element, event, handler);
                };
                if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
                  ko.utils.arrayForEach(ko.bindingHandlers['textInput']['_forceUpdateOn'], function (eventName) {
                    if (eventName.slice(0, 5) == 'after') {
                      onEvent(eventName.slice(5), deferUpdateModel);
                    } else {
                      onEvent(eventName, updateModel);
                    }
                  });
                } else {
                  if (ko.utils.ieVersion < 10) {
                    onEvent('propertychange', function (event) {
                      if (event.propertyName === 'value') {
                        ieUpdateModel(event);
                      }
                    });
                    if (ko.utils.ieVersion == 8) {
                      onEvent('keyup', updateModel);
                      onEvent('keydown', updateModel);
                    }
                    if (ko.utils.ieVersion >= 8) {
                      registerForSelectionChangeEvent(element, ieUpdateModel);
                      onEvent('dragend', deferUpdateModel);
                    }
                  } else {
                    onEvent('input', updateModel);
                    if (safariVersion < 5 && ko.utils.tagNameLower(element) === "textarea") {
                      onEvent('keydown', deferUpdateModel);
                      onEvent('paste', deferUpdateModel);
                      onEvent('cut', deferUpdateModel);
                    } else if (operaVersion < 11) {
                      onEvent('keydown', deferUpdateModel);
                    } else if (firefoxVersion < 4.0) {
                      onEvent('DOMAutoComplete', updateModel);
                      onEvent('dragdrop', updateModel);
                      onEvent('drop', updateModel);
                    }
                  }
                }
                onEvent('change', updateModel);
                ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
              } };
            ko.expressionRewriting.twoWayBindings['textInput'] = true;
            ko.bindingHandlers['textinput'] = { 'preprocess': function (value, name, addBinding) {
                addBinding('textInput', value);
              } };
          })();
          ko.bindingHandlers['uniqueName'] = { 'init': function (element, valueAccessor) {
              if (valueAccessor()) {
                var name = "ko_unique_" + ++ko.bindingHandlers['uniqueName'].currentIndex;
                ko.utils.setElementName(element, name);
              }
            } };
          ko.bindingHandlers['uniqueName'].currentIndex = 0;
          ko.bindingHandlers['value'] = {
            'after': ['options', 'foreach'],
            'init': function (element, valueAccessor, allBindings) {
              if (element.tagName.toLowerCase() == "input" && (element.type == "checkbox" || element.type == "radio")) {
                ko.applyBindingAccessorsToNode(element, { 'checkedValue': valueAccessor });
                return;
              }
              var eventsToCatch = ["change"];
              var requestedEventsToCatch = allBindings.get("valueUpdate");
              var propertyChangedFired = false;
              var elementValueBeforeEvent = null;
              if (requestedEventsToCatch) {
                if (typeof requestedEventsToCatch == "string") requestedEventsToCatch = [requestedEventsToCatch];
                ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
                eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
              }
              var valueUpdateHandler = function () {
                elementValueBeforeEvent = null;
                propertyChangedFired = false;
                var modelValue = valueAccessor();
                var elementValue = ko.selectExtensions.readValue(element);
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
              };
              var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text" && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
              if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
                ko.utils.registerEventHandler(element, "propertychange", function () {
                  propertyChangedFired = true;
                });
                ko.utils.registerEventHandler(element, "focus", function () {
                  propertyChangedFired = false;
                });
                ko.utils.registerEventHandler(element, "blur", function () {
                  if (propertyChangedFired) {
                    valueUpdateHandler();
                  }
                });
              }
              ko.utils.arrayForEach(eventsToCatch, function (eventName) {
                var handler = valueUpdateHandler;
                if (ko.utils.stringStartsWith(eventName, "after")) {
                  handler = function () {
                    elementValueBeforeEvent = ko.selectExtensions.readValue(element);
                    ko.utils.setTimeout(valueUpdateHandler, 0);
                  };
                  eventName = eventName.substring("after".length);
                }
                ko.utils.registerEventHandler(element, eventName, handler);
              });
              var updateFromModel = function () {
                var newValue = ko.utils.unwrapObservable(valueAccessor());
                var elementValue = ko.selectExtensions.readValue(element);
                if (elementValueBeforeEvent !== null && newValue === elementValueBeforeEvent) {
                  ko.utils.setTimeout(updateFromModel, 0);
                  return;
                }
                var valueHasChanged = newValue !== elementValue;
                if (valueHasChanged) {
                  if (ko.utils.tagNameLower(element) === "select") {
                    var allowUnset = allBindings.get('valueAllowUnset');
                    var applyValueAction = function () {
                      ko.selectExtensions.writeValue(element, newValue, allowUnset);
                    };
                    applyValueAction();
                    if (!allowUnset && newValue !== ko.selectExtensions.readValue(element)) {
                      ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                    } else {
                      ko.utils.setTimeout(applyValueAction, 0);
                    }
                  } else {
                    ko.selectExtensions.writeValue(element, newValue);
                  }
                }
              };
              ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
            },
            'update': function () {}
          };
          ko.expressionRewriting.twoWayBindings['value'] = true;
          ko.bindingHandlers['visible'] = { 'update': function (element, valueAccessor) {
              var value = ko.utils.unwrapObservable(valueAccessor());
              var isCurrentlyVisible = !(element.style.display == "none");
              if (value && !isCurrentlyVisible) element.style.display = "";else if (!value && isCurrentlyVisible) element.style.display = "none";
            } };
          makeEventHandlerShortcut('click');
          ko.templateEngine = function () {};
          ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
            throw new Error("Override renderTemplateSource");
          };
          ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
            throw new Error("Override createJavaScriptEvaluatorBlock");
          };
          ko.templateEngine.prototype['makeTemplateSource'] = function (template, templateDocument) {
            if (typeof template == "string") {
              templateDocument = templateDocument || document;
              var elem = templateDocument.getElementById(template);
              if (!elem) throw new Error("Cannot find template with ID " + template);
              return new ko.templateSources.domElement(elem);
            } else if (template.nodeType == 1 || template.nodeType == 8) {
              return new ko.templateSources.anonymousTemplate(template);
            } else throw new Error("Unknown template type: " + template);
          };
          ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
            var templateSource = this['makeTemplateSource'](template, templateDocument);
            return this['renderTemplateSource'](templateSource, bindingContext, options, templateDocument);
          };
          ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
            if (this['allowTemplateRewriting'] === false) return true;
            return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
          };
          ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
            var templateSource = this['makeTemplateSource'](template, templateDocument);
            var rewritten = rewriterCallback(templateSource['text']());
            templateSource['text'](rewritten);
            templateSource['data']("isRewritten", true);
          };
          ko.exportSymbol('templateEngine', ko.templateEngine);
          ko.templateRewriting = function () {
            var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
            var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;
            function validateDataBindValuesForRewriting(keyValueArray) {
              var allValidators = ko.expressionRewriting.bindingRewriteValidators;
              for (var i = 0; i < keyValueArray.length; i++) {
                var key = keyValueArray[i]['key'];
                if (allValidators.hasOwnProperty(key)) {
                  var validator = allValidators[key];
                  if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage) throw new Error(possibleErrorMessage);
                  } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                  }
                }
              }
            }
            function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
              var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
              validateDataBindValuesForRewriting(dataBindKeyValueArray);
              var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, { 'valueAccessors': true });
              var applyBindingsToNextSiblingScript = "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
              return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
            }
            return {
              ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
                if (!templateEngine['isTemplateRewritten'](template, templateDocument)) templateEngine['rewriteTemplate'](template, function (htmlString) {
                  return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
              },
              memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
                return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                  return constructMemoizedTagReplacement(arguments[4], arguments[1], arguments[2], templateEngine);
                }).replace(memoizeVirtualContainerBindingSyntaxRegex, function () {
                  return constructMemoizedTagReplacement(arguments[1], "<!-- ko -->", "#comment", templateEngine);
                });
              },
              applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
                return ko.memoization.memoize(function (domNode, bindingContext) {
                  var nodeToBind = domNode.nextSibling;
                  if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
                    ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
                  }
                });
              }
            };
          }();
          ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
          (function () {
            ko.templateSources = {};
            var templateScript = 1,
                templateTextArea = 2,
                templateTemplate = 3,
                templateElement = 4;
            ko.templateSources.domElement = function (element) {
              this.domElement = element;
              if (element) {
                var tagNameLower = ko.utils.tagNameLower(element);
                this.templateType = tagNameLower === "script" ? templateScript : tagNameLower === "textarea" ? templateTextArea : tagNameLower == "template" && element.content && element.content.nodeType === 11 ? templateTemplate : templateElement;
              }
            };
            ko.templateSources.domElement.prototype['text'] = function () {
              var elemContentsProperty = this.templateType === templateScript ? "text" : this.templateType === templateTextArea ? "value" : "innerHTML";
              if (arguments.length == 0) {
                return this.domElement[elemContentsProperty];
              } else {
                var valueToWrite = arguments[0];
                if (elemContentsProperty === "innerHTML") ko.utils.setHtml(this.domElement, valueToWrite);else this.domElement[elemContentsProperty] = valueToWrite;
              }
            };
            var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
            ko.templateSources.domElement.prototype['data'] = function (key) {
              if (arguments.length === 1) {
                return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
              } else {
                ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
              }
            };
            var templatesDomDataKey = ko.utils.domData.nextKey();
            function getTemplateDomData(element) {
              return ko.utils.domData.get(element, templatesDomDataKey) || {};
            }
            function setTemplateDomData(element, data) {
              ko.utils.domData.set(element, templatesDomDataKey, data);
            }
            ko.templateSources.domElement.prototype['nodes'] = function () {
              var element = this.domElement;
              if (arguments.length == 0) {
                var templateData = getTemplateDomData(element),
                    containerData = templateData.containerData;
                return containerData || (this.templateType === templateTemplate ? element.content : this.templateType === templateElement ? element : undefined);
              } else {
                var valueToWrite = arguments[0];
                setTemplateDomData(element, { containerData: valueToWrite });
              }
            };
            ko.templateSources.anonymousTemplate = function (element) {
              this.domElement = element;
            };
            ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
            ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
            ko.templateSources.anonymousTemplate.prototype['text'] = function () {
              if (arguments.length == 0) {
                var templateData = getTemplateDomData(this.domElement);
                if (templateData.textData === undefined && templateData.containerData) templateData.textData = templateData.containerData.innerHTML;
                return templateData.textData;
              } else {
                var valueToWrite = arguments[0];
                setTemplateDomData(this.domElement, { textData: valueToWrite });
              }
            };
            ko.exportSymbol('templateSources', ko.templateSources);
            ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
            ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
          })();
          (function () {
            var _templateEngine;
            ko.setTemplateEngine = function (templateEngine) {
              if (templateEngine != undefined && !(templateEngine instanceof ko.templateEngine)) throw new Error("templateEngine must inherit from ko.templateEngine");
              _templateEngine = templateEngine;
            };
            function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
              var node,
                  nextInQueue = firstNode,
                  firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
              while (nextInQueue && (node = nextInQueue) !== firstOutOfRangeNode) {
                nextInQueue = ko.virtualElements.nextSibling(node);
                action(node, nextInQueue);
              }
            }
            function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
              if (continuousNodeArray.length) {
                var firstNode = continuousNodeArray[0],
                    lastNode = continuousNodeArray[continuousNodeArray.length - 1],
                    parentNode = firstNode.parentNode,
                    provider = ko.bindingProvider['instance'],
                    preprocessNode = provider['preprocessNode'];
                if (preprocessNode) {
                  invokeForEachNodeInContinuousRange(firstNode, lastNode, function (node, nextNodeInRange) {
                    var nodePreviousSibling = node.previousSibling;
                    var newNodes = preprocessNode.call(provider, node);
                    if (newNodes) {
                      if (node === firstNode) firstNode = newNodes[0] || nextNodeInRange;
                      if (node === lastNode) lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
                    }
                  });
                  continuousNodeArray.length = 0;
                  if (!firstNode) {
                    return;
                  }
                  if (firstNode === lastNode) {
                    continuousNodeArray.push(firstNode);
                  } else {
                    continuousNodeArray.push(firstNode, lastNode);
                    ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                  }
                }
                invokeForEachNodeInContinuousRange(firstNode, lastNode, function (node) {
                  if (node.nodeType === 1 || node.nodeType === 8) ko.applyBindings(bindingContext, node);
                });
                invokeForEachNodeInContinuousRange(firstNode, lastNode, function (node) {
                  if (node.nodeType === 1 || node.nodeType === 8) ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
                });
                ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
              }
            }
            function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
              return nodeOrNodeArray.nodeType ? nodeOrNodeArray : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0] : null;
            }
            function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
              options = options || {};
              var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
              var templateDocument = (firstTargetNode || template || {}).ownerDocument;
              var templateEngineToUse = options['templateEngine'] || _templateEngine;
              ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
              var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);
              if (typeof renderedNodesArray.length != "number" || renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number") throw new Error("Template engine must return an array of DOM nodes");
              var haveAddedNodesToParent = false;
              switch (renderMode) {
                case "replaceChildren":
                  ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                  haveAddedNodesToParent = true;
                  break;
                case "replaceNode":
                  ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                  haveAddedNodesToParent = true;
                  break;
                case "ignoreTargetNode":
                  break;
                default:
                  throw new Error("Unknown renderMode: " + renderMode);
              }
              if (haveAddedNodesToParent) {
                activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
                if (options['afterRender']) ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
              }
              return renderedNodesArray;
            }
            function resolveTemplateName(template, data, context) {
              if (ko.isObservable(template)) {
                return template();
              } else if (typeof template === 'function') {
                return template(data, context);
              } else {
                return template;
              }
            }
            ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
              options = options || {};
              if ((options['templateEngine'] || _templateEngine) == undefined) throw new Error("Set a template engine before calling renderTemplate");
              renderMode = renderMode || "replaceChildren";
              if (targetNodeOrNodeArray) {
                var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                var whenToDispose = function () {
                  return !firstTargetNode || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode);
                };
                var activelyDisposeWhenNodeIsRemoved = firstTargetNode && renderMode == "replaceNode" ? firstTargetNode.parentNode : firstTargetNode;
                return ko.dependentObservable(function () {
                  var bindingContext = dataOrBindingContext && dataOrBindingContext instanceof ko.bindingContext ? dataOrBindingContext : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));
                  var templateName = resolveTemplateName(template, bindingContext['$data'], bindingContext),
                      renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
                  if (renderMode == "replaceNode") {
                    targetNodeOrNodeArray = renderedNodesArray;
                    firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                  }
                }, null, {
                  disposeWhen: whenToDispose,
                  disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved
                });
              } else {
                return ko.memoization.memoize(function (domNode) {
                  ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
                });
              }
            };
            ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
              var arrayItemContext;
              var executeTemplateForArrayItem = function (arrayValue, index) {
                arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function (context) {
                  context['$index'] = index;
                });
                var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
                return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
              };
              var activateBindingsCallback = function (arrayValue, addedNodesArray, index) {
                activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
                if (options['afterRender']) options['afterRender'](addedNodesArray, arrayValue);
                arrayItemContext = null;
              };
              return ko.dependentObservable(function () {
                var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
                if (typeof unwrappedArray.length == "undefined") unwrappedArray = [unwrappedArray];
                var filteredArray = ko.utils.arrayFilter(unwrappedArray, function (item) {
                  return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
                });
                ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);
              }, null, { disposeWhenNodeIsRemoved: targetNode });
            };
            var templateComputedDomDataKey = ko.utils.domData.nextKey();
            function disposeOldComputedAndStoreNewOne(element, newComputed) {
              var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
              if (oldComputed && typeof oldComputed.dispose == 'function') oldComputed.dispose();
              ko.utils.domData.set(element, templateComputedDomDataKey, newComputed && newComputed.isActive() ? newComputed : undefined);
            }
            ko.bindingHandlers['template'] = {
              'init': function (element, valueAccessor) {
                var bindingValue = ko.utils.unwrapObservable(valueAccessor());
                if (typeof bindingValue == "string" || bindingValue['name']) {
                  ko.virtualElements.emptyNode(element);
                } else if ('nodes' in bindingValue) {
                  var nodes = bindingValue['nodes'] || [];
                  if (ko.isObservable(nodes)) {
                    throw new Error('The "nodes" option must be a plain, non-observable array.');
                  }
                  var container = ko.utils.moveCleanedNodesToContainerElement(nodes);
                  new ko.templateSources.anonymousTemplate(element)['nodes'](container);
                } else {
                  var templateNodes = ko.virtualElements.childNodes(element),
                      container = ko.utils.moveCleanedNodesToContainerElement(templateNodes);
                  new ko.templateSources.anonymousTemplate(element)['nodes'](container);
                }
                return { 'controlsDescendantBindings': true };
              },
              'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var value = valueAccessor(),
                    dataValue,
                    options = ko.utils.unwrapObservable(value),
                    shouldDisplay = true,
                    templateComputed = null,
                    templateName;
                if (typeof options == "string") {
                  templateName = value;
                  options = {};
                } else {
                  templateName = options['name'];
                  if ('if' in options) shouldDisplay = ko.utils.unwrapObservable(options['if']);
                  if (shouldDisplay && 'ifnot' in options) shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);
                  dataValue = ko.utils.unwrapObservable(options['data']);
                }
                if ('foreach' in options) {
                  var dataArray = shouldDisplay && options['foreach'] || [];
                  templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
                } else if (!shouldDisplay) {
                  ko.virtualElements.emptyNode(element);
                } else {
                  var innerBindingContext = 'data' in options ? bindingContext['createChildContext'](dataValue, options['as']) : bindingContext;
                  templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
                }
                disposeOldComputedAndStoreNewOne(element, templateComputed);
              }
            };
            ko.expressionRewriting.bindingRewriteValidators['template'] = function (bindingValue) {
              var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);
              if (parsedBindingValue.length == 1 && parsedBindingValue[0]['unknown']) return null;
              if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name")) return null;
              return "This template engine does not support anonymous templates nested within its templates";
            };
            ko.virtualElements.allowedBindings['template'] = true;
          })();
          ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
          ko.exportSymbol('renderTemplate', ko.renderTemplate);
          ko.utils.findMovesInArrayComparison = function (left, right, limitFailedCompares) {
            if (left.length && right.length) {
              var failedCompares, l, r, leftItem, rightItem;
              for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
                for (r = 0; rightItem = right[r]; ++r) {
                  if (leftItem['value'] === rightItem['value']) {
                    leftItem['moved'] = rightItem['index'];
                    rightItem['moved'] = leftItem['index'];
                    right.splice(r, 1);
                    failedCompares = r = 0;
                    break;
                  }
                }
                failedCompares += r;
              }
            }
          };
          ko.utils.compareArrays = function () {
            var statusNotInOld = 'added',
                statusNotInNew = 'deleted';
            function compareArrays(oldArray, newArray, options) {
              options = typeof options === 'boolean' ? { 'dontLimitMoves': options } : options || {};
              oldArray = oldArray || [];
              newArray = newArray || [];
              if (oldArray.length < newArray.length) return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);else return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
            }
            function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
              var myMin = Math.min,
                  myMax = Math.max,
                  editDistanceMatrix = [],
                  smlIndex,
                  smlIndexMax = smlArray.length,
                  bigIndex,
                  bigIndexMax = bigArray.length,
                  compareRange = bigIndexMax - smlIndexMax || 1,
                  maxDistance = smlIndexMax + bigIndexMax + 1,
                  thisRow,
                  lastRow,
                  bigIndexMaxForRow,
                  bigIndexMinForRow;
              for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
                lastRow = thisRow;
                editDistanceMatrix.push(thisRow = []);
                bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
                bigIndexMinForRow = myMax(0, smlIndex - 1);
                for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                  if (!bigIndex) thisRow[bigIndex] = smlIndex + 1;else if (!smlIndex) thisRow[bigIndex] = bigIndex + 1;else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1]) thisRow[bigIndex] = lastRow[bigIndex - 1];else {
                    var northDistance = lastRow[bigIndex] || maxDistance;
                    var westDistance = thisRow[bigIndex - 1] || maxDistance;
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                  }
                }
              }
              var editScript = [],
                  meMinusOne,
                  notInSml = [],
                  notInBig = [];
              for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
                meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
                if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex - 1]) {
                  notInSml.push(editScript[editScript.length] = {
                    'status': statusNotInSml,
                    'value': bigArray[--bigIndex],
                    'index': bigIndex
                  });
                } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                  notInBig.push(editScript[editScript.length] = {
                    'status': statusNotInBig,
                    'value': smlArray[--smlIndex],
                    'index': smlIndex
                  });
                } else {
                  --bigIndex;
                  --smlIndex;
                  if (!options['sparse']) {
                    editScript.push({
                      'status': "retained",
                      'value': bigArray[bigIndex]
                    });
                  }
                }
              }
              ko.utils.findMovesInArrayComparison(notInBig, notInSml, !options['dontLimitMoves'] && smlIndexMax * 10);
              return editScript.reverse();
            }
            return compareArrays;
          }();
          ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);
          (function () {
            function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
              var mappedNodes = [];
              var dependentObservable = ko.dependentObservable(function () {
                var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];
                if (mappedNodes.length > 0) {
                  ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                  if (callbackAfterAddingNodes) ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
                }
                mappedNodes.length = 0;
                ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
              }, null, {
                disposeWhenNodeIsRemoved: containerNode,
                disposeWhen: function () {
                  return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes);
                }
              });
              return {
                mappedNodes: mappedNodes,
                dependentObservable: dependentObservable.isActive() ? dependentObservable : undefined
              };
            }
            var lastMappingResultDomDataKey = ko.utils.domData.nextKey(),
                deletedItemDummyValue = ko.utils.domData.nextKey();
            ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
              array = array || [];
              options = options || {};
              var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
              var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
              var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) {
                return x.arrayEntry;
              });
              var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);
              var newMappingResult = [];
              var lastMappingResultIndex = 0;
              var newMappingResultIndex = 0;
              var nodesToDelete = [];
              var itemsToProcess = [];
              var itemsForBeforeRemoveCallbacks = [];
              var itemsForMoveCallbacks = [];
              var itemsForAfterAddCallbacks = [];
              var mapData;
              function itemMovedOrRetained(editScriptIndex, oldPosition) {
                mapData = lastMappingResult[oldPosition];
                if (newMappingResultIndex !== oldPosition) itemsForMoveCallbacks[editScriptIndex] = mapData;
                mapData.indexObservable(newMappingResultIndex++);
                ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
                newMappingResult.push(mapData);
                itemsToProcess.push(mapData);
              }
              function callCallback(callback, items) {
                if (callback) {
                  for (var i = 0, n = items.length; i < n; i++) {
                    if (items[i]) {
                      ko.utils.arrayForEach(items[i].mappedNodes, function (node) {
                        callback(node, i, items[i].arrayEntry);
                      });
                    }
                  }
                }
              }
              for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
                movedIndex = editScriptItem['moved'];
                switch (editScriptItem['status']) {
                  case "deleted":
                    if (movedIndex === undefined) {
                      mapData = lastMappingResult[lastMappingResultIndex];
                      if (mapData.dependentObservable) {
                        mapData.dependentObservable.dispose();
                        mapData.dependentObservable = undefined;
                      }
                      if (ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode).length) {
                        if (options['beforeRemove']) {
                          newMappingResult.push(mapData);
                          itemsToProcess.push(mapData);
                          if (mapData.arrayEntry === deletedItemDummyValue) {
                            mapData = null;
                          } else {
                            itemsForBeforeRemoveCallbacks[i] = mapData;
                          }
                        }
                        if (mapData) {
                          nodesToDelete.push.apply(nodesToDelete, mapData.mappedNodes);
                        }
                      }
                    }
                    lastMappingResultIndex++;
                    break;
                  case "retained":
                    itemMovedOrRetained(i, lastMappingResultIndex++);
                    break;
                  case "added":
                    if (movedIndex !== undefined) {
                      itemMovedOrRetained(i, movedIndex);
                    } else {
                      mapData = {
                        arrayEntry: editScriptItem['value'],
                        indexObservable: ko.observable(newMappingResultIndex++)
                      };
                      newMappingResult.push(mapData);
                      itemsToProcess.push(mapData);
                      if (!isFirstExecution) itemsForAfterAddCallbacks[i] = mapData;
                    }
                    break;
                }
              }
              ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
              callCallback(options['beforeMove'], itemsForMoveCallbacks);
              ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);
              for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
                if (!mapData.mappedNodes) ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));
                for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
                  if (node !== nextNode) ko.virtualElements.insertAfter(domNode, node, lastNode);
                }
                if (!mapData.initialized && callbackAfterAddingNodes) {
                  callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                  mapData.initialized = true;
                }
              }
              callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);
              for (i = 0; i < itemsForBeforeRemoveCallbacks.length; ++i) {
                if (itemsForBeforeRemoveCallbacks[i]) {
                  itemsForBeforeRemoveCallbacks[i].arrayEntry = deletedItemDummyValue;
                }
              }
              callCallback(options['afterMove'], itemsForMoveCallbacks);
              callCallback(options['afterAdd'], itemsForAfterAddCallbacks);
            };
          })();
          ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
          ko.nativeTemplateEngine = function () {
            this['allowTemplateRewriting'] = false;
          };
          ko.nativeTemplateEngine.prototype = new ko.templateEngine();
          ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
          ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
            var useNodesIfAvailable = !(ko.utils.ieVersion < 9),
                templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
                templateNodes = templateNodesFunc ? templateSource['nodes']() : null;
            if (templateNodes) {
              return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
            } else {
              var templateText = templateSource['text']();
              return ko.utils.parseHtmlFragment(templateText, templateDocument);
            }
          };
          ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
          ko.setTemplateEngine(ko.nativeTemplateEngine.instance);
          ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
          (function () {
            ko.jqueryTmplTemplateEngine = function () {
              var jQueryTmplVersion = this.jQueryTmplVersion = function () {
                if (!jQueryInstance || !jQueryInstance['tmpl']) return 0;
                try {
                  if (jQueryInstance['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    return 2;
                  }
                } catch (ex) {}
                return 1;
              }();
              function ensureHasReferencedJQueryTemplates() {
                if (jQueryTmplVersion < 2) throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
              }
              function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
                return jQueryInstance['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
              }
              this['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
                templateDocument = templateDocument || document;
                options = options || {};
                ensureHasReferencedJQueryTemplates();
                var precompiled = templateSource['data']('precompiled');
                if (!precompiled) {
                  var templateText = templateSource['text']() || "";
                  templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";
                  precompiled = jQueryInstance['template'](null, templateText);
                  templateSource['data']('precompiled', precompiled);
                }
                var data = [bindingContext['$data']];
                var jQueryTemplateOptions = jQueryInstance['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);
                var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
                resultNodes['appendTo'](templateDocument.createElement("div"));
                jQueryInstance['fragments'] = {};
                return resultNodes;
              };
              this['createJavaScriptEvaluatorBlock'] = function (script) {
                return "{{ko_code ((function() { return " + script + " })()) }}";
              };
              this['addTemplate'] = function (templateName, templateMarkup) {
                document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
              };
              if (jQueryTmplVersion > 0) {
                jQueryInstance['tmpl']['tag']['ko_code'] = { open: "__.push($1 || '');" };
                jQueryInstance['tmpl']['tag']['ko_with'] = {
                  open: "with($1) {",
                  close: "} "
                };
              }
            };
            ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
            ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;
            var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
            if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0) ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);
            ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
          })();
        });
      })();
    })();
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic("npm:knockout@3.4.0.js", ["npm:knockout@3.4.0/build/output/knockout-latest.debug.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:knockout@3.4.0/build/output/knockout-latest.debug.js");
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.7/library/modules/$.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.7/library/fn/object/define-property.js', ['npm:core-js@1.2.7/library/modules/$.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $ = $__require('npm:core-js@1.2.7/library/modules/$.js');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  return module.exports;
});
System.registerDynamic("npm:babel-runtime@5.8.38/core-js/object/define-property.js", ["npm:core-js@1.2.7/library/fn/object/define-property.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = { "default": $__require("npm:core-js@1.2.7/library/fn/object/define-property.js"), __esModule: true };
  return module.exports;
});
System.registerDynamic("npm:babel-runtime@5.8.38/helpers/create-class.js", ["npm:babel-runtime@5.8.38/core-js/object/define-property.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var _Object$defineProperty = $__require("npm:babel-runtime@5.8.38/core-js/object/define-property.js")["default"];
  exports["default"] = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  exports.__esModule = true;
  return module.exports;
});
System.registerDynamic("npm:babel-runtime@5.8.38/helpers/class-call-check.js", [], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  exports["default"] = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  exports.__esModule = true;
  return module.exports;
});
(function() {
var define = System.amdDefine;
"format amd";
;
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define("npm:moment@2.15.0/moment.js", [], factory) : global.moment = factory();
}(this, function() {
  'use strict';
  var hookCallback;
  function utils_hooks__hooks() {
    return hookCallback.apply(null, arguments);
  }
  function setHookCallback(callback) {
    hookCallback = callback;
  }
  function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
  }
  function isObject(input) {
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
  }
  function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
      return false;
    }
    return true;
  }
  function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
  }
  function map(arr, fn) {
    var res = [],
        i;
    for (i = 0; i < arr.length; ++i) {
      res.push(fn(arr[i], i));
    }
    return res;
  }
  function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  }
  function extend(a, b) {
    for (var i in b) {
      if (hasOwnProp(b, i)) {
        a[i] = b[i];
      }
    }
    if (hasOwnProp(b, 'toString')) {
      a.toString = b.toString;
    }
    if (hasOwnProp(b, 'valueOf')) {
      a.valueOf = b.valueOf;
    }
    return a;
  }
  function create_utc__createUTC(input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
  }
  function defaultParsingFlags() {
    return {
      empty: false,
      unusedTokens: [],
      unusedInput: [],
      overflow: -2,
      charsLeftOver: 0,
      nullInput: false,
      invalidMonth: null,
      invalidFormat: false,
      userInvalidated: false,
      iso: false,
      parsedDateParts: [],
      meridiem: null
    };
  }
  function getParsingFlags(m) {
    if (m._pf == null) {
      m._pf = defaultParsingFlags();
    }
    return m._pf;
  }
  var some;
  if (Array.prototype.some) {
    some = Array.prototype.some;
  } else {
    some = function(fun) {
      var t = Object(this);
      var len = t.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (i in t && fun.call(this, t[i], i, t)) {
          return true;
        }
      }
      return false;
    };
  }
  function valid__isValid(m) {
    if (m._isValid == null) {
      var flags = getParsingFlags(m);
      var parsedParts = some.call(flags.parsedDateParts, function(i) {
        return i != null;
      });
      var isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidMonth && !flags.invalidWeekday && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || (flags.meridiem && parsedParts));
      if (m._strict) {
        isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
      }
      if (Object.isFrozen == null || !Object.isFrozen(m)) {
        m._isValid = isNowValid;
      } else {
        return isNowValid;
      }
    }
    return m._isValid;
  }
  function valid__createInvalid(flags) {
    var m = create_utc__createUTC(NaN);
    if (flags != null) {
      extend(getParsingFlags(m), flags);
    } else {
      getParsingFlags(m).userInvalidated = true;
    }
    return m;
  }
  function isUndefined(input) {
    return input === void 0;
  }
  var momentProperties = utils_hooks__hooks.momentProperties = [];
  function copyConfig(to, from) {
    var i,
        prop,
        val;
    if (!isUndefined(from._isAMomentObject)) {
      to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
      to._i = from._i;
    }
    if (!isUndefined(from._f)) {
      to._f = from._f;
    }
    if (!isUndefined(from._l)) {
      to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
      to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
      to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
      to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
      to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
      to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
      to._locale = from._locale;
    }
    if (momentProperties.length > 0) {
      for (i in momentProperties) {
        prop = momentProperties[i];
        val = from[prop];
        if (!isUndefined(val)) {
          to[prop] = val;
        }
      }
    }
    return to;
  }
  var updateInProgress = false;
  function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (updateInProgress === false) {
      updateInProgress = true;
      utils_hooks__hooks.updateOffset(this);
      updateInProgress = false;
    }
  }
  function isMoment(obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
  }
  function absFloor(number) {
    if (number < 0) {
      return Math.ceil(number) || 0;
    } else {
      return Math.floor(number);
    }
  }
  function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;
    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
      value = absFloor(coercedNumber);
    }
    return value;
  }
  function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
      if ((dontConvert && array1[i] !== array2[i]) || (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
        diffs++;
      }
    }
    return diffs + lengthDiff;
  }
  function warn(msg) {
    if (utils_hooks__hooks.suppressDeprecationWarnings === false && (typeof console !== 'undefined') && console.warn) {
      console.warn('Deprecation warning: ' + msg);
    }
  }
  function deprecate(msg, fn) {
    var firstTime = true;
    return extend(function() {
      if (utils_hooks__hooks.deprecationHandler != null) {
        utils_hooks__hooks.deprecationHandler(null, msg);
      }
      if (firstTime) {
        var args = [];
        var arg;
        for (var i = 0; i < arguments.length; i++) {
          arg = '';
          if (typeof arguments[i] === 'object') {
            arg += '\n[' + i + '] ';
            for (var key in arguments[0]) {
              arg += key + ': ' + arguments[0][key] + ', ';
            }
            arg = arg.slice(0, -2);
          } else {
            arg = arguments[i];
          }
          args.push(arg);
        }
        warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
        firstTime = false;
      }
      return fn.apply(this, arguments);
    }, fn);
  }
  var deprecations = {};
  function deprecateSimple(name, msg) {
    if (utils_hooks__hooks.deprecationHandler != null) {
      utils_hooks__hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
      warn(msg);
      deprecations[name] = true;
    }
  }
  utils_hooks__hooks.suppressDeprecationWarnings = false;
  utils_hooks__hooks.deprecationHandler = null;
  function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
  }
  function locale_set__set(config) {
    var prop,
        i;
    for (i in config) {
      prop = config[i];
      if (isFunction(prop)) {
        this[i] = prop;
      } else {
        this['_' + i] = prop;
      }
    }
    this._config = config;
    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
  }
  function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig),
        prop;
    for (prop in childConfig) {
      if (hasOwnProp(childConfig, prop)) {
        if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
          res[prop] = {};
          extend(res[prop], parentConfig[prop]);
          extend(res[prop], childConfig[prop]);
        } else if (childConfig[prop] != null) {
          res[prop] = childConfig[prop];
        } else {
          delete res[prop];
        }
      }
    }
    for (prop in parentConfig) {
      if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
        res[prop] = extend({}, res[prop]);
      }
    }
    return res;
  }
  function Locale(config) {
    if (config != null) {
      this.set(config);
    }
  }
  var keys;
  if (Object.keys) {
    keys = Object.keys;
  } else {
    keys = function(obj) {
      var i,
          res = [];
      for (i in obj) {
        if (hasOwnProp(obj, i)) {
          res.push(i);
        }
      }
      return res;
    };
  }
  var defaultCalendar = {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: '[Last] dddd [at] LT',
    sameElse: 'L'
  };
  function locale_calendar__calendar(key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
  }
  var defaultLongDateFormat = {
    LTS: 'h:mm:ss A',
    LT: 'h:mm A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A'
  };
  function longDateFormat(key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];
    if (format || !formatUpper) {
      return format;
    }
    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function(val) {
      return val.slice(1);
    });
    return this._longDateFormat[key];
  }
  var defaultInvalidDate = 'Invalid date';
  function invalidDate() {
    return this._invalidDate;
  }
  var defaultOrdinal = '%d';
  var defaultOrdinalParse = /\d{1,2}/;
  function ordinal(number) {
    return this._ordinal.replace('%d', number);
  }
  var defaultRelativeTime = {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  };
  function relative__relativeTime(number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
  }
  function pastFuture(diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
  }
  var aliases = {};
  function addUnitAlias(unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
  }
  function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
  }
  function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;
    for (prop in inputObject) {
      if (hasOwnProp(inputObject, prop)) {
        normalizedProp = normalizeUnits(prop);
        if (normalizedProp) {
          normalizedInput[normalizedProp] = inputObject[prop];
        }
      }
    }
    return normalizedInput;
  }
  var priorities = {};
  function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
  }
  function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
      units.push({
        unit: u,
        priority: priorities[u]
      });
    }
    units.sort(function(a, b) {
      return a.priority - b.priority;
    });
    return units;
  }
  function makeGetSet(unit, keepTime) {
    return function(value) {
      if (value != null) {
        get_set__set(this, unit, value);
        utils_hooks__hooks.updateOffset(this, keepTime);
        return this;
      } else {
        return get_set__get(this, unit);
      }
    };
  }
  function get_set__get(mom, unit) {
    return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
  }
  function get_set__set(mom, unit, value) {
    if (mom.isValid()) {
      mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
  }
  function stringGet(units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
      return this[units]();
    }
    return this;
  }
  function stringSet(units, value) {
    if (typeof units === 'object') {
      units = normalizeObjectUnits(units);
      var prioritized = getPrioritizedUnits(units);
      for (var i = 0; i < prioritized.length; i++) {
        this[prioritized[i].unit](units[prioritized[i].unit]);
      }
    } else {
      units = normalizeUnits(units);
      if (isFunction(this[units])) {
        return this[units](value);
      }
    }
    return this;
  }
  function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
  }
  var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
  var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
  var formatFunctions = {};
  var formatTokenFunctions = {};
  function addFormatToken(token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
      func = function() {
        return this[callback]();
      };
    }
    if (token) {
      formatTokenFunctions[token] = func;
    }
    if (padded) {
      formatTokenFunctions[padded[0]] = function() {
        return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
      };
    }
    if (ordinal) {
      formatTokenFunctions[ordinal] = function() {
        return this.localeData().ordinal(func.apply(this, arguments), token);
      };
    }
  }
  function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
      return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
  }
  function makeFormatFunction(format) {
    var array = format.match(formattingTokens),
        i,
        length;
    for (i = 0, length = array.length; i < length; i++) {
      if (formatTokenFunctions[array[i]]) {
        array[i] = formatTokenFunctions[array[i]];
      } else {
        array[i] = removeFormattingTokens(array[i]);
      }
    }
    return function(mom) {
      var output = '',
          i;
      for (i = 0; i < length; i++) {
        output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
      }
      return output;
    };
  }
  function formatMoment(m, format) {
    if (!m.isValid()) {
      return m.localeData().invalidDate();
    }
    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
    return formatFunctions[format](m);
  }
  function expandFormat(format, locale) {
    var i = 5;
    function replaceLongDateFormatTokens(input) {
      return locale.longDateFormat(input) || input;
    }
    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
      format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
      localFormattingTokens.lastIndex = 0;
      i -= 1;
    }
    return format;
  }
  var match1 = /\d/;
  var match2 = /\d\d/;
  var match3 = /\d{3}/;
  var match4 = /\d{4}/;
  var match6 = /[+-]?\d{6}/;
  var match1to2 = /\d\d?/;
  var match3to4 = /\d\d\d\d?/;
  var match5to6 = /\d\d\d\d\d\d?/;
  var match1to3 = /\d{1,3}/;
  var match1to4 = /\d{1,4}/;
  var match1to6 = /[+-]?\d{1,6}/;
  var matchUnsigned = /\d+/;
  var matchSigned = /[+-]?\d+/;
  var matchOffset = /Z|[+-]\d\d:?\d\d/gi;
  var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi;
  var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/;
  var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var regexes = {};
  function addRegexToken(token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function(isStrict, localeData) {
      return (isStrict && strictRegex) ? strictRegex : regex;
    };
  }
  function getParseRegexForToken(token, config) {
    if (!hasOwnProp(regexes, token)) {
      return new RegExp(unescapeFormat(token));
    }
    return regexes[token](config._strict, config._locale);
  }
  function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
      return p1 || p2 || p3 || p4;
    }));
  }
  function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  var tokens = {};
  function addParseToken(token, callback) {
    var i,
        func = callback;
    if (typeof token === 'string') {
      token = [token];
    }
    if (typeof callback === 'number') {
      func = function(input, array) {
        array[callback] = toInt(input);
      };
    }
    for (i = 0; i < token.length; i++) {
      tokens[token[i]] = func;
    }
  }
  function addWeekParseToken(token, callback) {
    addParseToken(token, function(input, array, config, token) {
      config._w = config._w || {};
      callback(input, config._w, config, token);
    });
  }
  function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
      tokens[token](input, config._a, config, token);
    }
  }
  var YEAR = 0;
  var MONTH = 1;
  var DATE = 2;
  var HOUR = 3;
  var MINUTE = 4;
  var SECOND = 5;
  var MILLISECOND = 6;
  var WEEK = 7;
  var WEEKDAY = 8;
  var indexOf;
  if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
  } else {
    indexOf = function(o) {
      var i;
      for (i = 0; i < this.length; ++i) {
        if (this[i] === o) {
          return i;
        }
      }
      return -1;
    };
  }
  function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  }
  addFormatToken('M', ['MM', 2], 'Mo', function() {
    return this.month() + 1;
  });
  addFormatToken('MMM', 0, 0, function(format) {
    return this.localeData().monthsShort(this, format);
  });
  addFormatToken('MMMM', 0, 0, function(format) {
    return this.localeData().months(this, format);
  });
  addUnitAlias('month', 'M');
  addUnitPriority('month', 8);
  addRegexToken('M', match1to2);
  addRegexToken('MM', match1to2, match2);
  addRegexToken('MMM', function(isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
  });
  addRegexToken('MMMM', function(isStrict, locale) {
    return locale.monthsRegex(isStrict);
  });
  addParseToken(['M', 'MM'], function(input, array) {
    array[MONTH] = toInt(input) - 1;
  });
  addParseToken(['MMM', 'MMMM'], function(input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    if (month != null) {
      array[MONTH] = month;
    } else {
      getParsingFlags(config).invalidMonth = input;
    }
  });
  var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
  var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
  function localeMonths(m, format) {
    if (!m) {
      return this._months;
    }
    return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
  }
  var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
  function localeMonthsShort(m, format) {
    if (!m) {
      return this._monthsShort;
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
  }
  function units_month__handleStrictParse(monthName, format, strict) {
    var i,
        ii,
        mom,
        llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
      this._monthsParse = [];
      this._longMonthsParse = [];
      this._shortMonthsParse = [];
      for (i = 0; i < 12; ++i) {
        mom = create_utc__createUTC([2000, i]);
        this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
        this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
      }
    }
    if (strict) {
      if (format === 'MMM') {
        ii = indexOf.call(this._shortMonthsParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._longMonthsParse, llc);
        return ii !== -1 ? ii : null;
      }
    } else {
      if (format === 'MMM') {
        ii = indexOf.call(this._shortMonthsParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._longMonthsParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._longMonthsParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._shortMonthsParse, llc);
        return ii !== -1 ? ii : null;
      }
    }
  }
  function localeMonthsParse(monthName, format, strict) {
    var i,
        mom,
        regex;
    if (this._monthsParseExact) {
      return units_month__handleStrictParse.call(this, monthName, format, strict);
    }
    if (!this._monthsParse) {
      this._monthsParse = [];
      this._longMonthsParse = [];
      this._shortMonthsParse = [];
    }
    for (i = 0; i < 12; i++) {
      mom = create_utc__createUTC([2000, i]);
      if (strict && !this._longMonthsParse[i]) {
        this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
        this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
      }
      if (!strict && !this._monthsParse[i]) {
        regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
        this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
      }
      if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
        return i;
      } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
        return i;
      } else if (!strict && this._monthsParse[i].test(monthName)) {
        return i;
      }
    }
  }
  function setMonth(mom, value) {
    var dayOfMonth;
    if (!mom.isValid()) {
      return mom;
    }
    if (typeof value === 'string') {
      if (/^\d+$/.test(value)) {
        value = toInt(value);
      } else {
        value = mom.localeData().monthsParse(value);
        if (typeof value !== 'number') {
          return mom;
        }
      }
    }
    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
  }
  function getSetMonth(value) {
    if (value != null) {
      setMonth(this, value);
      utils_hooks__hooks.updateOffset(this, true);
      return this;
    } else {
      return get_set__get(this, 'Month');
    }
  }
  function getDaysInMonth() {
    return daysInMonth(this.year(), this.month());
  }
  var defaultMonthsShortRegex = matchWord;
  function monthsShortRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!hasOwnProp(this, '_monthsRegex')) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsShortStrictRegex;
      } else {
        return this._monthsShortRegex;
      }
    } else {
      if (!hasOwnProp(this, '_monthsShortRegex')) {
        this._monthsShortRegex = defaultMonthsShortRegex;
      }
      return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
    }
  }
  var defaultMonthsRegex = matchWord;
  function monthsRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!hasOwnProp(this, '_monthsRegex')) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsStrictRegex;
      } else {
        return this._monthsRegex;
      }
    } else {
      if (!hasOwnProp(this, '_monthsRegex')) {
        this._monthsRegex = defaultMonthsRegex;
      }
      return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
    }
  }
  function computeMonthsParse() {
    function cmpLenRev(a, b) {
      return b.length - a.length;
    }
    var shortPieces = [],
        longPieces = [],
        mixedPieces = [],
        i,
        mom;
    for (i = 0; i < 12; i++) {
      mom = create_utc__createUTC([2000, i]);
      shortPieces.push(this.monthsShort(mom, ''));
      longPieces.push(this.months(mom, ''));
      mixedPieces.push(this.months(mom, ''));
      mixedPieces.push(this.monthsShort(mom, ''));
    }
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
      shortPieces[i] = regexEscape(shortPieces[i]);
      longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
      mixedPieces[i] = regexEscape(mixedPieces[i]);
    }
    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
  }
  addFormatToken('Y', 0, 0, function() {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
  });
  addFormatToken(0, ['YY', 2], 0, function() {
    return this.year() % 100;
  });
  addFormatToken(0, ['YYYY', 4], 0, 'year');
  addFormatToken(0, ['YYYYY', 5], 0, 'year');
  addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');
  addUnitAlias('year', 'y');
  addUnitPriority('year', 1);
  addRegexToken('Y', matchSigned);
  addRegexToken('YY', match1to2, match2);
  addRegexToken('YYYY', match1to4, match4);
  addRegexToken('YYYYY', match1to6, match6);
  addRegexToken('YYYYYY', match1to6, match6);
  addParseToken(['YYYYY', 'YYYYYY'], YEAR);
  addParseToken('YYYY', function(input, array) {
    array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
  });
  addParseToken('YY', function(input, array) {
    array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
  });
  addParseToken('Y', function(input, array) {
    array[YEAR] = parseInt(input, 10);
  });
  function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
  }
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
  utils_hooks__hooks.parseTwoDigitYear = function(input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
  };
  var getSetYear = makeGetSet('FullYear', true);
  function getIsLeapYear() {
    return isLeapYear(this.year());
  }
  function createDate(y, m, d, h, M, s, ms) {
    var date = new Date(y, m, d, h, M, s, ms);
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
      date.setFullYear(y);
    }
    return date;
  }
  function createUTCDate(y) {
    var date = new Date(Date.UTC.apply(null, arguments));
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
    return date;
  }
  function firstWeekOffset(year, dow, doy) {
    var fwd = 7 + dow - doy,
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
    return -fwdlw + fwd - 1;
  }
  function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear,
        resDayOfYear;
    if (dayOfYear <= 0) {
      resYear = year - 1;
      resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
      resYear = year + 1;
      resDayOfYear = dayOfYear - daysInYear(year);
    } else {
      resYear = year;
      resDayOfYear = dayOfYear;
    }
    return {
      year: resYear,
      dayOfYear: resDayOfYear
    };
  }
  function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek,
        resYear;
    if (week < 1) {
      resYear = mom.year() - 1;
      resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
      resWeek = week - weeksInYear(mom.year(), dow, doy);
      resYear = mom.year() + 1;
    } else {
      resYear = mom.year();
      resWeek = week;
    }
    return {
      week: resWeek,
      year: resYear
    };
  }
  function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
  }
  addFormatToken('w', ['ww', 2], 'wo', 'week');
  addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');
  addUnitAlias('week', 'w');
  addUnitAlias('isoWeek', 'W');
  addUnitPriority('week', 5);
  addUnitPriority('isoWeek', 5);
  addRegexToken('w', match1to2);
  addRegexToken('ww', match1to2, match2);
  addRegexToken('W', match1to2);
  addRegexToken('WW', match1to2, match2);
  addWeekParseToken(['w', 'ww', 'W', 'WW'], function(input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
  });
  function localeWeek(mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
  }
  var defaultLocaleWeek = {
    dow: 0,
    doy: 6
  };
  function localeFirstDayOfWeek() {
    return this._week.dow;
  }
  function localeFirstDayOfYear() {
    return this._week.doy;
  }
  function getSetWeek(input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
  }
  function getSetISOWeek(input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
  }
  addFormatToken('d', 0, 'do', 'day');
  addFormatToken('dd', 0, 0, function(format) {
    return this.localeData().weekdaysMin(this, format);
  });
  addFormatToken('ddd', 0, 0, function(format) {
    return this.localeData().weekdaysShort(this, format);
  });
  addFormatToken('dddd', 0, 0, function(format) {
    return this.localeData().weekdays(this, format);
  });
  addFormatToken('e', 0, 0, 'weekday');
  addFormatToken('E', 0, 0, 'isoWeekday');
  addUnitAlias('day', 'd');
  addUnitAlias('weekday', 'e');
  addUnitAlias('isoWeekday', 'E');
  addUnitPriority('day', 11);
  addUnitPriority('weekday', 11);
  addUnitPriority('isoWeekday', 11);
  addRegexToken('d', match1to2);
  addRegexToken('e', match1to2);
  addRegexToken('E', match1to2);
  addRegexToken('dd', function(isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
  });
  addRegexToken('ddd', function(isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
  });
  addRegexToken('dddd', function(isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
  });
  addWeekParseToken(['dd', 'ddd', 'dddd'], function(input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    if (weekday != null) {
      week.d = weekday;
    } else {
      getParsingFlags(config).invalidWeekday = input;
    }
  });
  addWeekParseToken(['d', 'e', 'E'], function(input, week, config, token) {
    week[token] = toInt(input);
  });
  function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
      return input;
    }
    if (!isNaN(input)) {
      return parseInt(input, 10);
    }
    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
      return input;
    }
    return null;
  }
  function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
      return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
  }
  var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
  function localeWeekdays(m, format) {
    if (!m) {
      return this._weekdays;
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] : this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
  }
  var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
  function localeWeekdaysShort(m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
  }
  var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
  function localeWeekdaysMin(m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
  }
  function day_of_week__handleStrictParse(weekdayName, format, strict) {
    var i,
        ii,
        mom,
        llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
      this._weekdaysParse = [];
      this._shortWeekdaysParse = [];
      this._minWeekdaysParse = [];
      for (i = 0; i < 7; ++i) {
        mom = create_utc__createUTC([2000, 1]).day(i);
        this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
        this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
        this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
      }
    }
    if (strict) {
      if (format === 'dddd') {
        ii = indexOf.call(this._weekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else if (format === 'ddd') {
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      }
    } else {
      if (format === 'dddd') {
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else if (format === 'ddd') {
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._minWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      }
    }
  }
  function localeWeekdaysParse(weekdayName, format, strict) {
    var i,
        mom,
        regex;
    if (this._weekdaysParseExact) {
      return day_of_week__handleStrictParse.call(this, weekdayName, format, strict);
    }
    if (!this._weekdaysParse) {
      this._weekdaysParse = [];
      this._minWeekdaysParse = [];
      this._shortWeekdaysParse = [];
      this._fullWeekdaysParse = [];
    }
    for (i = 0; i < 7; i++) {
      mom = create_utc__createUTC([2000, 1]).day(i);
      if (strict && !this._fullWeekdaysParse[i]) {
        this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
        this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
        this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
      }
      if (!this._weekdaysParse[i]) {
        regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
        this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
      }
      if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
        return i;
      } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
        return i;
      } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
        return i;
      } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
        return i;
      }
    }
  }
  function getSetDayOfWeek(input) {
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
      input = parseWeekday(input, this.localeData());
      return this.add(input - day, 'd');
    } else {
      return day;
    }
  }
  function getSetLocaleDayOfWeek(input) {
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
  }
  function getSetISODayOfWeek(input) {
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    if (input != null) {
      var weekday = parseIsoWeekday(input, this.localeData());
      return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
      return this.day() || 7;
    }
  }
  var defaultWeekdaysRegex = matchWord;
  function weekdaysRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!hasOwnProp(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysStrictRegex;
      } else {
        return this._weekdaysRegex;
      }
    } else {
      if (!hasOwnProp(this, '_weekdaysRegex')) {
        this._weekdaysRegex = defaultWeekdaysRegex;
      }
      return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
    }
  }
  var defaultWeekdaysShortRegex = matchWord;
  function weekdaysShortRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!hasOwnProp(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysShortStrictRegex;
      } else {
        return this._weekdaysShortRegex;
      }
    } else {
      if (!hasOwnProp(this, '_weekdaysShortRegex')) {
        this._weekdaysShortRegex = defaultWeekdaysShortRegex;
      }
      return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
  }
  var defaultWeekdaysMinRegex = matchWord;
  function weekdaysMinRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!hasOwnProp(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysMinStrictRegex;
      } else {
        return this._weekdaysMinRegex;
      }
    } else {
      if (!hasOwnProp(this, '_weekdaysMinRegex')) {
        this._weekdaysMinRegex = defaultWeekdaysMinRegex;
      }
      return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
  }
  function computeWeekdaysParse() {
    function cmpLenRev(a, b) {
      return b.length - a.length;
    }
    var minPieces = [],
        shortPieces = [],
        longPieces = [],
        mixedPieces = [],
        i,
        mom,
        minp,
        shortp,
        longp;
    for (i = 0; i < 7; i++) {
      mom = create_utc__createUTC([2000, 1]).day(i);
      minp = this.weekdaysMin(mom, '');
      shortp = this.weekdaysShort(mom, '');
      longp = this.weekdays(mom, '');
      minPieces.push(minp);
      shortPieces.push(shortp);
      longPieces.push(longp);
      mixedPieces.push(minp);
      mixedPieces.push(shortp);
      mixedPieces.push(longp);
    }
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
      shortPieces[i] = regexEscape(shortPieces[i]);
      longPieces[i] = regexEscape(longPieces[i]);
      mixedPieces[i] = regexEscape(mixedPieces[i]);
    }
    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;
    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
  }
  function hFormat() {
    return this.hours() % 12 || 12;
  }
  function kFormat() {
    return this.hours() || 24;
  }
  addFormatToken('H', ['HH', 2], 0, 'hour');
  addFormatToken('h', ['hh', 2], 0, hFormat);
  addFormatToken('k', ['kk', 2], 0, kFormat);
  addFormatToken('hmm', 0, 0, function() {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
  });
  addFormatToken('hmmss', 0, 0, function() {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
  });
  addFormatToken('Hmm', 0, 0, function() {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
  });
  addFormatToken('Hmmss', 0, 0, function() {
    return '' + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
  });
  function meridiem(token, lowercase) {
    addFormatToken(token, 0, 0, function() {
      return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
  }
  meridiem('a', true);
  meridiem('A', false);
  addUnitAlias('hour', 'h');
  addUnitPriority('hour', 13);
  function matchMeridiem(isStrict, locale) {
    return locale._meridiemParse;
  }
  addRegexToken('a', matchMeridiem);
  addRegexToken('A', matchMeridiem);
  addRegexToken('H', match1to2);
  addRegexToken('h', match1to2);
  addRegexToken('HH', match1to2, match2);
  addRegexToken('hh', match1to2, match2);
  addRegexToken('hmm', match3to4);
  addRegexToken('hmmss', match5to6);
  addRegexToken('Hmm', match3to4);
  addRegexToken('Hmmss', match5to6);
  addParseToken(['H', 'HH'], HOUR);
  addParseToken(['a', 'A'], function(input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
  });
  addParseToken(['h', 'hh'], function(input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
  });
  addParseToken('hmm', function(input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
  });
  addParseToken('hmmss', function(input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
  });
  addParseToken('Hmm', function(input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
  });
  addParseToken('Hmmss', function(input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
  });
  function localeIsPM(input) {
    return ((input + '').toLowerCase().charAt(0) === 'p');
  }
  var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
  function localeMeridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'pm' : 'PM';
    } else {
      return isLower ? 'am' : 'AM';
    }
  }
  var getSetHour = makeGetSet('Hours', true);
  var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    ordinalParse: defaultOrdinalParse,
    relativeTime: defaultRelativeTime,
    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,
    week: defaultLocaleWeek,
    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,
    meridiemParse: defaultLocaleMeridiemParse
  };
  var locales = {};
  var globalLocale;
  function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
  }
  function chooseLocale(names) {
    var i = 0,
        j,
        next,
        locale,
        split;
    while (i < names.length) {
      split = normalizeLocale(names[i]).split('-');
      j = split.length;
      next = normalizeLocale(names[i + 1]);
      next = next ? next.split('-') : null;
      while (j > 0) {
        locale = loadLocale(split.slice(0, j).join('-'));
        if (locale) {
          return locale;
        }
        if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
          break;
        }
        j--;
      }
      i++;
    }
    return null;
  }
  function loadLocale(name) {
    var oldLocale = null;
    if (!locales[name] && (typeof module !== 'undefined') && module && module.require) {
      try {
        oldLocale = globalLocale._abbr;
        module.require('./locale/' + name);
        locale_locales__getSetGlobalLocale(oldLocale);
      } catch (e) {}
    }
    return locales[name];
  }
  function locale_locales__getSetGlobalLocale(key, values) {
    var data;
    if (key) {
      if (isUndefined(values)) {
        data = locale_locales__getLocale(key);
      } else {
        data = defineLocale(key, values);
      }
      if (data) {
        globalLocale = data;
      }
    }
    return globalLocale._abbr;
  }
  function defineLocale(name, config) {
    if (config !== null) {
      var parentConfig = baseConfig;
      config.abbr = name;
      if (locales[name] != null) {
        deprecateSimple('defineLocaleOverride', 'use moment.updateLocale(localeName, config) to change ' + 'an existing locale. moment.defineLocale(localeName, ' + 'config) should only be used for creating a new locale ' + 'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
        parentConfig = locales[name]._config;
      } else if (config.parentLocale != null) {
        if (locales[config.parentLocale] != null) {
          parentConfig = locales[config.parentLocale]._config;
        } else {
          deprecateSimple('parentLocaleUndefined', 'specified parentLocale is not defined yet. See http://momentjs.com/guides/#/warnings/parent-locale/');
        }
      }
      locales[name] = new Locale(mergeConfigs(parentConfig, config));
      locale_locales__getSetGlobalLocale(name);
      return locales[name];
    } else {
      delete locales[name];
      return null;
    }
  }
  function updateLocale(name, config) {
    if (config != null) {
      var locale,
          parentConfig = baseConfig;
      if (locales[name] != null) {
        parentConfig = locales[name]._config;
      }
      config = mergeConfigs(parentConfig, config);
      locale = new Locale(config);
      locale.parentLocale = locales[name];
      locales[name] = locale;
      locale_locales__getSetGlobalLocale(name);
    } else {
      if (locales[name] != null) {
        if (locales[name].parentLocale != null) {
          locales[name] = locales[name].parentLocale;
        } else if (locales[name] != null) {
          delete locales[name];
        }
      }
    }
    return locales[name];
  }
  function locale_locales__getLocale(key) {
    var locale;
    if (key && key._locale && key._locale._abbr) {
      key = key._locale._abbr;
    }
    if (!key) {
      return globalLocale;
    }
    if (!isArray(key)) {
      locale = loadLocale(key);
      if (locale) {
        return locale;
      }
      key = [key];
    }
    return chooseLocale(key);
  }
  function locale_locales__listLocales() {
    return keys(locales);
  }
  function checkOverflow(m) {
    var overflow;
    var a = m._a;
    if (a && getParsingFlags(m).overflow === -2) {
      overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
      if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
        overflow = DATE;
      }
      if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
        overflow = WEEK;
      }
      if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
        overflow = WEEKDAY;
      }
      getParsingFlags(m).overflow = overflow;
    }
    return m;
  }
  var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
  var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
  var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;
  var isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/], ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/], ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/], ['GGGG-[W]WW', /\d{4}-W\d\d/, false], ['YYYY-DDD', /\d{4}-\d{3}/], ['YYYY-MM', /\d{4}-\d\d/, false], ['YYYYYYMMDD', /[+-]\d{10}/], ['YYYYMMDD', /\d{8}/], ['GGGG[W]WWE', /\d{4}W\d{3}/], ['GGGG[W]WW', /\d{4}W\d{2}/, false], ['YYYYDDD', /\d{7}/]];
  var isoTimes = [['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/], ['HH:mm:ss', /\d\d:\d\d:\d\d/], ['HH:mm', /\d\d:\d\d/], ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/], ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/], ['HHmmss', /\d\d\d\d\d\d/], ['HHmm', /\d\d\d\d/], ['HH', /\d\d/]];
  var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;
  function configFromISO(config) {
    var i,
        l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime,
        dateFormat,
        timeFormat,
        tzFormat;
    if (match) {
      getParsingFlags(config).iso = true;
      for (i = 0, l = isoDates.length; i < l; i++) {
        if (isoDates[i][1].exec(match[1])) {
          dateFormat = isoDates[i][0];
          allowTime = isoDates[i][2] !== false;
          break;
        }
      }
      if (dateFormat == null) {
        config._isValid = false;
        return;
      }
      if (match[3]) {
        for (i = 0, l = isoTimes.length; i < l; i++) {
          if (isoTimes[i][1].exec(match[3])) {
            timeFormat = (match[2] || ' ') + isoTimes[i][0];
            break;
          }
        }
        if (timeFormat == null) {
          config._isValid = false;
          return;
        }
      }
      if (!allowTime && timeFormat != null) {
        config._isValid = false;
        return;
      }
      if (match[4]) {
        if (tzRegex.exec(match[4])) {
          tzFormat = 'Z';
        } else {
          config._isValid = false;
          return;
        }
      }
      config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
      configFromStringAndFormat(config);
    } else {
      config._isValid = false;
    }
  }
  function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);
    if (matched !== null) {
      config._d = new Date(+matched[1]);
      return;
    }
    configFromISO(config);
    if (config._isValid === false) {
      delete config._isValid;
      utils_hooks__hooks.createFromInputFallback(config);
    }
  }
  utils_hooks__hooks.createFromInputFallback = deprecate('value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' + 'which is not reliable across all browsers and versions. Non ISO date formats are ' + 'discouraged and will be removed in an upcoming major release. Please refer to ' + 'http://momentjs.com/guides/#/warnings/js-date/ for more info.', function(config) {
    config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
  });
  function defaults(a, b, c) {
    if (a != null) {
      return a;
    }
    if (b != null) {
      return b;
    }
    return c;
  }
  function currentDateArray(config) {
    var nowValue = new Date(utils_hooks__hooks.now());
    if (config._useUTC) {
      return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
  }
  function configFromArray(config) {
    var i,
        date,
        input = [],
        currentDate,
        yearToUse;
    if (config._d) {
      return;
    }
    currentDate = currentDateArray(config);
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
      dayOfYearFromWeekInfo(config);
    }
    if (config._dayOfYear) {
      yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
      if (config._dayOfYear > daysInYear(yearToUse)) {
        getParsingFlags(config)._overflowDayOfYear = true;
      }
      date = createUTCDate(yearToUse, 0, config._dayOfYear);
      config._a[MONTH] = date.getUTCMonth();
      config._a[DATE] = date.getUTCDate();
    }
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
      config._a[i] = input[i] = currentDate[i];
    }
    for (; i < 7; i++) {
      config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }
    if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
      config._nextDay = true;
      config._a[HOUR] = 0;
    }
    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    if (config._tzm != null) {
      config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }
    if (config._nextDay) {
      config._a[HOUR] = 24;
    }
  }
  function dayOfYearFromWeekInfo(config) {
    var w,
        weekYear,
        week,
        weekday,
        dow,
        doy,
        temp,
        weekdayOverflow;
    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
      dow = 1;
      doy = 4;
      weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
      week = defaults(w.W, 1);
      weekday = defaults(w.E, 1);
      if (weekday < 1 || weekday > 7) {
        weekdayOverflow = true;
      }
    } else {
      dow = config._locale._week.dow;
      doy = config._locale._week.doy;
      weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
      week = defaults(w.w, 1);
      if (w.d != null) {
        weekday = w.d;
        if (weekday < 0 || weekday > 6) {
          weekdayOverflow = true;
        }
      } else if (w.e != null) {
        weekday = w.e + dow;
        if (w.e < 0 || w.e > 6) {
          weekdayOverflow = true;
        }
      } else {
        weekday = dow;
      }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
      getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
      getParsingFlags(config)._overflowWeekday = true;
    } else {
      temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
      config._a[YEAR] = temp.year;
      config._dayOfYear = temp.dayOfYear;
    }
  }
  utils_hooks__hooks.ISO_8601 = function() {};
  function configFromStringAndFormat(config) {
    if (config._f === utils_hooks__hooks.ISO_8601) {
      configFromISO(config);
      return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;
    var string = '' + config._i,
        i,
        parsedInput,
        tokens,
        token,
        skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;
    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
    for (i = 0; i < tokens.length; i++) {
      token = tokens[i];
      parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
      if (parsedInput) {
        skipped = string.substr(0, string.indexOf(parsedInput));
        if (skipped.length > 0) {
          getParsingFlags(config).unusedInput.push(skipped);
        }
        string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
        totalParsedInputLength += parsedInput.length;
      }
      if (formatTokenFunctions[token]) {
        if (parsedInput) {
          getParsingFlags(config).empty = false;
        } else {
          getParsingFlags(config).unusedTokens.push(token);
        }
        addTimeToArrayFromToken(token, parsedInput, config);
      } else if (config._strict && !parsedInput) {
        getParsingFlags(config).unusedTokens.push(token);
      }
    }
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
      getParsingFlags(config).unusedInput.push(string);
    }
    if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
      getParsingFlags(config).bigHour = undefined;
    }
    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);
    configFromArray(config);
    checkOverflow(config);
  }
  function meridiemFixWrap(locale, hour, meridiem) {
    var isPm;
    if (meridiem == null) {
      return hour;
    }
    if (locale.meridiemHour != null) {
      return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
      isPm = locale.isPM(meridiem);
      if (isPm && hour < 12) {
        hour += 12;
      }
      if (!isPm && hour === 12) {
        hour = 0;
      }
      return hour;
    } else {
      return hour;
    }
  }
  function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,
        scoreToBeat,
        i,
        currentScore;
    if (config._f.length === 0) {
      getParsingFlags(config).invalidFormat = true;
      config._d = new Date(NaN);
      return;
    }
    for (i = 0; i < config._f.length; i++) {
      currentScore = 0;
      tempConfig = copyConfig({}, config);
      if (config._useUTC != null) {
        tempConfig._useUTC = config._useUTC;
      }
      tempConfig._f = config._f[i];
      configFromStringAndFormat(tempConfig);
      if (!valid__isValid(tempConfig)) {
        continue;
      }
      currentScore += getParsingFlags(tempConfig).charsLeftOver;
      currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
      getParsingFlags(tempConfig).score = currentScore;
      if (scoreToBeat == null || currentScore < scoreToBeat) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
      }
    }
    extend(config, bestMoment || tempConfig);
  }
  function configFromObject(config) {
    if (config._d) {
      return;
    }
    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function(obj) {
      return obj && parseInt(obj, 10);
    });
    configFromArray(config);
  }
  function createFromConfig(config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
      res.add(1, 'd');
      res._nextDay = undefined;
    }
    return res;
  }
  function prepareConfig(config) {
    var input = config._i,
        format = config._f;
    config._locale = config._locale || locale_locales__getLocale(config._l);
    if (input === null || (format === undefined && input === '')) {
      return valid__createInvalid({nullInput: true});
    }
    if (typeof input === 'string') {
      config._i = input = config._locale.preparse(input);
    }
    if (isMoment(input)) {
      return new Moment(checkOverflow(input));
    } else if (isArray(format)) {
      configFromStringAndArray(config);
    } else if (isDate(input)) {
      config._d = input;
    } else if (format) {
      configFromStringAndFormat(config);
    } else {
      configFromInput(config);
    }
    if (!valid__isValid(config)) {
      config._d = null;
    }
    return config;
  }
  function configFromInput(config) {
    var input = config._i;
    if (input === undefined) {
      config._d = new Date(utils_hooks__hooks.now());
    } else if (isDate(input)) {
      config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
      configFromString(config);
    } else if (isArray(input)) {
      config._a = map(input.slice(0), function(obj) {
        return parseInt(obj, 10);
      });
      configFromArray(config);
    } else if (typeof(input) === 'object') {
      configFromObject(config);
    } else if (typeof(input) === 'number') {
      config._d = new Date(input);
    } else {
      utils_hooks__hooks.createFromInputFallback(config);
    }
  }
  function createLocalOrUTC(input, format, locale, strict, isUTC) {
    var c = {};
    if (typeof(locale) === 'boolean') {
      strict = locale;
      locale = undefined;
    }
    if ((isObject(input) && isObjectEmpty(input)) || (isArray(input) && input.length === 0)) {
      input = undefined;
    }
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;
    return createFromConfig(c);
  }
  function local__createLocal(input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
  }
  var prototypeMin = deprecate('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function() {
    var other = local__createLocal.apply(null, arguments);
    if (this.isValid() && other.isValid()) {
      return other < this ? this : other;
    } else {
      return valid__createInvalid();
    }
  });
  var prototypeMax = deprecate('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function() {
    var other = local__createLocal.apply(null, arguments);
    if (this.isValid() && other.isValid()) {
      return other > this ? this : other;
    } else {
      return valid__createInvalid();
    }
  });
  function pickBy(fn, moments) {
    var res,
        i;
    if (moments.length === 1 && isArray(moments[0])) {
      moments = moments[0];
    }
    if (!moments.length) {
      return local__createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
      if (!moments[i].isValid() || moments[i][fn](res)) {
        res = moments[i];
      }
    }
    return res;
  }
  function min() {
    var args = [].slice.call(arguments, 0);
    return pickBy('isBefore', args);
  }
  function max() {
    var args = [].slice.call(arguments, 0);
    return pickBy('isAfter', args);
  }
  var now = function() {
    return Date.now ? Date.now() : +(new Date());
  };
  function Duration(duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;
    this._milliseconds = +milliseconds + seconds * 1e3 + minutes * 6e4 + hours * 1000 * 60 * 60;
    this._days = +days + weeks * 7;
    this._months = +months + quarters * 3 + years * 12;
    this._data = {};
    this._locale = locale_locales__getLocale();
    this._bubble();
  }
  function isDuration(obj) {
    return obj instanceof Duration;
  }
  function absRound(number) {
    if (number < 0) {
      return Math.round(-1 * number) * -1;
    } else {
      return Math.round(number);
    }
  }
  function offset(token, separator) {
    addFormatToken(token, 0, 0, function() {
      var offset = this.utcOffset();
      var sign = '+';
      if (offset < 0) {
        offset = -offset;
        sign = '-';
      }
      return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
  }
  offset('Z', ':');
  offset('ZZ', '');
  addRegexToken('Z', matchShortOffset);
  addRegexToken('ZZ', matchShortOffset);
  addParseToken(['Z', 'ZZ'], function(input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
  });
  var chunkOffset = /([\+\-]|\d\d)/gi;
  function offsetFromString(matcher, string) {
    var matches = ((string || '').match(matcher) || []);
    var chunk = matches[matches.length - 1] || [];
    var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);
    return parts[0] === '+' ? minutes : -minutes;
  }
  function cloneWithOffset(input, model) {
    var res,
        diff;
    if (model._isUTC) {
      res = model.clone();
      diff = (isMoment(input) || isDate(input) ? input.valueOf() : local__createLocal(input).valueOf()) - res.valueOf();
      res._d.setTime(res._d.valueOf() + diff);
      utils_hooks__hooks.updateOffset(res, false);
      return res;
    } else {
      return local__createLocal(input).local();
    }
  }
  function getDateOffset(m) {
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
  }
  utils_hooks__hooks.updateOffset = function() {};
  function getSetOffset(input, keepLocalTime) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    if (input != null) {
      if (typeof input === 'string') {
        input = offsetFromString(matchShortOffset, input);
      } else if (Math.abs(input) < 16) {
        input = input * 60;
      }
      if (!this._isUTC && keepLocalTime) {
        localAdjust = getDateOffset(this);
      }
      this._offset = input;
      this._isUTC = true;
      if (localAdjust != null) {
        this.add(localAdjust, 'm');
      }
      if (offset !== input) {
        if (!keepLocalTime || this._changeInProgress) {
          add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
        } else if (!this._changeInProgress) {
          this._changeInProgress = true;
          utils_hooks__hooks.updateOffset(this, true);
          this._changeInProgress = null;
        }
      }
      return this;
    } else {
      return this._isUTC ? offset : getDateOffset(this);
    }
  }
  function getSetZone(input, keepLocalTime) {
    if (input != null) {
      if (typeof input !== 'string') {
        input = -input;
      }
      this.utcOffset(input, keepLocalTime);
      return this;
    } else {
      return -this.utcOffset();
    }
  }
  function setOffsetToUTC(keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
  }
  function setOffsetToLocal(keepLocalTime) {
    if (this._isUTC) {
      this.utcOffset(0, keepLocalTime);
      this._isUTC = false;
      if (keepLocalTime) {
        this.subtract(getDateOffset(this), 'm');
      }
    }
    return this;
  }
  function setOffsetToParsedOffset() {
    if (this._tzm) {
      this.utcOffset(this._tzm);
    } else if (typeof this._i === 'string') {
      var tZone = offsetFromString(matchOffset, this._i);
      if (tZone === 0) {
        this.utcOffset(0, true);
      } else {
        this.utcOffset(offsetFromString(matchOffset, this._i));
      }
    }
    return this;
  }
  function hasAlignedHourOffset(input) {
    if (!this.isValid()) {
      return false;
    }
    input = input ? local__createLocal(input).utcOffset() : 0;
    return (this.utcOffset() - input) % 60 === 0;
  }
  function isDaylightSavingTime() {
    return (this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset());
  }
  function isDaylightSavingTimeShifted() {
    if (!isUndefined(this._isDSTShifted)) {
      return this._isDSTShifted;
    }
    var c = {};
    copyConfig(c, this);
    c = prepareConfig(c);
    if (c._a) {
      var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
      this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
    } else {
      this._isDSTShifted = false;
    }
    return this._isDSTShifted;
  }
  function isLocal() {
    return this.isValid() ? !this._isUTC : false;
  }
  function isUtcOffset() {
    return this.isValid() ? this._isUTC : false;
  }
  function isUtc() {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
  }
  var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;
  var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;
  function create__createDuration(input, key) {
    var duration = input,
        match = null,
        sign,
        ret,
        diffRes;
    if (isDuration(input)) {
      duration = {
        ms: input._milliseconds,
        d: input._days,
        M: input._months
      };
    } else if (typeof input === 'number') {
      duration = {};
      if (key) {
        duration[key] = input;
      } else {
        duration.milliseconds = input;
      }
    } else if (!!(match = aspNetRegex.exec(input))) {
      sign = (match[1] === '-') ? -1 : 1;
      duration = {
        y: 0,
        d: toInt(match[DATE]) * sign,
        h: toInt(match[HOUR]) * sign,
        m: toInt(match[MINUTE]) * sign,
        s: toInt(match[SECOND]) * sign,
        ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign
      };
    } else if (!!(match = isoRegex.exec(input))) {
      sign = (match[1] === '-') ? -1 : 1;
      duration = {
        y: parseIso(match[2], sign),
        M: parseIso(match[3], sign),
        w: parseIso(match[4], sign),
        d: parseIso(match[5], sign),
        h: parseIso(match[6], sign),
        m: parseIso(match[7], sign),
        s: parseIso(match[8], sign)
      };
    } else if (duration == null) {
      duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
      diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));
      duration = {};
      duration.ms = diffRes.milliseconds;
      duration.M = diffRes.months;
    }
    ret = new Duration(duration);
    if (isDuration(input) && hasOwnProp(input, '_locale')) {
      ret._locale = input._locale;
    }
    return ret;
  }
  create__createDuration.fn = Duration.prototype;
  function parseIso(inp, sign) {
    var res = inp && parseFloat(inp.replace(',', '.'));
    return (isNaN(res) ? 0 : res) * sign;
  }
  function positiveMomentsDifference(base, other) {
    var res = {
      milliseconds: 0,
      months: 0
    };
    res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
      --res.months;
    }
    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));
    return res;
  }
  function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
      return {
        milliseconds: 0,
        months: 0
      };
    }
    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
      res = positiveMomentsDifference(base, other);
    } else {
      res = positiveMomentsDifference(other, base);
      res.milliseconds = -res.milliseconds;
      res.months = -res.months;
    }
    return res;
  }
  function createAdder(direction, name) {
    return function(val, period) {
      var dur,
          tmp;
      if (period !== null && !isNaN(+period)) {
        deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' + 'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
        tmp = val;
        val = period;
        period = tmp;
      }
      val = typeof val === 'string' ? +val : val;
      dur = create__createDuration(val, period);
      add_subtract__addSubtract(this, dur, direction);
      return this;
    };
  }
  function add_subtract__addSubtract(mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);
    if (!mom.isValid()) {
      return;
    }
    updateOffset = updateOffset == null ? true : updateOffset;
    if (milliseconds) {
      mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
      get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
    }
    if (months) {
      setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
      utils_hooks__hooks.updateOffset(mom, days || months);
    }
  }
  var add_subtract__add = createAdder(1, 'add');
  var add_subtract__subtract = createAdder(-1, 'subtract');
  function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
  }
  function moment_calendar__calendar(time, formats) {
    var now = time || local__createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = utils_hooks__hooks.calendarFormat(this, sod) || 'sameElse';
    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);
    return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
  }
  function clone() {
    return new Moment(this);
  }
  function isAfter(input, units) {
    var localInput = isMoment(input) ? input : local__createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
      return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
      return this.valueOf() > localInput.valueOf();
    } else {
      return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
  }
  function isBefore(input, units) {
    var localInput = isMoment(input) ? input : local__createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
      return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
      return this.valueOf() < localInput.valueOf();
    } else {
      return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
  }
  function isBetween(from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) && (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
  }
  function isSame(input, units) {
    var localInput = isMoment(input) ? input : local__createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
      return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
      return this.valueOf() === localInput.valueOf();
    } else {
      inputMs = localInput.valueOf();
      return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
  }
  function isSameOrAfter(input, units) {
    return this.isSame(input, units) || this.isAfter(input, units);
  }
  function isSameOrBefore(input, units) {
    return this.isSame(input, units) || this.isBefore(input, units);
  }
  function diff(input, units, asFloat) {
    var that,
        zoneDelta,
        delta,
        output;
    if (!this.isValid()) {
      return NaN;
    }
    that = cloneWithOffset(input, this);
    if (!that.isValid()) {
      return NaN;
    }
    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
    units = normalizeUnits(units);
    if (units === 'year' || units === 'month' || units === 'quarter') {
      output = monthDiff(this, that);
      if (units === 'quarter') {
        output = output / 3;
      } else if (units === 'year') {
        output = output / 12;
      }
    } else {
      delta = this - that;
      output = units === 'second' ? delta / 1e3 : units === 'minute' ? delta / 6e4 : units === 'hour' ? delta / 36e5 : units === 'day' ? (delta - zoneDelta) / 864e5 : units === 'week' ? (delta - zoneDelta) / 6048e5 : delta;
    }
    return asFloat ? output : absFloor(output);
  }
  function monthDiff(a, b) {
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2,
        adjust;
    if (b - anchor < 0) {
      anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
      adjust = (b - anchor) / (anchor - anchor2);
    } else {
      anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
      adjust = (b - anchor) / (anchor2 - anchor);
    }
    return -(wholeMonthDiff + adjust) || 0;
  }
  utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
  utils_hooks__hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';
  function toString() {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
  }
  function moment_format__toISOString() {
    var m = this.clone().utc();
    if (0 < m.year() && m.year() <= 9999) {
      if (isFunction(Date.prototype.toISOString)) {
        return this.toDate().toISOString();
      } else {
        return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
      }
    } else {
      return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
  }
  function format(inputString) {
    if (!inputString) {
      inputString = this.isUtc() ? utils_hooks__hooks.defaultFormatUtc : utils_hooks__hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
  }
  function from(time, withoutSuffix) {
    if (this.isValid() && ((isMoment(time) && time.isValid()) || local__createLocal(time).isValid())) {
      return create__createDuration({
        to: this,
        from: time
      }).locale(this.locale()).humanize(!withoutSuffix);
    } else {
      return this.localeData().invalidDate();
    }
  }
  function fromNow(withoutSuffix) {
    return this.from(local__createLocal(), withoutSuffix);
  }
  function to(time, withoutSuffix) {
    if (this.isValid() && ((isMoment(time) && time.isValid()) || local__createLocal(time).isValid())) {
      return create__createDuration({
        from: this,
        to: time
      }).locale(this.locale()).humanize(!withoutSuffix);
    } else {
      return this.localeData().invalidDate();
    }
  }
  function toNow(withoutSuffix) {
    return this.to(local__createLocal(), withoutSuffix);
  }
  function locale(key) {
    var newLocaleData;
    if (key === undefined) {
      return this._locale._abbr;
    } else {
      newLocaleData = locale_locales__getLocale(key);
      if (newLocaleData != null) {
        this._locale = newLocaleData;
      }
      return this;
    }
  }
  var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function(key) {
    if (key === undefined) {
      return this.localeData();
    } else {
      return this.locale(key);
    }
  });
  function localeData() {
    return this._locale;
  }
  function startOf(units) {
    units = normalizeUnits(units);
    switch (units) {
      case 'year':
        this.month(0);
      case 'quarter':
      case 'month':
        this.date(1);
      case 'week':
      case 'isoWeek':
      case 'day':
      case 'date':
        this.hours(0);
      case 'hour':
        this.minutes(0);
      case 'minute':
        this.seconds(0);
      case 'second':
        this.milliseconds(0);
    }
    if (units === 'week') {
      this.weekday(0);
    }
    if (units === 'isoWeek') {
      this.isoWeekday(1);
    }
    if (units === 'quarter') {
      this.month(Math.floor(this.month() / 3) * 3);
    }
    return this;
  }
  function endOf(units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
      return this;
    }
    if (units === 'date') {
      units = 'day';
    }
    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
  }
  function to_type__valueOf() {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
  }
  function unix() {
    return Math.floor(this.valueOf() / 1000);
  }
  function toDate() {
    return new Date(this.valueOf());
  }
  function toArray() {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
  }
  function toObject() {
    var m = this;
    return {
      years: m.year(),
      months: m.month(),
      date: m.date(),
      hours: m.hours(),
      minutes: m.minutes(),
      seconds: m.seconds(),
      milliseconds: m.milliseconds()
    };
  }
  function toJSON() {
    return this.isValid() ? this.toISOString() : null;
  }
  function moment_valid__isValid() {
    return valid__isValid(this);
  }
  function parsingFlags() {
    return extend({}, getParsingFlags(this));
  }
  function invalidAt() {
    return getParsingFlags(this).overflow;
  }
  function creationData() {
    return {
      input: this._i,
      format: this._f,
      locale: this._locale,
      isUTC: this._isUTC,
      strict: this._strict
    };
  }
  addFormatToken(0, ['gg', 2], 0, function() {
    return this.weekYear() % 100;
  });
  addFormatToken(0, ['GG', 2], 0, function() {
    return this.isoWeekYear() % 100;
  });
  function addWeekYearFormatToken(token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
  }
  addWeekYearFormatToken('gggg', 'weekYear');
  addWeekYearFormatToken('ggggg', 'weekYear');
  addWeekYearFormatToken('GGGG', 'isoWeekYear');
  addWeekYearFormatToken('GGGGG', 'isoWeekYear');
  addUnitAlias('weekYear', 'gg');
  addUnitAlias('isoWeekYear', 'GG');
  addUnitPriority('weekYear', 1);
  addUnitPriority('isoWeekYear', 1);
  addRegexToken('G', matchSigned);
  addRegexToken('g', matchSigned);
  addRegexToken('GG', match1to2, match2);
  addRegexToken('gg', match1to2, match2);
  addRegexToken('GGGG', match1to4, match4);
  addRegexToken('gggg', match1to4, match4);
  addRegexToken('GGGGG', match1to6, match6);
  addRegexToken('ggggg', match1to6, match6);
  addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function(input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
  });
  addWeekParseToken(['gg', 'GG'], function(input, week, config, token) {
    week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
  });
  function getSetWeekYear(input) {
    return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
  }
  function getSetISOWeekYear(input) {
    return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
  }
  function getISOWeeksInYear() {
    return weeksInYear(this.year(), 1, 4);
  }
  function getWeeksInYear() {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
  }
  function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
      return weekOfYear(this, dow, doy).year;
    } else {
      weeksTarget = weeksInYear(input, dow, doy);
      if (week > weeksTarget) {
        week = weeksTarget;
      }
      return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
  }
  function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
  }
  addFormatToken('Q', 0, 'Qo', 'quarter');
  addUnitAlias('quarter', 'Q');
  addUnitPriority('quarter', 7);
  addRegexToken('Q', match1);
  addParseToken('Q', function(input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
  });
  function getSetQuarter(input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
  }
  addFormatToken('D', ['DD', 2], 'Do', 'date');
  addUnitAlias('date', 'D');
  addUnitPriority('date', 9);
  addRegexToken('D', match1to2);
  addRegexToken('DD', match1to2, match2);
  addRegexToken('Do', function(isStrict, locale) {
    return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
  });
  addParseToken(['D', 'DD'], DATE);
  addParseToken('Do', function(input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
  });
  var getSetDayOfMonth = makeGetSet('Date', true);
  addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');
  addUnitAlias('dayOfYear', 'DDD');
  addUnitPriority('dayOfYear', 4);
  addRegexToken('DDD', match1to3);
  addRegexToken('DDDD', match3);
  addParseToken(['DDD', 'DDDD'], function(input, array, config) {
    config._dayOfYear = toInt(input);
  });
  function getSetDayOfYear(input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
  }
  addFormatToken('m', ['mm', 2], 0, 'minute');
  addUnitAlias('minute', 'm');
  addUnitPriority('minute', 14);
  addRegexToken('m', match1to2);
  addRegexToken('mm', match1to2, match2);
  addParseToken(['m', 'mm'], MINUTE);
  var getSetMinute = makeGetSet('Minutes', false);
  addFormatToken('s', ['ss', 2], 0, 'second');
  addUnitAlias('second', 's');
  addUnitPriority('second', 15);
  addRegexToken('s', match1to2);
  addRegexToken('ss', match1to2, match2);
  addParseToken(['s', 'ss'], SECOND);
  var getSetSecond = makeGetSet('Seconds', false);
  addFormatToken('S', 0, 0, function() {
    return ~~(this.millisecond() / 100);
  });
  addFormatToken(0, ['SS', 2], 0, function() {
    return ~~(this.millisecond() / 10);
  });
  addFormatToken(0, ['SSS', 3], 0, 'millisecond');
  addFormatToken(0, ['SSSS', 4], 0, function() {
    return this.millisecond() * 10;
  });
  addFormatToken(0, ['SSSSS', 5], 0, function() {
    return this.millisecond() * 100;
  });
  addFormatToken(0, ['SSSSSS', 6], 0, function() {
    return this.millisecond() * 1000;
  });
  addFormatToken(0, ['SSSSSSS', 7], 0, function() {
    return this.millisecond() * 10000;
  });
  addFormatToken(0, ['SSSSSSSS', 8], 0, function() {
    return this.millisecond() * 100000;
  });
  addFormatToken(0, ['SSSSSSSSS', 9], 0, function() {
    return this.millisecond() * 1000000;
  });
  addUnitAlias('millisecond', 'ms');
  addUnitPriority('millisecond', 16);
  addRegexToken('S', match1to3, match1);
  addRegexToken('SS', match1to3, match2);
  addRegexToken('SSS', match1to3, match3);
  var token;
  for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
  }
  function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
  }
  for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
  }
  var getSetMillisecond = makeGetSet('Milliseconds', false);
  addFormatToken('z', 0, 0, 'zoneAbbr');
  addFormatToken('zz', 0, 0, 'zoneName');
  function getZoneAbbr() {
    return this._isUTC ? 'UTC' : '';
  }
  function getZoneName() {
    return this._isUTC ? 'Coordinated Universal Time' : '';
  }
  var momentPrototype__proto = Moment.prototype;
  momentPrototype__proto.add = add_subtract__add;
  momentPrototype__proto.calendar = moment_calendar__calendar;
  momentPrototype__proto.clone = clone;
  momentPrototype__proto.diff = diff;
  momentPrototype__proto.endOf = endOf;
  momentPrototype__proto.format = format;
  momentPrototype__proto.from = from;
  momentPrototype__proto.fromNow = fromNow;
  momentPrototype__proto.to = to;
  momentPrototype__proto.toNow = toNow;
  momentPrototype__proto.get = stringGet;
  momentPrototype__proto.invalidAt = invalidAt;
  momentPrototype__proto.isAfter = isAfter;
  momentPrototype__proto.isBefore = isBefore;
  momentPrototype__proto.isBetween = isBetween;
  momentPrototype__proto.isSame = isSame;
  momentPrototype__proto.isSameOrAfter = isSameOrAfter;
  momentPrototype__proto.isSameOrBefore = isSameOrBefore;
  momentPrototype__proto.isValid = moment_valid__isValid;
  momentPrototype__proto.lang = lang;
  momentPrototype__proto.locale = locale;
  momentPrototype__proto.localeData = localeData;
  momentPrototype__proto.max = prototypeMax;
  momentPrototype__proto.min = prototypeMin;
  momentPrototype__proto.parsingFlags = parsingFlags;
  momentPrototype__proto.set = stringSet;
  momentPrototype__proto.startOf = startOf;
  momentPrototype__proto.subtract = add_subtract__subtract;
  momentPrototype__proto.toArray = toArray;
  momentPrototype__proto.toObject = toObject;
  momentPrototype__proto.toDate = toDate;
  momentPrototype__proto.toISOString = moment_format__toISOString;
  momentPrototype__proto.toJSON = toJSON;
  momentPrototype__proto.toString = toString;
  momentPrototype__proto.unix = unix;
  momentPrototype__proto.valueOf = to_type__valueOf;
  momentPrototype__proto.creationData = creationData;
  momentPrototype__proto.year = getSetYear;
  momentPrototype__proto.isLeapYear = getIsLeapYear;
  momentPrototype__proto.weekYear = getSetWeekYear;
  momentPrototype__proto.isoWeekYear = getSetISOWeekYear;
  momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;
  momentPrototype__proto.month = getSetMonth;
  momentPrototype__proto.daysInMonth = getDaysInMonth;
  momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
  momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
  momentPrototype__proto.weeksInYear = getWeeksInYear;
  momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;
  momentPrototype__proto.date = getSetDayOfMonth;
  momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
  momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
  momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
  momentPrototype__proto.dayOfYear = getSetDayOfYear;
  momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;
  momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;
  momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;
  momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;
  momentPrototype__proto.utcOffset = getSetOffset;
  momentPrototype__proto.utc = setOffsetToUTC;
  momentPrototype__proto.local = setOffsetToLocal;
  momentPrototype__proto.parseZone = setOffsetToParsedOffset;
  momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
  momentPrototype__proto.isDST = isDaylightSavingTime;
  momentPrototype__proto.isLocal = isLocal;
  momentPrototype__proto.isUtcOffset = isUtcOffset;
  momentPrototype__proto.isUtc = isUtc;
  momentPrototype__proto.isUTC = isUtc;
  momentPrototype__proto.zoneAbbr = getZoneAbbr;
  momentPrototype__proto.zoneName = getZoneName;
  momentPrototype__proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
  momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
  momentPrototype__proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
  momentPrototype__proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
  momentPrototype__proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);
  var momentPrototype = momentPrototype__proto;
  function moment__createUnix(input) {
    return local__createLocal(input * 1000);
  }
  function moment__createInZone() {
    return local__createLocal.apply(null, arguments).parseZone();
  }
  function preParsePostFormat(string) {
    return string;
  }
  var prototype__proto = Locale.prototype;
  prototype__proto.calendar = locale_calendar__calendar;
  prototype__proto.longDateFormat = longDateFormat;
  prototype__proto.invalidDate = invalidDate;
  prototype__proto.ordinal = ordinal;
  prototype__proto.preparse = preParsePostFormat;
  prototype__proto.postformat = preParsePostFormat;
  prototype__proto.relativeTime = relative__relativeTime;
  prototype__proto.pastFuture = pastFuture;
  prototype__proto.set = locale_set__set;
  prototype__proto.months = localeMonths;
  prototype__proto.monthsShort = localeMonthsShort;
  prototype__proto.monthsParse = localeMonthsParse;
  prototype__proto.monthsRegex = monthsRegex;
  prototype__proto.monthsShortRegex = monthsShortRegex;
  prototype__proto.week = localeWeek;
  prototype__proto.firstDayOfYear = localeFirstDayOfYear;
  prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;
  prototype__proto.weekdays = localeWeekdays;
  prototype__proto.weekdaysMin = localeWeekdaysMin;
  prototype__proto.weekdaysShort = localeWeekdaysShort;
  prototype__proto.weekdaysParse = localeWeekdaysParse;
  prototype__proto.weekdaysRegex = weekdaysRegex;
  prototype__proto.weekdaysShortRegex = weekdaysShortRegex;
  prototype__proto.weekdaysMinRegex = weekdaysMinRegex;
  prototype__proto.isPM = localeIsPM;
  prototype__proto.meridiem = localeMeridiem;
  function lists__get(format, index, field, setter) {
    var locale = locale_locales__getLocale();
    var utc = create_utc__createUTC().set(setter, index);
    return locale[field](utc, format);
  }
  function listMonthsImpl(format, index, field) {
    if (typeof format === 'number') {
      index = format;
      format = undefined;
    }
    format = format || '';
    if (index != null) {
      return lists__get(format, index, field, 'month');
    }
    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
      out[i] = lists__get(format, i, field, 'month');
    }
    return out;
  }
  function listWeekdaysImpl(localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
      if (typeof format === 'number') {
        index = format;
        format = undefined;
      }
      format = format || '';
    } else {
      format = localeSorted;
      index = format;
      localeSorted = false;
      if (typeof format === 'number') {
        index = format;
        format = undefined;
      }
      format = format || '';
    }
    var locale = locale_locales__getLocale(),
        shift = localeSorted ? locale._week.dow : 0;
    if (index != null) {
      return lists__get(format, (index + shift) % 7, field, 'day');
    }
    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
      out[i] = lists__get(format, (i + shift) % 7, field, 'day');
    }
    return out;
  }
  function lists__listMonths(format, index) {
    return listMonthsImpl(format, index, 'months');
  }
  function lists__listMonthsShort(format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
  }
  function lists__listWeekdays(localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
  }
  function lists__listWeekdaysShort(localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
  }
  function lists__listWeekdaysMin(localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
  }
  locale_locales__getSetGlobalLocale('en', {
    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function(number) {
      var b = number % 10,
          output = (toInt(number % 100 / 10) === 1) ? 'th' : (b === 1) ? 'st' : (b === 2) ? 'nd' : (b === 3) ? 'rd' : 'th';
      return number + output;
    }
  });
  utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
  utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);
  var mathAbs = Math.abs;
  function duration_abs__abs() {
    var data = this._data;
    this._milliseconds = mathAbs(this._milliseconds);
    this._days = mathAbs(this._days);
    this._months = mathAbs(this._months);
    data.milliseconds = mathAbs(data.milliseconds);
    data.seconds = mathAbs(data.seconds);
    data.minutes = mathAbs(data.minutes);
    data.hours = mathAbs(data.hours);
    data.months = mathAbs(data.months);
    data.years = mathAbs(data.years);
    return this;
  }
  function duration_add_subtract__addSubtract(duration, input, value, direction) {
    var other = create__createDuration(input, value);
    duration._milliseconds += direction * other._milliseconds;
    duration._days += direction * other._days;
    duration._months += direction * other._months;
    return duration._bubble();
  }
  function duration_add_subtract__add(input, value) {
    return duration_add_subtract__addSubtract(this, input, value, 1);
  }
  function duration_add_subtract__subtract(input, value) {
    return duration_add_subtract__addSubtract(this, input, value, -1);
  }
  function absCeil(number) {
    if (number < 0) {
      return Math.floor(number);
    } else {
      return Math.ceil(number);
    }
  }
  function bubble() {
    var milliseconds = this._milliseconds;
    var days = this._days;
    var months = this._months;
    var data = this._data;
    var seconds,
        minutes,
        hours,
        years,
        monthsFromDays;
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) || (milliseconds <= 0 && days <= 0 && months <= 0))) {
      milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
      days = 0;
      months = 0;
    }
    data.milliseconds = milliseconds % 1000;
    seconds = absFloor(milliseconds / 1000);
    data.seconds = seconds % 60;
    minutes = absFloor(seconds / 60);
    data.minutes = minutes % 60;
    hours = absFloor(minutes / 60);
    data.hours = hours % 24;
    days += absFloor(hours / 24);
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));
    years = absFloor(months / 12);
    months %= 12;
    data.days = days;
    data.months = months;
    data.years = years;
    return this;
  }
  function daysToMonths(days) {
    return days * 4800 / 146097;
  }
  function monthsToDays(months) {
    return months * 146097 / 4800;
  }
  function as(units) {
    var days;
    var months;
    var milliseconds = this._milliseconds;
    units = normalizeUnits(units);
    if (units === 'month' || units === 'year') {
      days = this._days + milliseconds / 864e5;
      months = this._months + daysToMonths(days);
      return units === 'month' ? months : months / 12;
    } else {
      days = this._days + Math.round(monthsToDays(this._months));
      switch (units) {
        case 'week':
          return days / 7 + milliseconds / 6048e5;
        case 'day':
          return days + milliseconds / 864e5;
        case 'hour':
          return days * 24 + milliseconds / 36e5;
        case 'minute':
          return days * 1440 + milliseconds / 6e4;
        case 'second':
          return days * 86400 + milliseconds / 1000;
        case 'millisecond':
          return Math.floor(days * 864e5) + milliseconds;
        default:
          throw new Error('Unknown unit ' + units);
      }
    }
  }
  function duration_as__valueOf() {
    return (this._milliseconds + this._days * 864e5 + (this._months % 12) * 2592e6 + toInt(this._months / 12) * 31536e6);
  }
  function makeAs(alias) {
    return function() {
      return this.as(alias);
    };
  }
  var asMilliseconds = makeAs('ms');
  var asSeconds = makeAs('s');
  var asMinutes = makeAs('m');
  var asHours = makeAs('h');
  var asDays = makeAs('d');
  var asWeeks = makeAs('w');
  var asMonths = makeAs('M');
  var asYears = makeAs('y');
  function duration_get__get(units) {
    units = normalizeUnits(units);
    return this[units + 's']();
  }
  function makeGetter(name) {
    return function() {
      return this._data[name];
    };
  }
  var milliseconds = makeGetter('milliseconds');
  var seconds = makeGetter('seconds');
  var minutes = makeGetter('minutes');
  var hours = makeGetter('hours');
  var days = makeGetter('days');
  var months = makeGetter('months');
  var years = makeGetter('years');
  function weeks() {
    return absFloor(this.days() / 7);
  }
  var round = Math.round;
  var thresholds = {
    s: 45,
    m: 45,
    h: 22,
    d: 26,
    M: 11
  };
  function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
  }
  function duration_humanize__relativeTime(posNegDuration, withoutSuffix, locale) {
    var duration = create__createDuration(posNegDuration).abs();
    var seconds = round(duration.as('s'));
    var minutes = round(duration.as('m'));
    var hours = round(duration.as('h'));
    var days = round(duration.as('d'));
    var months = round(duration.as('M'));
    var years = round(duration.as('y'));
    var a = seconds < thresholds.s && ['s', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days] || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];
    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
  }
  function duration_humanize__getSetRelativeTimeRounding(roundingFunction) {
    if (roundingFunction === undefined) {
      return round;
    }
    if (typeof(roundingFunction) === 'function') {
      round = roundingFunction;
      return true;
    }
    return false;
  }
  function duration_humanize__getSetRelativeTimeThreshold(threshold, limit) {
    if (thresholds[threshold] === undefined) {
      return false;
    }
    if (limit === undefined) {
      return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    return true;
  }
  function humanize(withSuffix) {
    var locale = this.localeData();
    var output = duration_humanize__relativeTime(this, !withSuffix, locale);
    if (withSuffix) {
      output = locale.pastFuture(+this, output);
    }
    return locale.postformat(output);
  }
  var iso_string__abs = Math.abs;
  function iso_string__toISOString() {
    var seconds = iso_string__abs(this._milliseconds) / 1000;
    var days = iso_string__abs(this._days);
    var months = iso_string__abs(this._months);
    var minutes,
        hours,
        years;
    minutes = absFloor(seconds / 60);
    hours = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;
    years = absFloor(months / 12);
    months %= 12;
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();
    if (!total) {
      return 'P0D';
    }
    return (total < 0 ? '-' : '') + 'P' + (Y ? Y + 'Y' : '') + (M ? M + 'M' : '') + (D ? D + 'D' : '') + ((h || m || s) ? 'T' : '') + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (s ? s + 'S' : '');
  }
  var duration_prototype__proto = Duration.prototype;
  duration_prototype__proto.abs = duration_abs__abs;
  duration_prototype__proto.add = duration_add_subtract__add;
  duration_prototype__proto.subtract = duration_add_subtract__subtract;
  duration_prototype__proto.as = as;
  duration_prototype__proto.asMilliseconds = asMilliseconds;
  duration_prototype__proto.asSeconds = asSeconds;
  duration_prototype__proto.asMinutes = asMinutes;
  duration_prototype__proto.asHours = asHours;
  duration_prototype__proto.asDays = asDays;
  duration_prototype__proto.asWeeks = asWeeks;
  duration_prototype__proto.asMonths = asMonths;
  duration_prototype__proto.asYears = asYears;
  duration_prototype__proto.valueOf = duration_as__valueOf;
  duration_prototype__proto._bubble = bubble;
  duration_prototype__proto.get = duration_get__get;
  duration_prototype__proto.milliseconds = milliseconds;
  duration_prototype__proto.seconds = seconds;
  duration_prototype__proto.minutes = minutes;
  duration_prototype__proto.hours = hours;
  duration_prototype__proto.days = days;
  duration_prototype__proto.weeks = weeks;
  duration_prototype__proto.months = months;
  duration_prototype__proto.years = years;
  duration_prototype__proto.humanize = humanize;
  duration_prototype__proto.toISOString = iso_string__toISOString;
  duration_prototype__proto.toString = iso_string__toISOString;
  duration_prototype__proto.toJSON = iso_string__toISOString;
  duration_prototype__proto.locale = locale;
  duration_prototype__proto.localeData = localeData;
  duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
  duration_prototype__proto.lang = lang;
  addFormatToken('X', 0, 0, 'unix');
  addFormatToken('x', 0, 0, 'valueOf');
  addRegexToken('x', matchSigned);
  addRegexToken('X', matchTimestamp);
  addParseToken('X', function(input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
  });
  addParseToken('x', function(input, array, config) {
    config._d = new Date(toInt(input));
  });
  utils_hooks__hooks.version = '2.15.0';
  setHookCallback(local__createLocal);
  utils_hooks__hooks.fn = momentPrototype;
  utils_hooks__hooks.min = min;
  utils_hooks__hooks.max = max;
  utils_hooks__hooks.now = now;
  utils_hooks__hooks.utc = create_utc__createUTC;
  utils_hooks__hooks.unix = moment__createUnix;
  utils_hooks__hooks.months = lists__listMonths;
  utils_hooks__hooks.isDate = isDate;
  utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
  utils_hooks__hooks.invalid = valid__createInvalid;
  utils_hooks__hooks.duration = create__createDuration;
  utils_hooks__hooks.isMoment = isMoment;
  utils_hooks__hooks.weekdays = lists__listWeekdays;
  utils_hooks__hooks.parseZone = moment__createInZone;
  utils_hooks__hooks.localeData = locale_locales__getLocale;
  utils_hooks__hooks.isDuration = isDuration;
  utils_hooks__hooks.monthsShort = lists__listMonthsShort;
  utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
  utils_hooks__hooks.defineLocale = defineLocale;
  utils_hooks__hooks.updateLocale = updateLocale;
  utils_hooks__hooks.locales = locale_locales__listLocales;
  utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
  utils_hooks__hooks.normalizeUnits = normalizeUnits;
  utils_hooks__hooks.relativeTimeRounding = duration_humanize__getSetRelativeTimeRounding;
  utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
  utils_hooks__hooks.calendarFormat = getCalendarFormat;
  utils_hooks__hooks.prototype = momentPrototype;
  var _moment = utils_hooks__hooks;
  return _moment;
}));

})();
(function() {
var define = System.amdDefine;
define("npm:moment@2.15.0.js", ["npm:moment@2.15.0/moment.js"], function(main) {
  return main;
});

})();
System.register('app/month.js', ['npm:babel-runtime@5.8.38/helpers/create-class.js', 'npm:babel-runtime@5.8.38/helpers/class-call-check.js', 'npm:moment@2.15.0.js'], function (_export) {
  var _createClass, _classCallCheck, Moment, Month;

  return {
    setters: [function (_npmBabelRuntime5838HelpersCreateClassJs) {
      _createClass = _npmBabelRuntime5838HelpersCreateClassJs['default'];
    }, function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs['default'];
    }, function (_npmMoment2150Js) {
      Moment = _npmMoment2150Js['default'];
    }],
    execute: function () {
      'use strict';

      Month = (function () {
        _createClass(Month, null, [{
          key: 'named',
          value: function named(name) {
            return new Month({ index: name });
          }
        }, {
          key: 'current',
          value: function current() {
            return new Month({ index: new Moment().month() });
          }
        }]);

        function Month() {
          var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var index = _ref.index;

          _classCallCheck(this, Month);

          this.moment = new Moment().month(index);
        }

        _createClass(Month, [{
          key: 'abbreviation',
          value: function abbreviation() {
            return this.moment.format("MMM");
          }
        }, {
          key: 'end',
          value: function end() {
            return this.moment.endOf('month');
          }
        }, {
          key: 'name',
          value: function name() {
            return this.moment.format("MMMM");
          }
        }, {
          key: 'start',
          value: function start() {
            return this.moment.startOf('month');
          }
        }, {
          key: 'toInteger',
          value: function toInteger() {
            return this.moment.month();
          }
        }, {
          key: 'toString',
          value: function toString() {
            return this.name();
          }
        }]);

        return Month;
      })();

      _export('default', Month);
    }
  };
});
System.register('app/month_selector/view_model.js', ['npm:babel-runtime@5.8.38/helpers/class-call-check.js', 'npm:knockout@3.4.0.js', 'app/month.js'], function (_export) {
  var _classCallCheck, Knockout, Month, MonthSelectorViewModel;

  return {
    setters: [function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs['default'];
    }, function (_npmKnockout340Js) {
      Knockout = _npmKnockout340Js['default'];
    }, function (_appMonthJs) {
      Month = _appMonthJs['default'];
    }],
    execute: function () {
      'use strict';

      MonthSelectorViewModel = function MonthSelectorViewModel() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var label = _ref.label;
        var selectedMonth = _ref.selectedMonth;

        _classCallCheck(this, MonthSelectorViewModel);

        this.defaultMonth = Month.current().name();
        this.selectedMonth = selectedMonth || Knockout.observable();
        this.label = Knockout.observable(Knockout.unwrap(label));
        this.optionalMonths = Knockout.observableArray(["Januaray", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(function (monthName) {
          var month = new Month({ index: monthName });
          return { name: month.name(), value: month.name() };
        }));
      };

      _export('default', MonthSelectorViewModel);
    }
  };
});
System.register('app/month_selector/component.js', ['app/optional_label/component.js', 'app/searchable_dropdown_selector/component.js', 'npm:knockout@3.4.0.js', 'app/month_selector/view_model.js'], function (_export) {
  'use strict';

  var Knockout, ViewModel;
  return {
    setters: [function (_appOptional_labelComponentJs) {}, function (_appSearchable_dropdown_selectorComponentJs) {}, function (_npmKnockout340Js) {
      Knockout = _npmKnockout340Js['default'];
    }, function (_appMonth_selectorView_modelJs) {
      ViewModel = _appMonth_selectorView_modelJs['default'];
    }],
    execute: function () {

      (function () {
        'use strict';

        Knockout.components.register('month_selector', {
          viewModel: ViewModel,
          template: '\n      <searchable_dropdown_selector params="\n        bindLabelTo: label,\n        bindSelectedOptionTo: selectedMonth,\n        bindOptionsTo: optionalMonths,\n        defaultOption: defaultMonth\n      ">\n      </searchable_dropdown_selector>\n    '
        });
      })();
    }
  };
});
//# sourceMappingURL=component.js.map