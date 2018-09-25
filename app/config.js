const u = require('app/util')

const defaultConfig = {
  PORT: 3000,
  LOG_LEVEL: 'debug',
  CACHE_EXPIRY: '3600',
  API_BASE_URL: 'https://api.versioned.io/v1/data/5ba205c2aefdde0013596636',
  API_KEY: null
}
const envConfig = u.pick(Object.keys(defaultConfig), process.env)
const config = u.merge(defaultConfig, envConfig)

module.exports = config
