import * as Yup from 'yup'
import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'
import User from '../models/User'
import File from '../models/File'
import Appointment from '../models/Appointments'

class ScheduleController {
  async list(request, response) {
    const { page, date } = request.query

    const checkUserProvider = await User.findOne({
      where: {
        id: request.userId,
        provider: true
      }
    })

    if (!checkUserProvider) return response.status(401).json({
      message: 'User is not provider'
    })

    const parsedDate = parseISO(date)

    const appointments = await Appointment.findAll({
      where: {
        provider_id: request.userId,
        canceled_at: null,
        /**
         * Only returns appointments within 24 hours,
         * using the date sent by the user
         */
        date: {
          [Op.between]: [
            startOfDay(parsedDate),
            endOfDay(parsedDate)
          ]
        }
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url', 'path']
            }
          ]
        }
      ]
    })

    return response.status(200).json({ appointments })
  }
}

export default new ScheduleController()