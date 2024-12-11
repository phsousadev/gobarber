import express, { response } from 'express'
import 'express-async-errors'
import routes from './routes'
import path, { dirname } from 'node:path'
import * as Sentry from '@sentry/node'

import Youch from 'youch'

import sentryConfig from './config/sentry'

import './database'
import { request } from 'node:http'
class App {
  constructor() {
    this.server = express()

    Sentry.init(sentryConfig)

    this.apm()
    this.middlewares()
    this.routes()
    this.exceptionHandler()
  }

  middlewares() {
    this.server.use(express.json())
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
  }

  routes() {
    this.server.use(routes)
  }

  apm() {
    Sentry.setupExpressErrorHandler(this.server)
  }

  exceptionHandler() {
    this.server.use(async (err, request, response, next) => {
      const errors = await new Youch(err, request).toJSON()

      return response.status(500).json(errors)
    })
  }
}

export default new App().server