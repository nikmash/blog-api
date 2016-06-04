# Blog API

| Endpoint           | Method     | Description                 | Required Params                           | Authentication Needed? |
| ------------------ | ---------- | --------------------------- | ----------------------------------------- | ---------------------- |
| /authors           | POST       | Creates new author          | first_name, last_name, username, password | NO                     |
| /auth              | POST       | Returns an Auth Token       | username, password                        | NO                     |
| /posts             | POST       | Creates a new blog post     | title, text                               | YES                    |
| /posts             | GET        | Gets all blog posts         | NONE                                      | NO                     |
| /posts/:id         | GET        | Gets a blog post            | id                                        | NO                     |
| /comments          | POST       | Creates a new comment       | post_id, name, text                       | NO                     |
| /comments/:post_id | GET        | Gets all comments of a post | post_id                                   | NO                     |

# Running Instructions
Requirements:
  - MongoDB running on localhost on port 27017
  - Node v6.2.x

Make sure to do an `npm install`!

To Run: `npm start`
To Test: `npm test`

# Design Information

Authentication
--------------
For the authentication portion I used JSON Web Tokens. There is a middleware on all routes that need to be protected by auth that will decrypt a
JSON Web Token that you can pass in your request as the param `token` or in the body as `token` or as a request header `x-access-token`.

Endpoints
---------
I designed this API strategically because a normal blog UI would probably have a list view which would use `GET /posts` and also a post view
which should use `GET /posts/:id`. Then the blog post view would need to `GET /comments/:post_id` which would return all the comments of a given `post_id`.

Database Schema Decisions
---------
Since I had no clue what kind of scale this API would be used I normalized all the documents and made all of my One-to-Many relationships with document references instead of embedded documents.
