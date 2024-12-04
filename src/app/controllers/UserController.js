import User from "../models/User"
import bcrypt from 'bcrypt'

class UserController {
  async store(request, response) {
    const { name, email, password } = request.body

    const emailAlreadyExists = await User.findOne({
      where: {
        email: email
      }
    })

    if (emailAlreadyExists) return response.status(401).json({
      message: 'User already exists'
    })

    await User.create({
      name,
      email,
      password: password
    })

    return response.status(201).send()

  }

  async update(request, response) {
    const { old_password, email, password } = request.body

    const user = await User.findByPk(request.userId)

    if (email !== user.email) {
      const emailAlreadyExists = await User.findOne({ where: { email } })

      if (emailAlreadyExists) return response.status(401).json({
        message: 'Unable to update email as it already exists'
      })
    }

    if (old_password && !(await user.checkPassword(old_password)))
      return response.status(401).json({
        message: "Unable to update user"
      })

    const passwordEncrypt = await bcrypt.hash(password, 8)

    const { id, name, provider } = await user.update({
      ...user,
      password_hash: passwordEncrypt
    })

    return response.status(200).json({
      id,
      name,
      email,
      provider
    })
  }
}

export default new UserController()