<template>
  <div class="commission-input space-y-2 print-inline">
    <!-- Need to be able to clear or reset these values -->
    <formulate-input
      v-model="internalValue"
      type="checkbox"
      :name="`commission_types`"
      :label="title"
      :options="options"
      validation="requires:date"
      :validation-messages="{
        requires: 'Commission type Required'
      }"
    />
    <formulate-input
      type="date"
      :name="`commission_date`"
      :validation="`dateOrEmpty|${internalValue.length ? 'required' : ''}`"
      :validation-messages="{
        required: 'Date Required'
      }"
    />
    <div
      v-for="option in selectedValues"
      :key="option"
      class="space-y-2 avoid-break"
    >
      <h3 class="photo-title">{{ option }} photos</h3>
      <div class="flex space-x-4 justify-between">
        <imageInput
          v-for="type in imageTypes"
          :key="type"
          :existing-image="getExistingImage(option, type)"
          class="full-width centered"
          @imageUploaded="$set(comissionData[option], type, $event.id)"
        >
          {{ `${type.replace("_", " ")}` }}
          <formulate-input
            v-model="comissionData[option][type]"
            type="text"
            :name="`commission_${option}_${type}`"
            validation="required"
            :validation-messages="{ required: 'Photo required' }"
            hidden="true"
          />
        </imageInput>
      </div>
    </div>
  </div>
</template>

<script>
import formElement from "../mixins/formElement";
import imageInput from "@/components/forms/elements/imageInput.vue";

export default {
  name: "Commission",
  components: {
    imageInput
  },
  mixins: [formElement],
  props: {
    title: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({ boiler: "Boiler", cylinder: "Cylinder" })
    }
  },
  data() {
    return {
      internalValue: [],
      comissionData: {
        boiler: {},
        cylinder: {}
      },
      imageTypes: ["benchmark", "serial_number"]
    };
  },
  computed: {
    titleLower() {
      return this.title.toLowerCase().replace(" ", "_");
    },
    selectedValues() {
      // user v-model rather than formdata - use formElement mixin to parse and update commission_types on mount
      // e.g. split string into array or use array;
      return this.internalValue;
    }
  },

  methods: {
    useExistingValues() {
      this.parseArray("commission_types");

      this.internalValue.forEach((option) => {
        this.imageTypes.forEach((type) => {
          const key = `commission_${option}_${type}`;
          const existingValue = this.existingValues[key];
          if (existingValue) {
            this.comissionData[option][type] = existingValue;
          }
        });
      });
    },
    getExistingImage(option, type) {
      const value = this.comissionData[option][type];
      if (value && value.id) {
        return value;
      }
    }
  }
};
</script>

<style lang="css" scoped>
>>> .image-input h2 {
  @apply text-sm;
}
>>> .image-input li.formulate-input-error {
  @apply font-normal;
}

.commission-input
  > div[data-classification="group"]
  .formulate-input-wrapper
  > label {
  /* @apply mb-4; */
}
.formulate-input-group-item .formulate-input-wrapper {
  @apply flex flex-row items-center;
}

.commission-input .formulate-input-group {
  @apply my-1;
}

.photo-title {
  @apply font-bold capitalize;
}

.formulate-input-group-item
  .formulate-input-wrapper
  .formulate-input-label.formulate-input-label--after {
  @apply font-normal pr-2;
}

>>> .loading-indicator {
  @apply flex items-center;
}
</style>
