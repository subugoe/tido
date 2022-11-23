import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';

import annotations from './annotations';
import config from './config';
import contents from './contents';

export default store((/* { ssrContext } */) => {
  const Store = createStore({
    modules: {
      annotations,
      config,
      contents,
    },
  });

  return Store;
});
