<template>
  <div class="form-input" :class="classes">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "FormInput",
  props: {
    values: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    valueIsValid() {
      const value = this.values[this.name];
      return value && Array.isArray(value) ? value.length : value;
    },
    classes() {
      return this.valueIsValid ? "" : ["empty", "no-print"];
    }
  }
};
</script>

<style lang="css">
.form-input.empty {
}
</style>
