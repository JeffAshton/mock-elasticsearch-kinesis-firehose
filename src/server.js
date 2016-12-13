'use strict';

const conf = require( './conf.js' );
const log = require( './log.js' );
const restify = require( 'restify' );

process.on( 'uncaughtException', function( err ) {
	log.fatal( err );
	process.exit( 100 ); // eslint-disable-line no-process-exit
});

process.on( 'unhandledRejection', function( reason, p ) {
	log.error( { reason: reason, p: p }, 'Unhandled rejection' );
	process.exit( 101 ); // eslint-disable-line no-process-exit
});

const server = restify.createServer( { log });
server.use( restify.queryParser() );
server.use( restify.bodyParser() );

server.on( 'uncaughtException', function( req, res, route, err ) {
	log.fatal( err );
	process.exit( 102 ); // eslint-disable-line no-process-exit
});

server.on( 'after', function( req, res, route, error ) {

	if( error ) {

		const reqLog = req.log || log;

		if( error.statusCode >= 400 && error.statusCode < 500 ) {
			reqLog.warn( error, 'request resulted in user error' );
		} else {
			reqLog.error( error, 'request resulted in error' );
		}
	}
});

require( './controllers/putRecord.js' )( server );

if( require.main === module ) {
	
	log.debug( 'opening http server' );
	server.listen( conf.port, function() {
		log.info( 'http server listening' );
	});
}

module.exports = server;