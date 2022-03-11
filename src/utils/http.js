export async function request(url, responsetype = 'json') {
  const response = await fetch(url);
  const data = await (responsetype === 'text'
    ? response.text()
    : response.json());

  return data;
}
