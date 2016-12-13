'use strict';

const appName = require( './appName.js' );
const bunyan = require( 'bunyan' );

module.exports = bunyan.createLogger( {
	name: appName,
	level: process.env.LOG_LEVEL || 'debug' // eslint-disable-line no-process-env
});
