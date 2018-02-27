const config = require('app/config')
const client = require('app/http_client')
const u = require('app/util')

function jsonResponse(response) {
  return JSON.parse(response.body)
}

function get(id) {
  const url = config.API_BASE_URL + `/blog_posts/${id}?published=1`
  return client.get(url).then(jsonResponse)
      .then(body => u.getIn(body, 'data', 'attributes'))
}

function list(query) {
  const url = config.API_BASE_URL + '/blog_posts?published=1'
  return client.get(url, {query}).then(jsonResponse).then(body => {
    return body.data.map(doc => doc.attributes)
  })
}

module.exports = {
  get,
  list
}
