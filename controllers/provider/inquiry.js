'use strict';
var dataProvider = require('../../models/provider/inquiry.js');
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
     */
    get: function countCards(req, res, next) {
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
