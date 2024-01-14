import Vue from "vue";
import VueFormulate from "@braid/vue-formulate";

const valueIsValid = (value) => {
  return value && Array.isArray(value) ? value.length : value;
};

Vue.use(VueFormulate, {
  rules: {
    dateOrEmpty: ({ value }) => {
      return value === "" || Date.parse(value);
    },
    requires: ({ value, getFormValues, name }, dependentField) => {
      return Promise.resolve(
        (() => {
          const formValues = getFormValues();
          const prefix = name
            .split("_")
            .filter((el, i, arr) => i < arr.length - 1)
            .join("_");
          const dependentValue = formValues[prefix + "_" + dependentField];
          const dependentValueIsValid = valueIsValid(dependentValue);
          const valueisInvalid = !valueIsValid(value);
          if (dependentValueIsValid && valueisInvalid) {
            return false;
          }
          return true;
        })()
      );
    }
  }
});
