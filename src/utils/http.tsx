interface ErrorInterface {
  error: string
}

export async function get(url: string): Promise<ErrorInterface | Manifest | Collection> {
  let response = {}
  try {
    const apiData = await fetch(url);
    if (!apiData.ok) {
      throw Error('Error while loading document data of this url '+ url)
    }
    if (!apiData.headers.get('content-type')?.includes('application/json')) {
      throw Error('Response from reading this document (collection/manifest) is not a json object')
    }
    await apiData.json().then((value) => {
      response = { ...value }
     }
    )

  } catch (e) {
      response['error'] = e.message
  }
  console.log('response', response)
  return response

}
