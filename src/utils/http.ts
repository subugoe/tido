const BLOB_CONTENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'audio/mpeg', 'video/mp4']
const TEXT_CONTENT_TYPES = ['text/xhtml+xml', 'text/plain', 'text/html', 'text/css']

export async function request<T>(url: string): Promise<HttpResponse<T>> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return createErrorResponse(
        'Error while loading data from this url ' + url,
        response.status
      )
    }

    const contentType = response.headers.get('Content-Type')
    let data
    if (!contentType || TEXT_CONTENT_TYPES.some(type => contentType.includes(type))) {
      data = await response.text()
    } else if (contentType.includes('application/json')) {
      data = await response.json()
    } else if (BLOB_CONTENT_TYPES.some(type => contentType.includes(type))) {
      data = await response.blob()
    }

    return {
      success: true,
      data
    }
  } catch (error) {
    return createErrorResponse(
      (error instanceof Error) ? error.message : 'An unexpected error occurred',
      500,
    )
  }
}

function createErrorResponse(message: string = '', code: number = 500): ErrorResponse {
  return {
    success: false,
    message,
    code,
  }
}

