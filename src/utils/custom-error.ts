class CustomError extends Error {
  constructor(title, message) {
    super(message)
    this.name = title
  }
}

export {
  CustomError
}
