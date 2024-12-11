import * as Yup from 'yup'
import { startOfHour, parseISO, isBefore } from 'date-fns'
import Appointment from '../models/Appointments'
import User from '../models/User'

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
}

export default new AppointmentController()