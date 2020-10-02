const {render, render404} = require('app/template')
const BlogPost = require('app/services/blog_post')

const LIMIT = 100

function list(req, res) {
  const testPost = {id: 1, created_at: new Date(), body: 'awesome post!', subject: 'awesome!', comments_count: 0}
  const page = parseInt(req.params.page || 1)
  const skip = (page - 1) * LIMIT
  const query = {skip, limit: LIMIT}
  BlogPost.list(query).then(posts => {
    const nextPage = (posts.length === LIMIT ? (page + 1) : null)
    render(res, 'peter/index', {posts, nextPage})
  })
}

function show(req, res) {
  const versionToken = req.params.versionToken
  BlogPost.get(req.params.id, {versionToken}).then(post => {
    if (post) {
      render(res, 'posts/show', {post, comments: []})
    } else {
      render404(res)
    }
  })
}

function feed(req, res) {
  const query = {limit: LIMIT}
  BlogPost.list(query).then(posts => {
    render(res, 'peter/feed.xml', {posts}, {layout: false})
  })
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
