const mongoose = require('mongoose')
const Schema = mongoose.Schema

let PostSchema = new Schema({
  author_id : {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', PostSchema)
