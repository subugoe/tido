export const loadConfig = ({ commit }) => {
  commit('loadConfig', JSON.parse(document.getElementById('tido-config').text));
};

export const resetInitialized = ({ commit }) => {
  commit('resetInitialized');
};

export const updateInitialized = ({ commit }, { initialized }) => {
  commit('updateInitialized', { initialized });
};
