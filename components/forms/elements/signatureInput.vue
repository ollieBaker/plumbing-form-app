<template>
  <div class="signature-input w-full items-center">
    <slot><h2></h2></slot>
    <div
      class="border-black border h-32 flex justify-center items-center rounded-md"
    >
      <img
        v-if="thumbnail"
        :src="signatureURL"
        alt="Site Managers Signature"
        class="max-h-full"
      />
      <button v-else type="button" @click="toggleSignatureModal">
        Click Here to Sign
      </button>
    </div>
    <genericSignatureModal
      :show="showSignatureModal"
      :file-name="name"
      @close="toggleSignatureModal"
      @signatureUploaded="onSignatureUploaded"
    />
  </div>
</template>

<script>
import { createImageURL } from "@/functions/helpers.js";
import genericSignatureModal from "@/components/modals/genericSignatureModal.vue";

export default {
  name: "SignatureInput",
  components: {
    genericSignatureModal
  },
  props: {
    name: {
      type: String,
      default: ""
    },
    existingImage: {
      type: [Object, Number],
      default: null
    }
  },
  data() {
    return {
      showSignatureModal: false,
      signature: null
    };
  },
  computed: {
    thumbnail() {
      return this.signature || this.existingImage;
    },
    signatureURL() {
      return createImageURL(this.thumbnail);
    }
  },
  methods: {
    toggleSignatureModal() {
      this.showSignatureModal = !this.showSignatureModal;
    },
    onSignatureUploaded(e) {
      const upload = e[0];

      this.signature = upload;

      this.$emit("signatureUploaded", upload);
    }
  }
};
</script>

<style lang="css" scoped></style>
