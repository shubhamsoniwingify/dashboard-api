const express = require('express')
const router = express.Router()
const AWS = require('aws-sdk')
const config = require('../config')()

AWS.config.update(config.aws);

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

router.get('/read', (req, res, next) => {
  let params = {
    TableName: "SalesReps"
  };
  docClient.scan(params, (err, data) => {
    if (err) return res.send("Unable to get data")
    else return res.send(data.Items)
  })
})

router.get('/names', (req, res, next) => {
  let params = {
    TableName: 'SalesReps',
    AttributesToGet: ['name'],
    ConsistentRead: false,
    ReturnConsumedCapacity: 'NONE'
  }
  dynamodb.scan(params, function (err, data) {
    if (err) return res.send(err)
    let response = []
    for (let index = 0; index < data.Items.length; index++) {
      response.push(data.Items[index].name.S)
    }
    return res.send(response)
  })
})

router.get('/info/all', (req, res, next) => {
  let params = {
    TableName: 'SalesReps'
  }
  docClient.scan(params, (err, data) => {
    if (err) return res.send(err)
    let items = data.Items
    let response = {
      needs: 0,
      calls: 0,
      leads: 0,
      won: 0,
      proposals: 0,
      negotiations: 0,
      logos: 0,
      contacts: 0,
      mrr: 0
    }
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      response.needs += element.needs 
      response.calls += element.calls 
      response.leads += element.leads 
      response.won += element.won 
      response.proposals += element.proposals 
      response.negotiations += element.negotiations 
      response.logos += element.logos 
      response.contacts += element.contacts 
      response.mrr += element.mrr 
    }
    return res.send(response)
  })
})

router.get('/info/:name', (req, res, next) => {
  let name = req.params.name
  let params = {
    TableName: "SalesReps",
    KeyConditionExpression: "#name = :name",
    FilterExpression: "#name = :name",
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":name": name
    }
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      return res.send(err)
    } else {
      return res.send(data.Items)
    }
  });
})


module.exports = router