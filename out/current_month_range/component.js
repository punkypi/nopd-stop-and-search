"bundle";
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
System.register('app/now/month.js', ['npm:babel-runtime@5.8.38/helpers/create-class.js', 'npm:babel-runtime@5.8.38/helpers/class-call-check.js', 'npm:moment@2.15.0.js'], function (_export) {
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
        function Month() {
          _classCallCheck(this, Month);

          this.moment = new Moment();
        }

        _createClass(Month, [{
          key: 'end',
          value: function end() {
            return this.moment.endOf('month');
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
            return this.moment.format("MMMM");
          }
        }]);

        return Month;
      })();

      _export('default', Month);
    }
  };
});
System.register('app/now.js', ['npm:babel-runtime@5.8.38/helpers/create-class.js', 'npm:babel-runtime@5.8.38/helpers/class-call-check.js', 'app/now/month.js'], function (_export) {
  var _createClass, _classCallCheck, Month, Now;

  return {
    setters: [function (_npmBabelRuntime5838HelpersCreateClassJs) {
      _createClass = _npmBabelRuntime5838HelpersCreateClassJs['default'];
    }, function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs['default'];
    }, function (_appNowMonthJs) {
      Month = _appNowMonthJs['default'];
    }],
    execute: function () {
      'use strict';

      Now = (function () {
        function Now() {
          _classCallCheck(this, Now);
        }

        _createClass(Now, null, [{
          key: 'month',
          value: function month() {
            return new Month();
          }
        }]);

        return Now;
      })();

      _export('default', Now);
    }
  };
});
System.register('app/current_month_range/model.js', ['npm:babel-runtime@5.8.38/helpers/create-class.js', 'npm:babel-runtime@5.8.38/helpers/class-call-check.js', 'app/now.js'], function (_export) {
  var _createClass, _classCallCheck, Now, CurrentMonthRange;

  return {
    setters: [function (_npmBabelRuntime5838HelpersCreateClassJs) {
      _createClass = _npmBabelRuntime5838HelpersCreateClassJs['default'];
    }, function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs['default'];
    }, function (_appNowJs) {
      Now = _appNowJs['default'];
    }],
    execute: function () {
      'use strict';

      CurrentMonthRange = (function () {
        function CurrentMonthRange() {
          _classCallCheck(this, CurrentMonthRange);

          this.month = Now.month();
        }

        _createClass(CurrentMonthRange, [{
          key: 'end',
          value: function end() {
            return this.month.end();
          }
        }, {
          key: 'month',
          value: function month() {
            return this.month;
          }
        }, {
          key: 'start',
          value: function start() {
            return this.month.start();
          }
        }, {
          key: 'toInteger',
          value: function toInteger() {
            return this.month.toInteger();
          }
        }, {
          key: 'toString',
          value: function toString() {
            return this.month.toString();
          }
        }]);

        return CurrentMonthRange;
      })();

      _export('default', CurrentMonthRange);
    }
  };
});
System.register("app/current_month_range/view_model.js", ["npm:babel-runtime@5.8.38/helpers/create-class.js", "npm:babel-runtime@5.8.38/helpers/class-call-check.js", "app/current_month_range/model.js"], function (_export) {
  var _createClass, _classCallCheck, CurrentMonthRange, CurrentMonthRangeViewModel;

  return {
    setters: [function (_npmBabelRuntime5838HelpersCreateClassJs) {
      _createClass = _npmBabelRuntime5838HelpersCreateClassJs["default"];
    }, function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs["default"];
    }, function (_appCurrent_month_rangeModelJs) {
      CurrentMonthRange = _appCurrent_month_rangeModelJs["default"];
    }],
    execute: function () {
      "use strict";

      CurrentMonthRangeViewModel = (function () {
        function CurrentMonthRangeViewModel() {
          _classCallCheck(this, CurrentMonthRangeViewModel);
        }

        _createClass(CurrentMonthRangeViewModel, [{
          key: "currentMonthRange",
          value: function currentMonthRange() {
            return new CurrentMonthRange();
          }
        }, {
          key: "startOfMonth",
          value: function startOfMonth() {
            return this.currentMonthRange().start();
          }
        }, {
          key: "startString",
          value: function startString() {
            return this.startOfMonth().format("YYYY-MM-DDTHH:mm:ss");
          }
        }, {
          key: "endOfMonth",
          value: function endOfMonth() {
            return this.currentMonthRange().end();
          }
        }, {
          key: "endString",
          value: function endString() {
            return this.endOfMonth().format("YYYY-MM-DDTHH:mm:ss");
          }
        }]);

        return CurrentMonthRangeViewModel;
      })();

      _export("default", CurrentMonthRangeViewModel);
    }
  };
});
System.register('app/current_month_range/component.js', ['npm:knockout@3.4.0.js', 'app/current_month_range/view_model.js'], function (_export) {
  'use strict';

  var Knockout, ViewModel;
  return {
    setters: [function (_npmKnockout340Js) {
      Knockout = _npmKnockout340Js['default'];
    }, function (_appCurrent_month_rangeView_modelJs) {
      ViewModel = _appCurrent_month_rangeView_modelJs['default'];
    }],
    execute: function () {

      (function () {
        'use strict';

        Knockout.components.register('current_month_range', {
          viewModel: ViewModel,
          template: '\n      Start: <span data-bind="text: startString()"></span>\n      <br/>\n      End: <span data-bind="text: endString()"></span>'
        });
      })();
    }
  };
});
//# sourceMappingURL=component.js.map