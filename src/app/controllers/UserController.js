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
    const { name, old_password, new_password } = request.body

    const user = await User.findOne({
      where: {
        id: request.userId
      }
    })

    if (old_password && new_password) {
      const oldPasswordIsValid = await user.checkPassword(old_password)

      if (oldPasswordIsValid) {
        const passwordEncrypt = await bcrypt.hash(new_password, 8)

        await user.update({
          name,
          password_hash: passwordEncrypt
        })

        await user.save()

        return response.status(200).send()
      }

      return response.status(401).json({
        message: "Unable to update user"
      })
    }

    await user.update({
      name,
    })

    return response.status(200).send()
  }
}

export default new UserController()