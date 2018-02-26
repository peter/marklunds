const {render} = require('app/template')
const BlogPost = require('app/services/blog_post')

PER_PAGE = 100

function list(req, res) {
  const testPost = {id: 1, created_at: new Date(), body: 'awesome post!', subject: 'awesome!', comments_count: 0}
  const page = parseInt(req.params.page || 1)
  const query = {page, 'per-page': PER_PAGE}
  BlogPost.list(query).then(posts => {
    const nextPage = (posts.length === PER_PAGE ? (page + 1) : null)
    render(res, 'peter/index', {posts, nextPage})
  })
}

function show(req, res) {
  BlogPost.get(req.params.id).then(post => {
    render(res, 'posts/show', {post, comments: []})
  })
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
