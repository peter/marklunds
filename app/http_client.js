const https = require('https')
const http = require('http')
const querystring = require('querystring')
const logger = require('app/logger')

function httpModule(url) {
  return url.startsWith('https') ? https : http
}

function urlWithQuery(url, query) {
  if (query) {
    const sep = (url.includes('?') ? '&' : '?')
    return url + sep + querystring.stringify(query)
  } else {
    return url
  }
}

function get(url, options = {}) {
  url = urlWithQuery(url, options.query)
  const beforeTime = Date.now()
  return new Promise(function(resolve, reject) {
    httpModule(url).get(url, (res) => {
      let body = ''
      res.on('data', function(chunk) {
        body += chunk
      })
      res.on('end', function() {
        const responseTime = Date.now() - beforeTime
        logger.debug(`http_client.get url=${url} status=${res.statusCode} response_time=${responseTime} body.length=${body.length}`)
        if (logger.shouldLog('verbose')) logger.verbose(`http_client.get body=${body}`)
        if (res.statusCode === 200) {
          resolve({headers: res.headers, body})
        } else {
          reject({
            error_message: `Status code ${res.statusCode} for url ${url}`,
            response: res
          })
        }
      })
    }).on('error', function(error) {
      logger.debug(`http_client.get url=${url} error=${error.message}`)
      reject({
        error_message: `Error thrown ${error.message} for url ${url}`,
        error
      })
    })
  })
}

function getWithRetry(url, options = {}) {
  options.attempt = options.attempt || 1
  return get(url, options)
    .catch((result) => {
      if (u.nil(result.status) || isServerError(result.status)) {
        const retry = (options.attempt && options.attempt < parseInt(config.HTTP_RETRIES))
        console.error(`Error in http_client.get: url=${url} attempt=${options.attempt} retry=${retry} options=${JSON.stringify(options)}`, result)
        if (retry) {
          return getWithRetry(url, u.merge(options, {attempt: (options.attempt + 1)}))
        } else {
          return Promise.reject(result)
        }
      } else {
        return Promise.reject(result)
      }
    })
}

module.exports = {
  get: getWithRetry
}
