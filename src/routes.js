import { Router } from "express"

import UserController from "./app/controllers/UserController"

const routes = new Router()

routes.post('/users', UserController.store)

routes.get('/', async (request, response) => {
  return response.status(201).json({
    message: 'Server is running ...'
  })
})

export default routes