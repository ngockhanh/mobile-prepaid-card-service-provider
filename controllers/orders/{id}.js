'use strict';
var dataProvider = require('../../models/orders/{id}.js');
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
     */
    get: function getOrderItem(req, res, next) {
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
