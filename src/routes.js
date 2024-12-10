import { Router } from "express"

import multer from 'multer'
import multerConfig from './config/multer'

/**
 * Controllers
 */
import UserController from "./app/controllers/UserController"
import SessionController from "./app/controllers/SessionController"
import FileController from "./app/controllers/FileController"

/**
 * Middlewares
 */
import authMiddleware from './app/middlewares/auth'

/**
 * Routes configs
 */
const routes = new Router()
const upload = multer(multerConfig)

/**
 * Routes
 * => Users
 */
routes.post('/users', UserController.store)

/**
 * Routes
 * => Sessions
 */
routes.post('/sessions', SessionController.store)

/**
 * Alert
 * Routes below this function require the user to be authenticated
 */
routes.use(authMiddleware)


/**
 * Routes
 * => Users
 * ==> Authenticated
 */
routes.put('/users', UserController.update)

/**
 * Routes
 * => Files
 */
routes.post('/files', upload.single('file'), FileController.store)

export default routes