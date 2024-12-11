
export async function get<T>(url: string): Promise <T> {
  // generic function to fetch data from a certain url and parse it according to its content type
  let response = null
  let parsedData = null
  const contentTypesParsedWithBlob = ['application/pdf', 'image/png', 'image/jpeg', 'audio/mpeg', 'video/mp4']
  const textContentTypes = ['text/plain', 'text/html', 'text/css']
  try {
    response = await fetch(url)
    if (!response.ok) {
      throw Error('Error while loading data from this url '+ url)
    }
    const responseContentType = response.headers.get('content-type')
    if (responseContentType?.includes('application/json')) {
      parsedData = await response.json()
    }
    else if (textContentTypes.some(el => responseContentType?.includes(el))) {
      parsedData = await response.text()
    }
    else if (contentTypesParsedWithBlob.some(el => responseContentType?.includes(el))) {
      parsedData = await response.blob()
    }
  } catch (e) {
      return e
   }
  if (parsedData) return parsedData
  return '' // the data could not be parsed according to the defined content formats
}

export function isError(obj){
  return Object.prototype.toString.call(obj) === '[object Error]'
}