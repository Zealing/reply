'use strict';

/**
* the example case for get method
*/
var reply = require('./..');

var options = {
	Car_type: 'SuperSport',
	Car_brand: 'Aston Martin'
};

reply.get(options, function(err, answer) {
	console.log("\nYour Choice:");
	console.log(answer);
});