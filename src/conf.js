'use strict';

const EnvironmentVariableReader = require( 'cti-process-environment-variable-reader' );

const log = require( './log' );
const env = new EnvironmentVariableReader( log );

module.exports = {

	elasticsearch: {
		url: env.getRequired( 'ELASTICSEARCH_URL', 1 )
	},

	documents: {
		defaultType: env.getOptional( 'DEFAULT_DOCUMENT_TYPE', 'record' )
	},

	port: env.getOptional( 'HTTP_PORT', 80 )

};
