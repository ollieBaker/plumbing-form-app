export const state = () => ({
  formList: [],
  count: 0,
  route: ""
});

export const mutations = {
  updateState(state, { key, value }) {
    state[key] = value;
  }
};

export const actions = {};
