'use strict';

const _ = require( 'lodash' );
const conf = require( '../conf.js' );
const elasticsearch = require( 'elasticsearch' );
const log = require( '../log.js' );
const uuid = require( 'uuid' );

const esClient = new elasticsearch.Client( {
	host: conf.elasticsearch.url
});

function convertMessageToJson( record ) {

	const buffer = new Buffer( record.Data, 'base64' );
	const msg = JSON.parse( buffer.toString() );
	return msg;
}

function buildBulkIndex( index, messages ) {

	const body = [];
	messages.forEach( msg => {
		body.push( {
			index: {
				_index: index,
				_type: conf.documents.defaultType,
				_id: uuid.v4()
			}
		});
		body.push( msg );
	});

	return { body };
}

module.exports = function( server ) {

	server.post( '/', ( req, res, next ) => {

		try {
			const rawBody = new Buffer( req.body );
			const body = JSON.parse( rawBody.toString() );

			const index = body.DeliveryStreamName;
			const messages = _.map( body.Records, convertMessageToJson );

			const bulkIndex = buildBulkIndex( index, messages );
			return esClient.bulk( bulkIndex, ( esErr, result ) => {

				if( esErr ) {
					return next( esErr );
				}

				log.debug( `published ${ messages.length } messages to ${ index }` );
				res.send( 200 );
				return next();
			});

		} catch ( err ) {
			return next( err );
		}
	});
};
