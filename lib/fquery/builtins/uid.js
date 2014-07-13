/*jshint node: true */
'use strict';


var latestUid = 0;


module.exports = function (fQuery) {

	fQuery.uid = function () {

		latestUid += 1;
		return '' + latestUid;
	};
};
