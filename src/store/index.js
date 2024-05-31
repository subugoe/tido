import { createStore } from 'vuex';

import annotations from './annotations';
import contents from './contents';

export default createStore({
  modules: {
    annotations,
    contents,
  },
});
