'use strict';
var publisher = require('../connectors/publisher');
/**
 * Operations on /order
 */
module.exports = {
    /**
     * summary: 
     * description: Create a mobile prepaid order
     * parameters: body
     * produces: application/json
     * responses: 200, default
     * operationId: createOrder
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            publisher.createOrder(req.body.request_id, req.body.opcode, req.body.amount, req.body.quantity, callback);
        },
        default: function (req, res, callback) {
            callback({
                'code': 'error-input-parameters',
                'message': 'Input parameters are wrong or missing.'
            });
        }
    }
};
