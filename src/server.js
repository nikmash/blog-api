'use strict'
const express = require('express'),
      session = require('express-session'),
      http = require('http'),
      bodyParser = require('body-parser'),
      config = require('./config')

const app = express()
const db = require('./db/mongoose.js')
const router = express.Router()
const jwt = require('jsonwebtoken')

let routes = require('./routes/index.js')

// Middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(router)

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message
  });
});

routes(router, db)

app.listen(5000, function() {
  console.log('API running on port 5000')
})

if (require.main !== module) {
  module.exports = app
}
