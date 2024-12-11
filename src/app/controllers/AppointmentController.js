import { startOfHour, parseISO, isBefore } from 'date-fns'

import * as Yup from 'yup'

import Appointment from '../models/Appointments'
import User from '../models/User'
import File from '../models/File'

class AppointmentController {
  async store(request, response) {

    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    })

    if (!await schema.isValid(request.body)) return response.status(200).json({
      message: 'Validation fails'
    })

    const { provider_id, date } = request.body
    const { userId } = request

    /**
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: {
        id: provider_id, provider: true
      }
    })

    if (!isProvider) return response.status(401).json({
      message: 'User is not provider'
    })

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date))

    if (isBefore(hourStart, new Date())) {
      return response.status(400).json({
        message: 'Past dates are not permitted'
      })
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    })

    if (checkAvailability) return response.status(401).json({
      message: 'Appointment date is not availability'
    })

    const appointment = await Appointment.create({
      user_id: userId,
      provider_id,
      date: hourStart
    })

    return response.status(201).json({
      appointment
    })
  }

  async list(request, response) {
    const { userId } = request
    const { page = 1 } = request.query

    const appointments = await Appointment.findAll({
      where: {
        user_id: userId,
        canceled_at: null
      },
      attributes: ['id', 'date'],
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
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

    return response.status(200).json({
      appointments
    })
  }
}

export default new AppointmentController()