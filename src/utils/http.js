import axios from 'axios';
import { i18n } from '@/boot/i18n';

export async function request(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    const errorResponse = err.response;
    if (!errorResponse) {
      throw getError(null, i18n.global.t('failed_to_fetch_url') + ' ' + url);
    }

    if (errorResponse.status !== 200) {
      throw getError(errorResponse.status, errorResponse.message);
    }
  }
}

const cacheRequest = () => {
  const cache = {};
  return async (url) => {
    if (!cache[url]) {
      cache[url] = await request(url);
    }

    return cache[url];
  };
};

export const cachableRequest = cacheRequest();

function getError(code, message) {
  let title = 'server_error';
  if (code === 404) title = 'not_found';
  else if (code === 401) title = 'unauthorized';

  title = i18n.global.t(title);
  return { title, message };
}
