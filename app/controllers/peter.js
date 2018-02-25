const {render} = require('app/template')

function list(req, res) {
  const testPost = {id: 1, created_at: new Date(), body: 'awesome post!', subject: 'awesome!', comments_count: 0}
  render(res, 'peter/index', {posts: [testPost], pagination: {}})
}

function show(req, res) {
  const testPost = {id: 1, created_at: new Date(), body: 'awesome post!', subject: 'awesome!', comments_count: 0}
  render(res, 'posts/show', {post: testPost, comments: []})
}

function feed(req, res) {
  render(res, 'peter/feed', {posts: []})
}

function cv(req, res) {
  render(res, 'peter/cv', {}, {layout: false})
}

function contact(req, res) {
  render(res, 'peter/contact')
}

module.exports = {
  list,
  show,
  feed,
  cv,
  contact
}
