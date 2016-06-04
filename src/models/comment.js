const mongoose = require('mongoose')

let CommentSchema = new mongoose.Schema({
  post_id: {
    type: String,
    required: true
  },
  name: {
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

module.exports = mongoose.model('Comment', CommentSchema)
