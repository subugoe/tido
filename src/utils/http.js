import { i18n } from '@/i18n';

export async function request(url) {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('Content-Type');

    if (contentType.includes('application/json')) {
      return await response.json();
    } if (contentType.includes('text')) {
      return response.text();
    }
  } catch ({ response }) {
    if (!response) {
      throw getError(null, `${i18n.global.t('failed_to_fetch_url')} ${url}`);
    }

    if (response.status !== 200) {
      throw getError(response.status, response.message);
    }
  }
  return null;
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
  let title = i18n.global.t('server_error');
  if (code === 404) title = i18n.global.t('not_found');
  else if (code === 401) title = i18n.global.t('unauthorized');

  title = i18n.global.t(title);
  return { title, message };
}
