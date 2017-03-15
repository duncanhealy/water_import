// var EJSON = require('mongodb-extended-json')
// var BSON = require('bson')
var mongodb = require('mongodb')
var dotenv = require('dotenv')

dotenv.load()
// We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient

// Connection URL. This is where your mongodb server is running.
// need to get
const mongoconnection = process.env['WATER_CONNECTION_DB']
var doc = require('./xlsimport')

// console.log('Doc', doc);

// console.log('JSON', JSON.stringify(doc));
// > JSON {"_id":"53c2ab5e4291b17b666d742a","last_seen_at":"2014-07-13T15:53:02.008Z"}

// console.log('EJSON', EJSON.stringify(doc));

// var url = 'mongodb://localhost:27017/my_database_name';

// Use connect method to connect to the Server
MongoClient.connect(mongoconnection, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err)
  } else {
    // HURRAY!! We are connected. :)
    console.log('Connection established to', mongoconnection)

    // do some work here with the database.
    var water = db.collection('xlsimport')
    water.insert(doc)

    // Close connection
    db.close()
  }
})

// > EJSON {"_id":{"$oid":"53c2ab5e4291b17b666d742a"},"last_seen_at":{"$date":1405266782008},"display_name":{"$undefined":true}}

// And likewise, EJSON.parse works just as you would expect.
// EJSON.parse('{"_id":{"$oid":"53c2ab5e4291b17b666d742a"},"last_seen_at":{"$date":1405266782008},"display_name":{"$undefined":true}}');
// { _id: 53c2ab5e4291b17b666d742a,
//   last_seen_at: Sun Jul 13 2014 11:53:02 GMT-0400 (EDT),
//  display_name: undefined }
