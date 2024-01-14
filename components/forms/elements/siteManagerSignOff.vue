<template>
  <div
    class="site-manager-sign-off sign-off space-y-4 print-inline avoid-break"
  >
    <h2 class="title no-print">SIGN OFF</h2>
    <div class="px-8 flex flex-col flex-no-wrap w-full space-y-4">
      <formulate-input
        type="text"
        name="site_manager_name"
        label="Site Managers Name"
        validation="required"
        @input="name = $event"
      />
      <formulate-input
        type="date"
        name="sign_date"
        label="Date"
        validation="required|date"
      />

      <signatureInput
        :name="name"
        :existing-image="existingValues.site_manager_signature"
        @signatureUploaded="onSignatureUploaded"
      >
        <h2 class="font-bold text-lg">Site Managers Signature</h2>
      </signatureInput>
      <formulate-input
        v-model="signatureId"
        type="text"
        name="site_manager_signature"
        hidden="true"
        validation="required"
        :validation-messages="{
          required: 'Site Manager must sign off form before submitting'
        }"
      />
    </div>
  </div>
</template>

<script>
import formElement from "../mixins/formElement";
import signatureInput from "./signatureInput.vue";
export default {
  name: "SiteManagerSignOff",
  components: {
    signatureInput
  },
  mixins: [formElement],
  data() {
    return {
      name: "",
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
