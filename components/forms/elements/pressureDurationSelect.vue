<template>
  <div class="pressure-duration-select px-8 space-y-2">
    <formInput :name="titleLowerCase + '_pressure'" :values="existingValues">
      <h2 class="text-red font-bold text-xl">
        <slot>{{ title }}</slot>
      </h2>

      <div class="flex flex-row space-x-4">
        <formulate-input
          v-model="pressure"
          :class="[titleLowerCase, pressure ? 'pressure' : '']"
          type="number"
          placeholder="- select -"
          :name="titleLowerCase + '_pressure'"
          label="Pressure:"
          validation="number|requires:duration"
          step=".01"
          :validation-messages="{
            requires: `${title} Pressure cannot be blank`
          }"
        />
        <formulate-input
          v-model="duration"
          :class="[duration ? 'duration' : '']"
          type="number"
          placeholder="- select -"
          :name="titleLowerCase + '_duration'"
          label="Duration:"
          step=".01"
          :validation="'number|requires:pressure'"
          :validation-messages="{
            requires: `${title} Duration cannot be blank`
          }"
        />
        <!-- </formInput> -->
      </div>
      <imageInput
        :existing-image="existingValues[titleLowerCase + '_photo']"
        @imageUploaded="photo = $event.id"
      >
        Upload Image
        <formulate-input
          v-model="photo"
          type="text"
          class="formulate-hidden"
          :name="titleLowerCase + '_photo'"
          hidden="true"
        />
      </imageInput>
    </formInput>
  </div>
</template>

<script>
import formElement from "../mixins/formElement";
import imageInput from "@/components/forms/elements/imageInput.vue";

export default {
  name: "PressureDurationSelect",
  components: {
    imageInput
  },
  mixins: [formElement],
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      photo: null,
      pressure: null,
      duration: null
    };
  },
  computed: {
    titleLowerCase() {
      return this.title.toLowerCase().replace(/ /g, "_");
    }
  },
  created() {
    const title = this.title.toLowerCase().replace(/ /g, "_");
    const keys = ["photo", "pressure", "duration"];
    this.responseKeys = keys.map((key) => `${title}_${key}`);
  }
};
</script>

<style lang="css">
.pressure .formulate-input-element--number {
  position: relative;
}
.pressure .formulate-input-element--number::after {
  content: "mbar";
  display: block;
  height: inherit;
  position: absolute;
  padding: inherit;
  height: 100%;
  padding: 0.5rem 0.5rem;
  top: 0;
  right: 0;
}

.pressure.pipework .formulate-input-element--number::after {
  content: "bar";
}
.duration .formulate-input-element--number {
  position: relative;
}
.duration .formulate-input-element--number::after {
  content: "min";
  display: block;
  height: inherit;
  position: absolute;
  padding: inherit;
  height: 100%;
  padding: 0.5rem 0.5rem;
  top: 0;
  right: 0;
}

.pressure-duration-select input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
