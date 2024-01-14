import { createImageURL } from "@/functions/helpers.js";
export const state = () => ({
  signature: null,
  ladderList: []
});

export const getters = {
  name(state, getters, { auth: { user } }) {
    if (!user) return;

    const { firstName, lastName } = user;
    return `${firstName} ${lastName}`;
  },
  signatureUrl(state) {
    return createImageURL(state.signature);
  },
  oldLadders(state) {
    return state.ladderList.filter((ladder) => {
      const month = 1000 * 60 * 60 * 24 * 28;
      const now = new Date();
      const ladderCheck = new Date(ladder.date);
      const a = new Date(now.toUTCString());
      const b = new Date(ladderCheck.toUTCString());
      const dif = Math.abs(b - a);
      return dif > month;
    });
  }
};

export const mutations = {
  updateSignature(state, value) {
    state.signature = value;
  },
  updateLadderList(state, { items }) {
    state.ladderList = items;
  }
};

export const actions = {
  getSignature({ commit }, id) {
    return this.$axios
      .get(`signatures/${id}`)
      .then(({ data }) => {
        const signature = data.signature;
        if (signature) {
          return commit("updateSignature", signature);
        }
        return "no-signature";
      })
      .catch((e) => console.log(e));
  }
  // getLadderList({ commit, rootState }) {
  //   return this.$axios
  //     .get(`ladder-list-forms?user=${rootState.auth.user.id}`)
  //     .then(({ data }) => commit("updateLadderList", data))
  //     .catch((e) => console.log(e));
  // }
};
