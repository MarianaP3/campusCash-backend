class IdDoesntExistError extends Error {
  constructor (message) {
    super(message)
    this.name = 'IdDoesntExistError'
  }
}

module.exports = IdDoesntExistError
