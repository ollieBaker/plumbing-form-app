import Vue from "vue";
export const EventBus = new Vue();

Vue.prototype.$event = EventBus;
