import File from '../models/File'
import User from '../models/User'

class FileController {
  async store(request, response) {
    const { userId } = request
    const { originalname: name, filename: path } = request.file

    const { id: fileId } = await File.create({
      name,
      path
    })

    await User.update(
      {
        avatar_id: fileId
      },
      {
        where: {
          id: userId
        }
      }
    )

    return response.status(201).send()
  }
}

export default new FileController()