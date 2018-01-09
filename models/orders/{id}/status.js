'use strict';
var publisher = require('../../../connectors/publisher');
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
        '200': function (req, res, callback) {
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
