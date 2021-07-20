async function basicAuth(req, res, next) {
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({ message: 'Missing Authorization Header' })
  }

  const userId = req.headers.authorization.split(' ')[1]
  if (!userId) {
    return res
      .status(401)
      .json({ message: 'Invalid Authentication Credentials' })
  }
  
  req.user = userId

  next()
}

module.exports = basicAuth
