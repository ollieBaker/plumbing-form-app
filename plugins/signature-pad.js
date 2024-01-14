import Vue from "vue";
import VueSignaturePad from "vue-signature-pad";

if (process.client) {
  Vue.use(VueSignaturePad);
}
