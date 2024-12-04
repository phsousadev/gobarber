import * as Yup from 'yup'

import User from '../models/User'

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required().min(6)
    })

    if (!(await schema.isValid(request.body))) return response.status(400).json({
      message: 'Validation fails'
    })

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
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    })

    if (!(await schema.isValid(request.body))) return response.status(400).json({
      message: 'Validation fails'
    })

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

    // const passwordEncrypt = await bcrypt.hash(password, 8)

    const { id, name, provider } = await user.update(request.body)

    return response.status(200).json({
      id,
      name,
      email,
      provider
    })
  }
}

export default new UserController()