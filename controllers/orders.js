'use strict';
var dataProvider = require('../models/orders.js');
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
     */
    get: function GetItemsOrders(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(status).send(data);
            }
        });
    }
};
