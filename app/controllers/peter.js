const {render, render404} = require('app/template')
const BlogPost = require('app/services/blog_post')

const PER_PAGE = 100

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
  const version_token = req.params.version_token
  BlogPost.get(req.params.id, {version_token}).then(post => {
    if (post) {
      render(res, 'posts/show', {post, comments: []})
    } else {
      render404(res)
    }
  })
}

function feed(req, res) {
  const query = {'per-page': PER_PAGE}
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
