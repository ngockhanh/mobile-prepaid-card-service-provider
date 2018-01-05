'use strict';
var dataProvider = require('../../../models/order/{id}/status.js');
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
     */
    get: function getOrderItemStatus(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
