/*jshint node: true */
'use strict';


var globalCounter = 0;


module.exports = function (fQuery) {

	fQuery.getUid = function () {

		globalCounter += 1;
		return '#' + ('000000' + globalCounter.toString(16)).slice(-6);
	};
};
