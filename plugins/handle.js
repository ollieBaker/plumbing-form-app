import Vue from "vue";

Vue.prototype.$handle = (promise) => {
  return promise
    .then((data) => [data, undefined])
    .catch((error) => Promise.resolve([undefined, error]));
};
