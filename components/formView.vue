<template>
  <div class="form-view">
    <formHeader :title="title" />
    <FormulateForm
      v-model="formValues"
      :name="componentName"
      class="w-full mx-auto max-w-screen-sm flex-1 flex flex-col content-center space-y-6 pt-8"
      @submit-raw="checkForm"
    >
      <component
        :is="componentName"
        :values="formValues"
        :can-submit="canSubmit"
        @showChild="$emit('showChild', $event)"
        @hideChild="$emit('hideChild', $event)"
        @cancelChild="$emit('cancelChild', $event)"
        @activateChild="$emit('activateChild', $event)"
        @deactivateChild="$emit('deactivateChild', $event)"
        @complete="$emit('complete', $event)"
        @error="onError"
      >
        <template v-slot:submit-button>
          <formulate-input
            type="submit"
            name="submit"
            label="Submit"
            :disabled="!canSubmit"
          />
        </template>
      </component>
    </FormulateForm>

    <alertModal
      :show="showAlertModal"
      :message="alertMessage"
      :success="submitSuccess"
      @close="toggleAlertModal"
    />
  </div>
</template>

<script>
import { removeNullValues } from "@/functions/helpers.js";
import qualityControlInspection from "@/components/forms/qualityControlInspection.vue";
import preOccupation from "@/components/forms/preOccupation.vue";
import workplaceSafetyInspection from "@/components/forms/workplaceSafetyInspection.vue";
import heatingControlsHandover from "@/components/forms/heatingControlsHandover.vue";
import toolboxTalk from "@/components/forms/toolboxTalk.vue";
import ladderList from "@/components/forms/ladderList.vue";
import testForm from "@/components/forms/testForm.vue";
import formHeader from "@/components/forms/elements/formHeader.vue";
import alertModal from "@/components/modals/alertModal.vue";

export default {
  name: "FormView",
  components: {
    qualityControlInspection,
    preOccupation,
    workplaceSafetyInspection,
    heatingControlsHandover,
    toolboxTalk,
    ladderList,
    testForm,
    formHeader,
    alertModal
  },
  props: {
    canSubmit: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      required: true
    },
    componentName: {
      type: String,
      required: true
    },
    existingValues: {
      type: Object,
      default: () => {}
    },
    completeChildren: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isDebug: false,
      formValues: {
        signature: this.$store.state.auth.user.signature
      },
      submitSuccess: false,
      showAlertModal: false,
      alertMessage: null
    };
  },
  watch: {
    existingValues(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.mergeExistingValues();
      }
    }
  },
  mounted() {
    if (this.existingValues) {
      this.mergeExistingValues();
    }
    if (this.isDebug) {
      const debugData = require(`@/debug/${this.componentName}.js`).default;
      this.formValues = Object.assign({}, this.formValues, debugData);
    }
  },
  methods: {
    mergeExistingValues() {
      console.log("merging existing values");
      this.formValues = Object.assign({}, this.formValues, this.existingValues);
    },
    checkForm(formSubmission) {
      if (!this.canSubmit) return;
      const { registry } = formSubmission.form;
      const fields = Object.keys(registry)
        .map((key) => registry[key])
        .filter((child) => child.performValidation)
        .map((input) => input.performValidation());

      Promise.all(fields).then(() => {
        formSubmission.hasValidationErrors().then((hasErrors) => {
          if (hasErrors) {
            this.$nextTick(() => {
              const firstError = document.querySelector(
                ".formulate-input-error"
              );
              console.log(firstError);
              if (firstError) {
                firstError.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                });
              }
            });

            return;
          }
          formSubmission
            .values()
            .then((values) =>
              this.submitForm(values, formSubmission.form.name)
            );
        });
      });
    },
    async submitForm(data, formName) {
      console.log(data, this.formValues, formName);
      const { api } = this.$store.state.site.formList.find(
        (form) => form.componentName === formName
      );

      const fieldName = api.replace(/-/g, "_").slice(0, api.length - 1);

      const childFormIds = this.getChildFormIds();
      const cleanData = removeNullValues(this.formValues);

      const mergedData = Object.assign(
        {},
        cleanData,
        {
          user: this.$store.state.auth.user.id,
          company_gas_safe_number: `${this.$store.state.site.company_gas_safe_number}`,
          gasNumber: `${this.$store.state.auth.user.gasNumber}`,
          values: cleanData
        },
        childFormIds
      );

      const [result, error] = await this.$handle(
        this.$axios.post(api, mergedData)
      );

      if (error) {
        console.log(error);
        this.toggleAlertModal(false);
      }

      if (result) {
        console.log(result);
        if (formName !== "preOccupation") this.toggleAlertModal(true);
        this.$emit("complete", { formName, fieldName, data: result.data });
      }
    },
    getChildFormIds() {
      const ids = {};
      if (!this.completeChildren) return ids;

      Object.keys(this.completeChildren).forEach((key) => {
        const apiFormName = key.replace(/-/g, "_");
        ids[apiFormName] = this.completeChildren[key].id;
      });
      return ids;
    },
    toggleAlertModal(success, message) {
      this.submitSuccess = success;
      this.showAlertModal = !this.showAlertModal;
      this.alertMessage = message;
    },
    onError({ message }) {
      console.log(message);
      this.toggleAlertModal(false, message);
    }
  }
};
</script>

<style lang="scss"></style>
