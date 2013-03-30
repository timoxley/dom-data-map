# dom-data-map

Associate arbitrary data with DOM Elements via NodeList or a selector String.

Simple wrapper around [yields/data](https://github.com/yields/data) to add multiple element/selector interface.

## Installation

  $ component install timoxley/dom-data-map

## Example

```js
var DDM = require('dom-data-map')

// Arbitrary Data
var appData = {
	users: [{
		name: 'Tim'
	}, {
		name: 'Bob'
	}]
}

// set the context for the domData callbacks
var domData = DDM(appData)

// apply a callback to each matching element
// passing the element and its associated data.
// return a new object to set/update the element's
// data.
domData('[data-user]', function(el, data) {
	var userName = el.attributes['data-user'].value
	var foundUsers = this.users.filter(function(user) {
		return user.name == userName
	})
	var foundUser = foundUsers.pop()
	data.user = foundUser
	return data
})

domData('[data-userview]', function(el, data) {
	el.innerHTML = '<h2>User:'+data.user.name+'</h2>'
})
```

## License

  MIT
