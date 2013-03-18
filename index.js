/**
 * # Module dependencies
 */

"use strict"

var elData = require('data')
var slice = Array.prototype.slice

/**
 * Sets the value of `this` within callbacks supplied
 * to the returned Function.
 * @param {Object} context
 * @return {Function} Use this to iterate over elements.
 * @api public
 */

module.exports = function setDomDataMapContext(context) {

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

	return function domDataMap(selector, fn) {
		var els = selector
		if (els instanceof NodeList) els = slice.call(selector)
		if (typeof selector === 'string') els = module.exports.query(selector)
		els = els || []
		els.forEach(function(el) {
			var data = elData(el).get()
			var returnedData = fn.call(context, el, data)
			if (returnedData) elData(el).set(returnedData)
		})
	}
}

/**
 * Override this for custom element selection.
 * @return {Array} Array of Elements in document matching selector
 * @api public
 */

module.exports.query = function query(selector) {
	return slice.call(document.querySelectorAll(selector))
}
