const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })

  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  next(error)
}

const userExtractor = async (request, response, next) => {

    const authorization = request.get('authorization')

    let token
    if (authorization && authorization.startsWith('Bearer ')) {
        token = authorization.replace('Bearer ', '')
    }

    if (!token) {
        return response.status(401).json({error: 'token missing'})
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    request.user = await User.findById(decodedToken.id)
    next()
}

module.exports = {errorHandler, userExtractor}
