'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /order/{id}
 */
module.exports = {
    /**
     * summary: 
     * description: Check order info by order id
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
                path: '/order/{id}',
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
                path: '/order/{id}',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};
