"use strict"

var restify = require('restify')
  , Getopt  = require('node-getopt')
  , redis   = require('node-redis')
  , model   = require('./model/backend-mongo.js')
  , db      = new model.db('gabrielle')

var welcome = db.collection('welcome')
