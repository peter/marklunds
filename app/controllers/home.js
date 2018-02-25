function list(req, res) {
  res.writeHead(301, {Location: '/peter'})
  res.end()
}

module.exports = {
  list
}
