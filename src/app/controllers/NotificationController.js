import User from '../models/User'
import Notification from '../schemas/Notification'

class NotificationController {
  async list(request, response) {
    const checkUserProvider = await User.findOne({
      where: {
        id: request.userId,
        provider: true
      }
    })

    if (!checkUserProvider) return response.status(401).json({
      message: 'User is not provider'
    })

    const notifications = await Notification.find({
      user: request.userId
    })
      .sort({
        createdAt: 'desc'
      })
      .limit(20)

    return response.status(200).json(notifications)
  }
}

export default new NotificationController()