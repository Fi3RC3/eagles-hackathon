/**
 * GET /categories
 */

const Transaction = require('../models/Transaction');

exports.settlementCurrency = (req, res) => {

  var client = req.query.client;

  Transaction.aggregate([
          { $project: {'Settlement_Currency': 1, 'Counterparty_Name':1} },
          { $match: { 'Counterparty_Name': {$exists: true, $nin: ['']}, 'Counterparty_Name': client}},
          { $group : {_id:'$Settlement_Currency', count:{$sum:1}}}],
        function (err, result) {
          if (err) {
            console.log(err);
            return;
        }
        res.send(result.map((type) => [type._id, type.count]));
    });
};


exports.securityType = (req, res) => {

  var client = req.query.client;

  Transaction.aggregate([
          { $project: {'Security_Type_Description': 1, 'Counterparty_Name':1, 'Net_Settlement_Amount': 1} },
          { $match: { 'Counterparty_Name': {$exists: true, $nin: ['']}, 'Counterparty_Name': client}},
          { $group : {_id:'$Security_Type_Description', count:{$sum:'$Net_Settlement_Amount'}}},
          { $match: {'count': {$lt: 0}}},
          { $limit: 5}],
        function (err, result) {
          if (err) {
            console.log(err);
            return;
        }
        res.send(result.map((type) => [type._id, Math.abs(type.count)]));
    });
};

exports.securityTypeByAmt = (req, res) => {

  var client = req.query.client;

  Transaction.aggregate([
          { $project: {'Security_Type_Description': 1, 'Counterparty_Name':1, 'Net_Settlement_Amount': 1} },
          { $match: { 'Counterparty_Name': {$exists: true, $nin: ['']}, 'Counterparty_Name': client}},
          { $group : {_id:'$Security_Type_Description', count:{$sum:'$Net_Settlement_Amount'}}},
          { $match: {'count': {$gt: 0}}},
          { $limit: 5 }],
        function (err, result) {
          if (err) {
            console.log(err);
            return;
        }
        res.send(result.map((type) => [type._id, type.count]));
    });
};
