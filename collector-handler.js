'use strict';

const database = require('./connectors/dynamodb');
const prepaidCardProvider = require('./providers/' + process.env.PREPAID_CARD_SERVICE_PROVIDER.toLowerCase());

function CollectorHandler() {
    this.listeners = [];
    this.consumer = {
        commit: function (callback) {
            callback(null, {});
        }
    };
}

/**
 * Takes a measurement of CollectorHandler state, stores in history, and notifies listeners.
 */
CollectorHandler.prototype.sendRequestCreatingOrderToProviderService = function (object, callback) {
    if (process.env.PREPAID_CARD_SERVICE_PROVIDER_ENABLED === 'YES' && object) {
        prepaidCardProvider.createOrder(object.reference_id, object.opcode, object.amount, object.quantity, callback);
    } else {
        database.updateItem(object.reference_id, {status: 'FAILED'});
    }
};

CollectorHandler.prototype.sendRequestCheckingTransToProviderService = function (referenceId, callback) {
    prepaidCardProvider.checkTrans(referenceId, callback);
};

CollectorHandler.prototype.sendRequestInquiryToProviderService = function (object, callback) {
    prepaidCardProvider.checkStore(object.opcode, object.amount, callback);
};

module.exports = function () {
    return new CollectorHandler();
};