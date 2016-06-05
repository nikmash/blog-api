const mongoose = require('mongoose')
const config = require('../config.js')

if (process.env.ENV === 'test') {
  mongoose.connect(config.database_test)
} else if (process.env.ENV === 'server') {
  mongoose.connect(config.database_server)
} else if (process.env.ENV === 'servertest') {
  mongoose.connect(config.database_server_test)
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
