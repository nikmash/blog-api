var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

var AuthorSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
})
//
AuthorSchema.pre('validate', function(next) {
  if (this._password === undefined) {
    let err = new Error('Password undefined')
    return next(err)
  }
  let author = this

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    // has the password along with the new salt
    bcrypt.hash(author._password, salt, null, (err, hash) => {
      if (err) return next(err)

      author.hash = hash
      author.salt = salt
      next()
    })
  })

})

AuthorSchema.virtual('password').set(function(pass) {
  this._password = pass
})

AuthorSchema.methods.checkPass = function(pass) {
  return bcrypt.hashSync(pass, this.salt) === this.hash
}

module.exports = mongoose.model('Author', AuthorSchema)
