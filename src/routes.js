import { Router } from "express"

const routes = new Router()

routes.get('/', async (request, response) => {
  return response.status(201).json({
    message: 'Server is running ...'
  })
})

export default routes