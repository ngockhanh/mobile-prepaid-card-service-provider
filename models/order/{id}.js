'use strict';
const Log = require('timestamp-log');
const log = new Log(process.env.LOG_LEVEL);
var database = require('../../connectors/dynamodb');
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
            log.debug('getOrderItem', 'START', req.params.id);

            database.readItemById(req.params.id, function (err, result) {
                if (err) {
                    log.error('getOrderItem', 'FINISHED', err);

                    callback({
                        code: 'error-get-order-by-id',
                        message: err.message.toString()
                    });
                } else {
                    log.debug('getOrderItem', 'FINISHED', result);

                    callback(null, {
                        request_id: result.request_id,
                        order_id: result.id,
                        status: result.status,
                        items: result.items,
                        message: result.message ? result.message : ''
                    });
                }
            });
        },
        default: function (req, res, callback) {
            callback({
                'code': 'error-input-parameters',
                'message': 'Input parameters are wrong or missing.'
            });
        }
    }
};
