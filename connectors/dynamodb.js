'use strict';

const Log = require('timestamp-log');
const uuid4 = require('uuid/v4');
const log = new Log(process.env.LOG_LEVEL);
const AWS = require('aws-sdk');
const dateformat = require('dateformat');

AWS.config.update({
    region: process.env.DYNAMODB_REGION_CODE
});

const docClient = new AWS.DynamoDB.DocumentClient();

var removeEmptyStringElements = function (obj) {
    for (var prop in obj) {
        if (typeof obj[prop] === 'object') {// dive deeper in
            removeEmptyStringElements(obj[prop]);
        } else if(obj[prop] === '' || obj[prop] === null) {// delete elements that are empty strings
            delete obj[prop];
        }
    }
    return obj;
};

module.exports = {
    createItem: function (requestId, opcode, amount, quantity, action, callback) {
        var id = uuid4();
        id = id.split('-').join('');

        var params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: {
                id: id,
                request_id: requestId,
                opcode: opcode,
                status: 'INIT',
                amount: amount,
                quantity: quantity,
                action: action.toUpperCase(),
                provider: process.env.PREPAID_CARD_SERVICE_PROVIDER,
                created_at: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
                updated_at: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss')
            }
        };

        params = removeEmptyStringElements(params);

        log.debug('DYNAMODB add new item', 'START', id);

        docClient.put(params, function (err, result) {
            if (err) {
                log.error('DYNAMODB adds new item', 'FINISHED', JSON.stringify(err, null, 2));

                callback({
                    code: 'error-dynamodb-provider',
                    message: err.message.toString()
                }, null);
            } else {
                log.debug('DYNAMODB adds new item', 'FINISHED', JSON.stringify(result, null, 2));

                callback(null, params.Item);
            }
        });
    },

    updateItem: function (id, payload, callback) {
        var updateExpress = ['#updated_at=:updated_at'],
            attributeNames = {
                '#updated_at': 'updated_at'
            },
            attributeValues = {
                ':updated_at': dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss')
            };
        var updateQuery = '';

        payload = removeEmptyStringElements(payload);

        var payloadKeys = Object.keys(payload);

        if (payloadKeys.length > 0) {
            for(var i = 0; i < payloadKeys.length; i++) {
                updateExpress.push('#' + payloadKeys[i] + '=:' + payloadKeys[i]);
                attributeNames['#' + payloadKeys[i]] = payloadKeys[i];
                attributeValues[':' + payloadKeys[i]] = payload[payloadKeys[i]];
            }

            updateQuery += 'set ' + updateExpress.join(',');
        }

        var params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
                id: id
            },
            UpdateExpression: updateQuery,
            ExpressionAttributeNames: attributeNames,
            ExpressionAttributeValues:attributeValues,
            ReturnValues: 'UPDATED_NEW'
        };

        log.debug('DYNAMODB update item', 'START', id);
        docClient.update(params, function (err, result) {
            if (err) {
                log.error('DYNAMODB updates item', 'FINISHED', JSON.stringify(err, null, 2));

                callback && callback({
                    code: 'error-dynamodb-provider',
                    message: err.message.toString()
                }, null);
            } else {
                log.debug('DYNAMODB updates item', 'FINISHED', JSON.stringify(result, null, 2));

                callback && callback(null, result);
            }
        });
    },
    
    readItemById: function (id, callback) {
        var params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
                id: id
            }
        };

        log.debug('DYNAMODB reads item', 'START', id);
        docClient.get(params, function(err, data) {
            if (err) {
                log.error('DYNAMODB reads item', 'FINISHED', JSON.stringify(err, null, 2));

                callback({
                    code: 'error-dynamodb-provider',
                    message: err.message.toString()
                }, null);
            } else {
                log.debug('DYNAMODB reads item', 'FINISHED', JSON.stringify(data, null, 2));

                callback(null, data.Item);
            }
        });
    }
};