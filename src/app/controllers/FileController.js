class FileController {
  async store(request, response) {
    return response.status(201).send()
  }
}

export default new FileController()