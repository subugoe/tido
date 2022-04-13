export async function request(url, responsetype = 'json') {
  const response = await fetch(url);
  const data = await (responsetype === 'text'
    ? response.text()
    : response.json());

  return data;
}

const cacheRequest = () => {
  const cache = {};
  return async (url, responseType = 'json') => {
    if (!cache[url]) {
      const response = await request(url, responseType);
      cache[url] = response;
    }

    return cache[url];
  };
};

export const cachableRequest = cacheRequest();
