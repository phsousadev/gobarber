import User from "../models/User"

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
  }
}

export default new UserController()