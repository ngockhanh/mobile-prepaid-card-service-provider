'use strict';
var Mockgen = require('../../mockgen.js');
/**
 * Operations on /orders/{id}/status
 */
module.exports = {
    /**
     * summary: 
     * description: Get an order tracking status of a specified order. It will return all the information about the requested order.
     * parameters: id
     * produces: application/json
     * responses: 200, default
     * operationId: getOrderItemStatus
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/orders/{id}/status',
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
                path: '/orders/{id}/status',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};
