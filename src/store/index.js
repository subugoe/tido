import { createStore } from 'vuex';

import annotations from './annotations';
import config from './config';
import contents from './contents';

export default createStore({
  modules: {
    annotations,
    config,
    contents,
  },
});
