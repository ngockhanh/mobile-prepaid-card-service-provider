'use strict';

const Log = require('timestamp-log');
const log = new Log(process.env.LOG_LEVEL);
const database = require('./dynamodb');
const CollectorHandler = require('../collector-handler');

module.exports = {
    createOrder: function (requestId, opcode, amount, quantity, callback) {
        database.createItem(requestId, opcode, amount, quantity, 'create_order', function (err, result) {
            if (err) {
                callback({
                    code: 'error-create-order',
                    message: err.message.toString()
                });
            } else {
                var orderId = result.id;
                log.debug('sendRequest', 'START', orderId);

                var collector = new CollectorHandler();
                collector.sendRequestCreatingOrderToProviderService({
                    reference_id: orderId,
                    opcode: opcode,
                    amount: amount,
                    quantity: quantity
                }, function (err, data) {
                    if (err) {
                        log.error('sendRequest', 'FINISHED', err);

                        database.updateItem(orderId, {status: 'FAILED', message: err.message.toString() });

                        callback({
                            code: 'error-create-order',
                            message: err.message.toString()
                        }, null);
                    } else {
                        log.debug('sendRequest', 'FINISHED', data);

                        var payload = {
                            status: data.status,
                            message: data.message.toString()
                        };

                        if (data.items.length > 0) {
                            payload['items'] = JSON.stringify(data.items);
                        }
                        database.updateItem(orderId, payload);

                        callback(null, {
                            request_id: requestId,
                            order_id: orderId,
                            status: data.status,
                            items: data.items,
                            message: data.message.toString()
                        });
                    }

                });
            }
        });
    },

    getOrderItemStatus: function (orderId, callback) {
        log.debug('getOrderItemStatus', 'START', orderId);

        database.readItemById(orderId, function (err, result) {
            if (err) {
                log.error('getOrderItemStatus', 'FINISHED', err);

                callback({
                    code: 'error-get-order-status-by-id',
                    message: err.message.toString()
                });
            } else {
                if (result.status != 'SUCCESS' && result.status != 'FAILED') {
                    var collector = new CollectorHandler();
                    collector.sendRequestCheckingTransToProviderService(orderId, function (error, data) {
                        if (error) {
                            log.error('getOrderItemStatus', 'FINISHED', error);

                            callback({
                                code: 'error-get-order-status-by-id',
                                message: error.message.toString()
                            });
                        } else {
                            database.updateItem(orderId, {status: data.status});

                            callback(null, {
                                request_id: result.request_id,
                                order_id: orderId,
                                status: data.status,
                                message: ''
                            });
                        }
                    });
                } else {
                    callback(null, {
                        request_id: result.request_id,
                        order_id: orderId,
                        status: result.status,
                        message: result.message ? result.message : ''
                    });
                }
            }
        });
    },

    inquiryProvider: function (requestId, opcode, amount, callback) {
        database.createItem(requestId, opcode, amount, 0, 'inquiry_provider', function (err, result) {
            if (err) {
                callback({
                    code: 'error-inquiry-provider',
                    message: err.message.toString()
                });
            } else {
                var orderId = result.id;
                log.debug('sendRequest', 'START', orderId);

                var collector = new CollectorHandler();
                collector.sendRequestInquiryToProviderService({
                    opcode: opcode,
                    amount: amount
                }, function (err, data) {
                    if (err) {
                        log.error('sendRequest', 'FINISHED', err);

                        database.updateItem(orderId, {status: 'FAILED', message: err.message.toString()});

                        callback({
                            code: 'error-inquiry-provider',
                            message: err.message.toString()
                        }, null);
                    } else {
                        log.debug('sendRequest', 'FINISHED', data);

                        database.updateItem(orderId, {status: 'SUCCESS', quantity: data.amount});

                        callback(null, {
                            request_id: requestId,
                            order_id: orderId,
                            status: 'SUCCESS',
                            amount: data.amount
                        });
                    }

                });
            }
        });
    }
};