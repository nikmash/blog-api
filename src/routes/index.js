'use strict'

const Author = require('../models/author')
const Comment = require('../models/comment')
const Post = require('../models/post')
const jwt = require('jsonwebtoken')
const config = require('../config')
const bcrypt = require('bcrypt-nodejs')

module.exports = function (router, db) {

  // Check Token Middleware
  let checkToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token']
    if (token) {
      jwt.verify(token, config.secret, (err, tok) => {
        if (err) {
          let err = new Error('Failed to authenticate token.')
          err.status = 403
          return next(err)
        }

        req.token = tok
        return next()
      })
    } else {
      let err = new Error('No token provided. You may not enter.')
      return next(err)
    }
  }

  router.get('/', (req, res) => {
    res.json({message: 'yay its working'})

  })

  router.route('/auth')
    .post((req, res, next) => {
      if (!req.body['username'] || !req.body['password']) {
        let error = new Error('Please provide a username and password.')
        error.status = 400
        return next(error)
      }

      Author.findOne({
        username: req.body.username
      }, (err, author) => {
        if (err) {
          let error = new Error(err)
          return next(error)
        }

        if (!author) {
          let error = new Error('Authentication failed. User not found.')
          return next(error)
        }

        if (author.checkPass(req.body.password)) {
          // Create Json web token and expire in 2 days
          let token = jwt.sign(author, config.secret, {
            expiresIn: "2 days"
          })

          return res.json({
            success: true,
            token: token
          })
        }

        let error = new Error('Authentication failed. Password incorrect.')
        return next(error)

      })
    })

  router.route('/posts')
    .post(checkToken, (req, res, next) => {
      req.body['author_id'] = req.token._doc._id
      let post = new Post(req.body)

      post.save((err, result) => {
        if (err) {
          let error
          if (err.name === 'ValidationError') {
            error = new Error('Missing parameters.')
            error.status = 400
          } else {
            error = new Error(err.message)
          }
          return next(error)
        }

        res.json({
          success: true,
          post: result
        })
      })
    })
    .get((req, res, next) => {
      Post.find({}).sort({createdAt: 'desc'}).exec((err, result) => {
        if (err) {
          let error = new Error(err.message)
          return next(error)
        }
        res.json({
          success: true,
          posts: result
        })
      })
    })

  router.route('/posts/:id')
    .get((req, res, next) => {
      Post.findById(req.params.id, (err, result) => {
        if (err) {
          let error = new Error(err.message)
          return next(error)
        }
        res.json({
          success: true,
          post: result
        })
      })
    })

  router.route('/comments')
    .post((req, res, next) => {
      let body = req.body
      let comment = new Comment(req.body)

      comment.save((err, result) => {
        if (err) {
          let error
          if (err.name === 'ValidationError') {
            error = new Error('Missing parameters.')
            error.status = 400
          } else {
            error = new Error(err.message)
          }
          return next(error)
        }

        res.json({
          success: true,
          comment: result
        })
      })
    })

  router.route('/comments/:post_id')
    .get((req, res, next) => {

      Comment.find({post_id: req.params.post_id}, (err, result) => {
        if (err) {
          let error = new Error(err.message)
          return next(error)
        }

        res.json({
          success: true,
          comments: result
        })
      })

    })

  router.route('/authors')
    .post((req, res, next) => {
      let author = new Author(req.body)

      author.save((err, result) => {
        if (err) {
          let error

          if (err.name === 'ValidationError') {
            error = new Error('Missing parameters.')
            error.status = 400
          } else if (err.code === 11000) {
            error = new Error('Username already exists.')
            error.status = 409 // Conflict
          } else {
            error = new Error(err.message)
          }

          return next(error)
        }

        return res.json({
          success: true,
          author: {
            username: result.username,
            first_name: result.first_name,
            last_name: result.last_name
          }
        })
      })
    })
}
