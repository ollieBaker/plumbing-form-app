import locationSelect from "../elements/locationSelect.vue";
import siteManagerSignOff from "../elements/siteManagerSignOff.vue";
import userSignOff from "../elements/userSignOff.vue";

export default {
  components: {
    siteManagerSignOff,
    locationSelect,
    userSignOff
  },
  props: {
    values: {
      type: Object,
      required: true
    }
  }
};
