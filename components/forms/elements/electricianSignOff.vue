<template>
  <div class="electricians-sign-off sign-off space-y-4">
    <h2 class="title no-print">SIGN OFF</h2>
    <slot></slot>
    <div class="px-8 flex flex-col flex-no-wrap w-full space-y-4">
      <formulate-input
        v-model="electricians_name"
        type="text"
        name="electricians_name"
        label="Electrians Name"
        validation="required"
      />

      <signatureInput
        :name="electricians_name"
        :existing-image="existingValues.electricians_signature"
        @signatureUploaded="onSignatureUploaded"
        ><span class="font-bold text-lg"
          >Electrians Signature</span
        ></signatureInput
      >

      <formulate-input
        v-model="signatureId"
        type="text"
        name="electricians_signature"
        hidden="true"
        validation="required"
        :validation-messages="{
          required: 'The Electrician must sign off form before submitting'
        }"
      />

      <formulate-input
        type="date"
        name="sign_date"
        label="Date"
        validation="required|date"
      />
    </div>
  </div>
</template>

<script>
import formElement from "../mixins/formElement";
import signatureInput from "./signatureInput.vue";
export default {
  name: "ElectriciansSignOff",
  components: {
    signatureInput
  },
  mixins: [formElement],
  data() {
    return {
      electricians_name: "",
      signatureId: null
    };
  },

  methods: {
    onSignatureUploaded(upload) {
      console.log(upload);
      this.signatureId = upload.id;
    }
  }
};
</script>

<style lang="scss"></style>
