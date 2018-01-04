'use strict';
var Mockgen = require('../mockgen.js');
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
            Mockgen().responses({
                path: '/provider/inquiry',
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
                path: '/provider/inquiry',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};
