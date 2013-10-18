"use strict"

var mongojs = require('mongojs')

exports.db = function (dbname, host, username, password) {
	var connectionString = dbname

	if (host) connectionString = host + '/' + connectionString
	if (username && password) connectionString = username + ':' + password + '@' + connectionString

	this.dbName = dbname
	this.db = mongojs.connect(connectionString)
	this.collectionHash = {}
}

exports.db.prototype = 
{ getCollections: function(callback) {
	 this.db.getCollectionNames(callback)
  }
  ,collection:  function(collectionName, callback) {
	  var collection = this.db.collection(collectionName, callback)
	  this.collectionHash[collectionName] = collection
	  return collection
  },

}