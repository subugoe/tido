import { TFunction, TOptions } from 'i18next'

// Title and message are translation keys (or plain text), translated where the error is displayed
// with the i18n instance of the TIDO instance it belongs to. options holds their interpolation values.
class CustomError extends Error {
  options?: TOptions

  constructor(title: string, message: string, options?: TOptions) {
    super(message)
    this.name = title
    this.options = options
  }
}

// Plain text is returned as is. nsSeparator is off, so that a ':' in it (e.g. in a URL) is not
// read as a namespace.
function translateError(error: Error, t: TFunction) {
  const options = { ...(error as CustomError).options, nsSeparator: false } as TOptions
  return {
    title: error.name ? t(error.name, options) as string : error.name,
    message: error.message ? t(error.message, options) as string : error.message
  }
}

// Logs the error with its title and message translated, followed by the error itself for its stack
function logError(error: unknown, t: TFunction) {
  if (!(error instanceof Error)) {
    console.error(error)
    return
  }
  const { title, message } = translateError(error, t)
  console.error(title ? `${title}: ${message}` : message, error)
}

export {
  CustomError,
  translateError,
  logError
}
