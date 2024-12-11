
export async function get(url: string | null): Promise <any> {
  // generic function to fetch data from a certain url and parse it according to its content type
  let response = null
  let parsedData = null
  const contentTypesParsedWithBlob = ['application/pdf', 'image/png', 'image/jpeg', 'audio/mpeg', 'video/mp4']
  const textContentTypes = ['text/xhtml+xml', 'text/plain', 'text/html', 'text/css']
  try {
    if (!url) throw Error('You are trying to fetch from a url which is not found!')
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
      throw e
   }
  if (parsedData) return parsedData
  return ''
}

export function isError(obj){
  return Object.prototype.toString.call(obj) === '[object Error]'
}