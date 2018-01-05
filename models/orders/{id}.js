'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /orders/{id}
 */
module.exports = {
    /**
     * summary: 
     * description: Get an order tracking details of a specified order. It will return all the information about the requested order.
     * parameters: id
     * produces: application/json
     * responses: 200, default
     * operationId: getOrderItem
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/orders/{id}',
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
                path: '/orders/{id}',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};
