const config = require('app/config')
const client = require('app/http_client')
const u = require('app/util')

function jsonResponse(response) {
  return JSON.parse(response.body)
}

function get(id, options = {}) {
  const query = options.versionToken ? {versionToken: options.versionToken} : {published: '1'}
  query.apiKey = config.API_KEY
  const url = config.API_BASE_URL + `/blog_posts/${id}`
  return client.get(url, {query}).then(jsonResponse)
      .then(body => u.getIn(body, 'data'))
}

function list(query) {
  const url = config.API_BASE_URL + '/blog_posts?published=1'
  const apiQuery = u.merge(query, {apiKey: config.API_KEY})
  return client.get(url, {query: apiQuery}).then(jsonResponse).then(body => {
    return u.getIn(body, 'data')
  })
}

module.exports = {
  get,
  list
}
