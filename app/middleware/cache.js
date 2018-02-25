const config = require('app/config')

const setCacheHeader = function(req, res, next) {
  // Set cache header for the CDN (i.e. Cloudfront)
  res.setHeader('Cache-Control', `public, max-age=${config.CACHE_MAX_AGE}`)
  next()
}

module.exports = {
  setCacheHeader
}
