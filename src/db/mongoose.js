const mongoose = require('mongoose')
const config = require('../config.js')

if (process.env.ENV === 'Test') {
  mongoose.connect(config.database_test)
} else {
  mongoose.connect(config.database)
}

const db = mongoose.connection

db.on('error', (err) => {
  console.error(err)
})

db.once('open', () => {
  console.log('Connected to DB!')
})

module.exports = mongoose
