<template>
  <div class="form-page">
    <formContainer :id="$route.params.name" v-bind="selectedForm" />
  </div>
</template>

<script>
import { mapState } from "vuex";

import formContainer from "@/components/formContainer.vue";

export default {
  name: "Form",
  components: {
    formContainer
  },
  fetch() {
    return this.$store.dispatch("getFormData");
  },
  data() {
    return {
      route: null
    };
  },

  computed: {
    ...mapState("site", {
      selectedForm(state) {
        const findForm = (id) => state.formList.find((form) => form.id === id);
        const form = findForm(this.$route.params.name);
        if (form && form.children) {
          return Object.assign({}, form, {
            children: form.children.map(findForm)
          });
        }
        return form;
      }
    })
  }
};
</script>

<style lang="css"></style>
