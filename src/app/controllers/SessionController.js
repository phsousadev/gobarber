import jwt from 'jsonwebtoken'
import User from '../models/User'
import File from '../models/File'

import authConfig from '../../config/auth'

class SessionController {
  async store(request, response) {
    const { email, password } = request.body

    const user = await User.findOne({
      where: {
        email: email
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    })

    if (!user) return response.status(401).json({
      message: 'Email or password are invalid'
    })

    const validPassword = await user.checkPassword(password)

    if (!validPassword) return response.status(401).json({
      message: 'Email or password are invalid'
    })

    const { id, name } = user

    return response.status(200).json({
      user: {
        id,
        name,
        email,
        avatar: user.avatar.url,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })

  }
}

export default new SessionController()