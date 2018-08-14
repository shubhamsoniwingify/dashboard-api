const express = require('express')
const router = express.Router()
const AWS = require('aws-sdk')
const config = require('../config')()

AWS.config.update(config.aws);

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

router.get('/read', (req, res, next) => {
  var params = {
    TableName: "Leads"
  };
  docClient.scan(params, (err, data) => {
    if (err) return res.send("Unable to get data")
    else return res.send(data.Items)
  })
})

module.exports = router