const mongoose = require('mongoose')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).send(error.message)
  }
  if (error instanceof mongoose.Error.CastError) {
    response.status(404).send(error.message)
  }
  logger.error(error.message)
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}