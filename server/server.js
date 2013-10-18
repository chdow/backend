"use strict"

var restify = require('restify')
  , Getopt  = require('node-getopt')
  , redis   = require('node-redis')
  , model   = require('./model/backend-mongo.js')

var getopt =  new Getopt(
  [['p', 'port=ARG',       'port on which to run server']
  ,['n', 'name=ARG',       'server name & path for POST (optional--default: track)']
  ,['h', 'help',           'display this message']
  ])
  , prognametokens = process.argv[1].split('/')
  , progname = prognametokens[prognametokens.length-1]

getopt.setHelp(progname + " - backend services for web sites\n" 
              +"Usage:  " + progname + " [OPTION]\n" 
              +"options:\n" 
              +"[[OPTIONS]]\n"
              );

var opts       = getopt.parseSystem().options
  , port       = opts['port']
  , name       = opts['name'] ? opts['name'] : 'backend'

if (!port) {
  getopt.showHelp()
  process.exit(-1)
}

var dbHash = {}
  , collectionHash
  , serverOptions = {name:name}
  , server = restify.createServer(serverOptions)


function getDatabase(req, res, next) {
	if (!req.params.database) return next() // not an error
	var dbName = req.params.dbName
	if (dbHash[dbName]) req.params.db = dbHash[dbName]
	else req.params.db = new model(dbName)

	return next()	
}

function getCollection(req, res, next) {
	if (!req.params.collectionName) return next() // not an error
	var collectionName = req.params.collectionName
	if (collectionHash[collectionName]) req.params.collection = collectionHash[collectionName]
	else req.params.collection = model.collection(collectionName)

	return next()
}

server.use(restify.bodyParser({ mapParams: false }))
server.use(getDatabase)


server.listen(port, function() {
  console.log(name + ' server listening on port ' + port)
});

