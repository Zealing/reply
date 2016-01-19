'use strict';

/**
* the example case for confirm method
*/
var reply = require('./..');

reply.confirm('Is that what you want?', function(err, answer) {
	if (err) {
		console.log('Something went wrong!');
	} else if (answer) {
		console.log("That's what you want!");
	} else {
		console.log('So bad! Try again!');
	}
});