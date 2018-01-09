'use strict';
var publisher = require('../../connectors/publisher');
/**
 * Operations on /provider/inquiry
 */
module.exports = {
    /**
     * summary: 
     * description: Count number of cards in store
     * parameters: query
     * produces: application/json
     * responses: 200, default
     * operationId: countCards
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            publisher.inquiryProvider(req.query.request_id, req.query.opcode, req.query.amount, callback);
        },
        default: function (req, res, callback) {
            callback({
                'code': 'error-input-parameters',
                'message': 'Input parameters are wrong or missing.'
            });
        }
    }
};
