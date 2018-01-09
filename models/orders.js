'use strict';
var publisher = require('../connectors/publisher');
/**
 * Operations on /orders
 */
module.exports = {
    /**
     * summary: 
     * description: Order a batch of mobile prepaid codes from system with a specific amount, quantity and network operation code.
     * parameters: request_id, quantity, amount, opcode
     * produces: application/json
     * responses: 200, default
     * operationId: GetItemsOrders
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            publisher.createOrder(req.query.request_id, req.query.opcode, req.query.amount, req.query.quantity, callback);
        },
        default: function (req, res, callback) {
            callback({
                'code': 'error-input-parameters',
                'message': 'Input parameters are wrong or missing.'
            });
        }
    }
};
