const express = require('express')
const router = express.Router();
const AWS = require('aws-sdk')
const fs = require('fs')
const config = require('../config')()

AWS.config.update(config.aws);

const dynamodb = new AWS.DynamoDB();

const docClient = new AWS.DynamoDB.DocumentClient();

router.get('/add/leads', (req, res, next) => {
  let leads = JSON.parse(fs.readFileSync('salescalls.json', 'utf8'));
  leads.forEach((lead) => {
    let params = {
      TableName: 'Leads',
      Item: {
        "id": lead.id,
        "sales_rep": lead.sales_rep,
        "date": lead.date,
        "client": lead.client,
        "primary_contact": lead.primary_contact,
        "title": lead.title,
        "vertical": lead.vertical,
        "meeting_location": lead.meeting_location,
        "interaction_purpose": lead.interaction_purpose,
        "outcome": lead.outcome,
        "status": lead.status
      }
    }
    docClient.put(params, (err, data) => {
      if (err) console.log(`Could not upload ${lead.client}`)
      else console.log(`Uploaded`)
    })
  })
  return res.send("Done")
})

router.get('/add/salesreps', (req, res, next) => {
  let salesReps = JSON.parse(fs.readFileSync('salesreps.json', 'utf8'));
  salesReps.forEach(function (salesRep) {
    var params = {
      TableName: "SalesReps",
      Item: {
        "name": salesRep.name,
        "mrr": salesRep.mrr,
        "logos": salesRep.logos,
        "calls": salesRep.calls,
        "id": salesRep.id,
        "leads": salesRep.leads,
        "contacts": salesRep.contacts,
        "needs": salesRep.needs,
        "proposals": salesRep.proposals,
        "negotiations": salesRep.negotiations,
        "won": salesRep.won
      }
    };

    docClient.put(params, function (err, data) {
      if (err) {
        console.error("Unable to add salesRep", salesRep.name, ". Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("PutItem succeeded:", salesRep.name);
      }
    });
  });
})

router.get('/salesreps', (req, res, next) => {
  let params = {
    TableName: 'SalesReps',
    KeySchema: [
      { AttributeName: 'id', KeyType: "HASH" },
      { AttributeName: 'mrr', KeyType: "Range" }
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName:"mrr", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }
  dynamodb.createTable(params, (err, data) => {
    if (err) return res.send('Unable to create table')
    else return res.send("Table created successfully")
  })
})

router.get('/leads', (req, res, next) => {
  let params = {
    TableName: 'Leads',
    KeySchema: [
      { AttributeName: 'id', KeyType: "HASH" },
      { AttributeName: 'status', KeyType: "Range" }
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "status", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }
  dynamodb.createTable(params, (err, data) => {
    if (err) return res.send('Unable to create table')
    else return res.send("Table created successfully")
  })
})

router.get('/delete', (req, res, next) => {
  var params = {
    TableName: "SalesReps"
  };

  dynamodb.deleteTable(params, function (err, data) {
    if (err) {
      console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
  });
  return res.send("Deleted")
})


module.exports = router;