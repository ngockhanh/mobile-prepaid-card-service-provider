'use strict';
const Log = require('timestamp-log');
const log = new Log(process.env.LOG_LEVEL);
const crypto = require('crypto');
const path = require('path');
const fileSystem = require('fs');
const soap = require('soap');

var SuccessCodes = [0],
    PendingCodes = [23, 99];

var getSign = function (payload) {
    var payloadValues = Object.values(payload);
    var sign = crypto.createSign('SHA1');
    var privateKey = getPrivateKey();

    sign.update(payloadValues.join(''), 'utf8');

    return sign.sign(privateKey, 'base64');
};

var getPrivateKey = function () {
    var appRootPath = require('app-root-path');
    var privateKeyPath = path.join(appRootPath.toString(), process.env.PREPAID_CARD_SERVICE_PROVIDER_SECURE_PRIVATE_KEY);

    if (fileSystem.existsSync(privateKeyPath)) {
        var content = fileSystem.readFileSync(privateKeyPath, 'utf8');

        if (content.length == 0) {
            throw new Error('Private key invalid');
        }

        return content;
    }

    throw new Error('Private key is not found');
};

var des_ecb_descrypt = function (params) {
    var iv = new Buffer(params.iv ? params.iv : 0),
        key = params.key,
        alg = params.alg,
        autoPad = params.autopad,
        encrypted = params.plaintext;

    var decipher = crypto.createDecipheriv(alg, key, iv);
    decipher.setAutoPadding(autoPad);

    var descrypted = decipher.update(encrypted, 'base64', params.outputType || 'utf8');
    descrypted += decipher.final(params.outputType ||'utf8');

    return descrypted;
};

var getListCards = function (encryptedListCards) {
    var md5 = require('md5');
    var key = md5(process.env.PREPAID_CARD_SERVICE_PROVIDER_KEY_SOFPIN);
    var params = {
        alg: 'des-ede3',
        autopad: true,
        key: key.substring(0, 24),
        plaintext: encryptedListCards,
        outputType: 'utf8',
        iv: null
    };

    var cards = JSON.parse(des_ecb_descrypt(params));
    var cardsInfo = [];
    cards = cards['listCards'];

    if (cards.length > 0) {
        var n = cards.length;

        for (var i = 0; i < n; i++) {
            var info = cards[i].split('|');
            cardsInfo.push({
                opocode: info[0],
                code: info[3],
                amount: info[1],
                serial: info[2],
                expire: info[4]
            });
        }
    }
    return cardsInfo;
};

var sendRequestCreatingOrder = function (requestId, opcode, amount, quantity, callback) {
    try {
        var payload = {
            requestId: process.env.PREPAID_CARD_SERVICE_PROVIDER_PARTNER_NAME + '_' + requestId,
            partnerName: process.env.PREPAID_CARD_SERVICE_PROVIDER_PARTNER_NAME,
            provider: opcode,
            amount: amount,
            quantity: quantity
        };

        payload['sign'] = getSign(payload);

        soap.createClientAsync(process.env.PREPAID_CARD_SERVICE_PROVIDER_URL)
            .then(function (client) {
                client.downloadSoftpinAsync(payload)
                    .then(function (result) {
                        var code = result.downloadSoftpinReturn.errorCode['$value'];
                        var listCards = result.downloadSoftpinReturn.listCards;
                        var message = result.downloadSoftpinReturn.message['$value'];

                        var status = 'FAILED';

                        if (SuccessCodes.indexOf(code) >= 0) {
                            status = 'SUCCESS';
                            message = '';
                        }

                        if (PendingCodes.indexOf(code) >= 0) {
                            status = 'PENDING';
                        }

                        callback(null, {
                            request_id: requestId,
                            status: status,
                            items: listCards['$value'] ? getListCards(listCards['$value']) : null,
                            message: message
                        });

                        log.debug(result);
                    })
                    .catch(function (err) {
                        callback({
                            code: 'FAILED',
                            message: 'An error has occurred'
                        });

                        log.error('VNPTEPAY: ', err);
                    });
            })
            .catch(function (e) {
                callback({
                    code: 'error-prepaid-card-provider',
                    message: 'VNPTEPAY: ' + e.message.toString()
                });

                log.error(e);
            });
    } catch (e) {
        callback({
            code: 'error-prepaid-card-provider',
            message: 'VNPTEPAY: ' + e.message.toString()
        });

        log.error(e);
    }
};

var sendRequestCheckingTrans = function (requestId, callback) {
    try {
        var payload = {
            requestId: process.env.PREPAID_CARD_SERVICE_PROVIDER_PARTNER_NAME + '_' + requestId,
            partnerName: process.env.PREPAID_CARD_SERVICE_PROVIDER_PARTNER_NAME,
            type: 2
        }

        payload['sign'] = getSign(payload);

        soap.createClientAsync(process.env.PREPAID_CARD_SERVICE_PROVIDER_URL)
            .then(function (client) {
                client.checkTransAsync(payload)
                    .then(function (result) {
                        var code = result.checkTransReturn.errorCode['$value'];
                        var message = result.checkTransReturn.message['$value'];

                        var status = 'FAILED';

                        if (SuccessCodes.indexOf(code) >= 0) {
                            status = 'SUCCESS';
                            message = false;
                        }

                        if (PendingCodes.indexOf(code) >= 0) {
                            status = 'PENDING';
                        }

                        callback(null, {
                            request_id: requestId,
                            status: status,
                            message: message
                        });

                        log.debug('VNPTEPAY: ', result);
                    })
                    .catch(function (err) {
                        callback({
                            code: 'error-prepaid-card-provider',
                            message: 'VNPTEPAY: ' + err.message.toString()
                        });

                        log.error(err);
                    });
            })
            .catch(function (e) {
                callback({
                    code: 'error-prepaid-card-provider',
                    message: 'VNPTEPAY: ' + e.message.toString()
                });

                log.error(e);
            });
    } catch (e) {
        callback({
            code: 'error-prepaid-card-provider',
            message: 'VNPTEPAY: ' + e.message.toString()
        });

        log.error(e);
    }
};

var sendRequestCheckingStore = function (opcode, amount, callback) {
    try {
        var payload = {
            partnerName: process.env.PREPAID_CARD_SERVICE_PROVIDER_PARTNER_NAME,
            provider: opcode,
            amount: amount
        };

        payload['sign'] = getSign(payload);

        soap.createClientAsync(process.env.PREPAID_CARD_SERVICE_PROVIDER_URL)
            .then(function (client) {
                client.checkStoreAsync(payload)
                    .then(function (result) {
                        callback(null, {amount: result.checkStoreReturn['$value']});

                        log.debug(result);
                    })
                    .catch(function (err) {
                        callback({
                            code: 'error-prepaid-card-provider',
                            message: 'VNPTEPAY: ' + err.message.toString()
                        });

                        log.error(err);
                    });
            })
            .catch(function (e) {
                callback({
                    code: 'error-prepaid-card-provider',
                    message: 'VNPTEPAY: ' + e.message.toString()
                });

                log.error(e);
            });
    } catch (e) {
        callback({
            code: 'error-prepaid-card-provider',
            message: 'VNPTEPAY: ' + e.message.toString()
        });

        log.error(e);
    }
};

module.exports = {
    createOrder: function (requestId, opcode, amount, quantity, callback) {
        sendRequestCreatingOrder(requestId, opcode, amount, quantity, callback);
    },
    
    checkTrans: function (requestId, callback) {
        sendRequestCheckingTrans(requestId, callback);
    },

    checkStore: function (opcode, amount, callback) {
        sendRequestCheckingStore(opcode, amount, callback);
    }
};