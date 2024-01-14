<template>
  <div class="levelWithDate px-8">
    <formInput :name="`${titleLower}_level`" :values="existingValues">
      <formulate-input
        v-model="internalValue"
        type="checkbox"
        :name="`${titleLower}_level`"
        :label="title"
        :options="options"
        validation="requires:date"
        :validation-messages="{
          requires: 'Level Required'
        }"
      />
    </formInput>
    <formInput :name="`${titleLower}_date`" :values="existingValues">
      <formulate-input
        type="date"
        :name="`${titleLower}_date`"
        validation="dateOrEmpty|requires:level"
        :validation-messages="{
          requires: 'Date Required'
        }"
      />
    </formInput>
  </div>
</template>

<script>
import formElement from "../mixins/formElement";

export default {
  name: "LevelWithDate",

  mixins: [formElement],

  props: {
    title: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({ high: "High Level", low: "Low level" })
    }
  },
  data() {
    return {
      internalValue: []
    };
  },
  computed: {
    titleLower() {
      return this.title.toLowerCase().replace(" ", "_");
    }
  },
  methods: {
    useExistingValues() {
      const key = `${this.titleLower}_level`;
      this.parseArray(key);
    }
  }
};
</script>

<style lang="css">
.levelWithDate
  > div[data-classification="group"]
  .formulate-input-wrapper
  > label {
  /* @apply mb-4; */
}
.formulate-input-group-item .formulate-input-wrapper {
  @apply flex flex-row items-center;
}

.levelWithDate .formulate-input-group {
  @apply my-1;
}

.formulate-input-group-item
  .formulate-input-wrapper
  .formulate-input-label.formulate-input-label--after {
  @apply font-normal pr-2;
}
</style>
