
export async function get(url: string): Promise<Manifest | Collection | null> {
  let response: Manifest | Collection | null = null
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
      return null
  }
  return response
}
