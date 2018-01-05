'use strict';
var Mockgen = require('./mockgen.js');
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
            Mockgen().responses({
                path: '/orders',
                operation: 'get',
                response: '200'
            }, callback);
        },
        default: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/orders',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};
