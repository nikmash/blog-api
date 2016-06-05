const request = require('supertest'),
      app = require('../server.js'),
      config = require('../config.js')
      expect = require('expect.js')
      mongoose = require('mongoose')

// Models
let author = require('../models/author'),
    comment = require('../models/comment'),
    post = require('../models/post')

describe('REST API', function() {
  let db
  let token
  let post_id

  before((done) => {
    if (mongoose.connection.db) {
      db = mongoose.connection.db
      return done()
    }
    if (process.env.ENV == test) {
        db = mongoose.connect(config.database_test, done)
    } else if (process.env.ENV == testserver) {
      db = mongoose.connect(config.database_server_test, done)
    }

  })

  describe('POST /authors', function() {
    it('should create a new author', function(done) {
      let payload = {
        username: 'dtrump',
        password: 'drumpf',
        first_name: 'Donald',
        last_name: 'Trump'
      }

      request(app)
        .post('/authors')
        .set('Accept', 'application/json')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', true)
          expect(res.body).to.have.property('author')
          expect(res.body.author).to.have.property('username', 'dtrump')
          expect(res.body.author).to.have.property('first_name', 'Donald')
          expect(res.body.author).to.have.property('last_name', 'Trump')

        })
        .expect(200, done)
    })

    it('should return a duplicate username error', function(done) {
      let payload = {
        username: 'dtrump',
        password: 'drumpf',
        first_name: 'Donald',
        last_name: 'Trump'
      }

      request(app)
        .post('/authors')
        .set('Accept', 'application/json')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', false)
          expect(res.body).to.have.property('message', 'Username already exists.')
        })
        .expect(409, done)
    })

    it('should return a validation error', function(done) {
      let payload = {
        username: 'dtrump',
        password: 'drumpf',
        first_name: 'Donald'
      }

      request(app)
        .post('/authors')
        .set('Accept', 'application/json')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', false)
          expect(res.body).to.have.property('message', 'Missing parameters.')
        })
        .expect(400, done)
    })
  })

  describe('POST /auth', function() {
    it ('should respond with jwt', function(done) {
      let payload = {
        username: 'dtrump',
        password: 'drumpf',
      }

      request(app)
        .post('/auth')
        .set('Accept', 'application/json')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', true)
          expect(res.body).to.have.property('token')
          token = res.body.token
        })
        .expect(200, done)
    })

    it ('should respond with an error', function(done) {
      let payload = {
        username: 'dtrump'
      }

      request(app)
        .post('/auth')
        .set('Accept', 'application/json')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', false)
          expect(res.body).to.have.property('message', 'Please provide a username and password.')
        })
        .expect(400, done)
    })
  })

  describe('POST /posts', function() {
    it ('should return success with post information', function(done) {
      let payload = {
        title: 'The Great Wall',
        text: 'I will build a great wall – and nobody builds walls better than me, believe me – and I’ll build them very inexpensively.'
      }

      request(app)
        .post('/posts')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .send(payload)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', true)
          expect(res.body).to.have.property('post')
          expect(res.body.post).to.have.property('updatedAt')
          expect(res.body.post).to.have.property('createdAt')
          expect(res.body.post).to.have.property('title', payload.title)
          expect(res.body.post).to.have.property('text', payload.text)
          expect(res.body.post).to.have.property('author_id')
          expect(res.body.post).to.have.property('_id')
          post_id = res.body.post._id
        })
        .expect(200, done)
    })
  })

  describe('GET /posts', function() {
    it ('should respond with json', function(done) {
      let expectedResult = {
        title: 'The Great Wall',
        text: 'I will build a great wall – and nobody builds walls better than me, believe me – and I’ll build them very inexpensively.'
      }

      request(app)
        .get('/posts')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', true)
          expect(res.body).to.have.property('posts')
          expect(res.body.posts).to.be.an('array')
          expect(res.body.posts[0]).to.have.property('updatedAt')
          expect(res.body.posts[0]).to.have.property('createdAt')
          expect(res.body.posts[0]).to.have.property('title', expectedResult.title)
          expect(res.body.posts[0]).to.have.property('text', expectedResult.text)
        })
        .expect(200, done)
    })
  })

  describe('GET /posts/:id', function() {
    it('should respond with a post based on the id', function(done) {
      let expectedResult = {
        title: 'The Great Wall',
        text: 'I will build a great wall – and nobody builds walls better than me, believe me – and I’ll build them very inexpensively.'
      }

      request(app)
        .get('/posts/' + post_id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', true)
          expect(res.body).to.have.property('post')
          expect(res.body.post).to.have.property('updatedAt')
          expect(res.body.post).to.have.property('createdAt')
          expect(res.body.post).to.have.property('title', expectedResult.title)
          expect(res.body.post).to.have.property('text', expectedResult.text)
          expect(res.body.post).to.have.property('author_id')
          expect(res.body.post).to.have.property('_id')
        })
        .expect(200, done)
    })
  })

  describe('POST /comments', function() {
    it('should return success with comment information', function(done) {
      let payload = {
        post_id: post_id,
        name: 'Hillary Clinton',
        text: 'America is a country of diverse beliefs and heritages. That makes us strong, regardless of what Donald thinks.'
      }
      request(app)
        .post('/comments')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(payload)
        .expect((res) => {
          expect(res.body).to.have.property('success', true)
          expect(res.body).to.have.property('comment')
          expect(res.body.comment).to.have.property('updatedAt')
          expect(res.body.comment).to.have.property('createdAt')
          expect(res.body.comment).to.have.property('post_id', post_id)
          expect(res.body.comment).to.have.property('name', payload.name)
          expect(res.body.comment).to.have.property('text', payload.text)
          expect(res.body.comment).to.have.property('_id')
        })
        .expect(200, done)
    })

    it('should respond with an error', function(done) {
      let payload = {
        name: 'Hillary Clinton',
        text: 'America is a country of diverse beliefs and heritages. That makes us strong, regardless of what Donald thinks.'
      }

      request(app)
        .post('/comments')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(payload)
        .expect((res) => {
          expect(res.body).to.have.property('success', false)
          expect(res.body).to.have.property('message', 'Missing parameters.')
        })
        .expect(400, done)
    })
  })

  describe('GET /comments/:post_id', function() {
    it('should return success with comments from specified post_id', function(done) {
      let expectedResult = {
        name: 'Hillary Clinton',
        text: 'America is a country of diverse beliefs and heritages. That makes us strong, regardless of what Donald thinks.'
      }

      request(app)
        .get('/comments/' + post_id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', true)
          expect(res.body).to.have.property('comments')
          expect(res.body.comments).to.be.an('array')
          expect(res.body.comments[0]).to.have.property('_id')
          expect(res.body.comments[0]).to.have.property('updatedAt')
          expect(res.body.comments[0]).to.have.property('createdAt')
          expect(res.body.comments[0]).to.have.property('post_id', post_id)
          expect(res.body.comments[0]).to.have.property('name', expectedResult.name)
          expect(res.body.comments[0]).to.have.property('text', expectedResult.text)
        })
        .expect(200, done)
    })

    it('should not return any comments', function(done) {
      request(app)
        .get('/comments/0')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('success', true)
          expect(res.body).to.have.property('comments')
          expect(res.body.comments).to.be.an('array')
          expect(res.body.comments).to.be.empty()
        })
        .expect(200, done)
    })
  })

  after((done) => {
    db.dropDatabase()
    done()
  })
})
