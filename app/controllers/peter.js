const template = require('app/template')

function list(req, res) {
  const testPost = {id: 1, created_at: new Date(), body: 'awesome post!', subject: 'awesome!', comments_count: 0}
  const content = template('peter/index', {posts: [testPost], pagination: {}})
  const body = template('layout', {content})
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(body)
}

module.exports = {
  list
}
