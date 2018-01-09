'use strict';
var publisher = require('../../../connectors/publisher');
/**
 * Operations on /order/{id}/status
 */
module.exports = {
    /**
     * summary: 
     * description: Check order status by order id
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
            publisher.getOrderItemStatus(req.params.id, callback);
        },
        default: function (req, res, callback) {
            callback({
                'code': 'error-input-parameters',
                'message': 'Input parameters are wrong or missing.'
            });
        }
    }
};
