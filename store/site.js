import { formList } from "~/static/storeData.json";
export const state = () => ({
  formList,
  developers: [],
  sites: [],
  plots: [],
  users: [],
  ladders: [],
  siteManagers: [],
  company_gas_safe_number: ""
});

export const mutations = {
  updateState(state, { key, value }) {
    state[key] = value;
  }
};

export const getters = {
  usersWithoutBlocked(state) {
    return state.users.filter((user) => !user.blocked);
  }
};

export const actions = {
  getSiteInfo({ commit, state }) {
    return this.$axios.get("client-plumbing").then(({ data }) => {
      console.log("site info", data);
      // Only add properties that already exist on the state.
      Object.keys(state)
        .filter((key) => data[key])
        .forEach((key) =>
          commit("updateState", {
            key,
            value: data[key]
          })
        );
    });
  },
  getLocationOptions({ commit }) {
    return Promise.all([
      this.$axios.get("developers/?_sort=name:ASC"),
      this.$axios.get("sites/?_sort=name:ASC"),
      this.$axios.get("plots/?_sort=name:ASC")
    ])
      .then((results) => {
        results
          .filter(({ status }) => status === 200)
          .forEach(({ data }, i) => {
            const keys = ["developers", "sites", "plots"];
            commit("updateState", {
              key: keys[i],
              value: data
            });
          });
      })
      .catch((error) => console.warn(error));
  },
  getUsers({ commit }) {
    return this.$axios
      .get("users")
      .then(({ data }) => commit("updateState", { key: "users", value: data }))
      .catch((error) => console.warn(error));
  },
  getLadders({ commit }) {
    return this.$axios
      .get("ladders")
      .then(({ data }) =>
        commit("updateState", { key: "ladders", value: data })
      )
      .catch((error) => console.warn(error));
  },
  getSiteManagers({ commit }) {
    return this.$axios
      .get("site-managers")
      .then(({ data }) =>
        commit("updateState", { key: "siteManagers", value: data })
      )
      .catch((error) => console.warn(error));
  }
};
