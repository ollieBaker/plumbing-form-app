<template>
  <div class="test-form">
    <div class="child-form">
      <slot></slot>
    </div>
    <pressureDurationSelect title="Gas" />
    <levelWithDate title="Down Pipes" />
    <formulate-input type="submit" name="submit" label="Submit" />
  </div>
</template>

<script>
import pressureDurationSelect from "./elements/pressureDurationSelect.vue";
import levelWithDate from "./elements/levelWithDate.vue";
export default {
  name: "TestForm",
  components: {
    pressureDurationSelect,
    levelWithDate
  }
};
</script>

<style lang="scss"></style>
