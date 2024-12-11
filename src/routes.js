import { Router } from "express"

import multer from 'multer'
import multerConfig from './config/multer'

/**
 * Controllers
 */
import UserController from "./app/controllers/UserController"
import SessionController from "./app/controllers/SessionController"
import FileController from "./app/controllers/FileController"
import ProviderController from "./app/controllers/ProviderController"
import AppointmentController from "./app/controllers/AppointmentController"
import SchedulesController from './app/controllers/ScheduleController'

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
 * => Providers
 */
routes.get('/providers', ProviderController.list)

/**
 * Routes
 * => Sessions
 */
routes.post('/sessions', SessionController.store)

/**
 * ==========> Alert <==========
 * Routes below this function require the user to be authenticated
 */
routes.use(authMiddleware)

/**
 * Routes
 * => Schedules
 * ==> Authenticated
 */
routes.get('/schedules', SchedulesController.list)

/**
 * Routes
 * => Appointments
 * ==> Authenticated
 */
routes.post('/appointments', AppointmentController.store)
routes.get('/appointments', AppointmentController.list)
routes.delete('/appointments/:id', AppointmentController.delete)

/**
 * Routes
 * => Users
 * ==> Authenticated
 */
routes.put('/users', UserController.update)

/**
 * Routes
 * => Files
 * ==> Authenticated
 */
routes.post('/files', upload.single('file'), FileController.store)

export default routes