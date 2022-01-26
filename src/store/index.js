import Vue from 'vue';
import Vuex from 'vuex';

import annotations from './annotations';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function TidoStore(/* { ssrContext } */) {
  const store = new Vuex.Store({
    modules: {
      annotations,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return store;
}
