/**
 * # Module dependencies
 */

"use strict"

var elData = require('data')
var matches = require('matches-selector');

var slice = Array.prototype.slice

/**
 * Sets the value of `this` within callbacks supplied
 * to the returned Function.
 * @param {Object} context
 * @return {Function} Use this to iterate over elements.
 * @api public
 */

module.exports = function DomDataMapContext(context, el) {
	/**
	 * Calls an iterator `fn` on each Element matching
	 * `selector`, passing in current element and its
	 * associated data.
	 *
	 * Return an object in your iterator to modify the data
	 * associated with the current Element.
	 *
	 * @param {Function} fn callback passed el, data
	 * @param {String|NodeList} selector NodeList or a selector String
	 * @api public
	 */

	function domDataMap(selector, fn) {
		var els = selector
		if (els instanceof NodeList) els = slice.call(selector)
		if (typeof selector === 'string') els = query(selector, self.el)
		els = els || []
		els.forEach(function(el) {
			var data = elData(el).get()
      setParentData(el)
			var returnedData = fn.call(data.context || self.context, el, data)
			if (returnedData) elData(el).set(returnedData)
		})
	}
  domDataMap.context = context
  domDataMap.el = el
  var self = domDataMap
  return domDataMap
}

module.exports.setParentData = setParentData
function setParentData(el, data) {
  console.log('set parent data', el, data)
  if (!el || el.nodeType === Node.DOCUMENT_NODE) return data
  // BAD COUPLING TO yields/data implementation
  // this checks if the element has associated data
  if (el.__uniq) {
    var foundData = elData(el).get()
    if (!data) {
      data = {}
    }
    data.__proto__ = foundData
    elData(el).set(data)
    return setParentData(el.parentNode, foundData)
  }
  return setParentData(el.parentNode, data)
}

/**
 * Override this for custom element selection.
 * @param {String} selector CSS Selector
 * @param {Element} el Scope query to children of this element
 * @return {Array} Array of Elements in el matching selector
 * @api public
 */

module.exports.query = function(selector, el) {
  var matchedEls = slice.call(el.querySelectorAll(selector))
  if (matches(el, selector)) matchedEls.unshift(el)
  return matchedEls
}

/**
 * Argument handling for module.exports.query
 * @return {Array} Array of Elements in document matching selector
 * @api private
 */
function query(selector, el) {
  if (!el) el = document.body
  if (typeof el === 'string') el = query(el, document.body)
  if (typeof el.length !== 'undefined') el = el[0]
	return module.exports.query(selector, el)
}
