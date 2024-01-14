<template>
  <div class="user-sign-off px-8 space-y-4 pb-8 print-inline">
    <p v-if="!hideMessage" class="text-gray-500">
      These works have been carried out according to the remit of Works detail
    </p>
    <p>JPHC Operative</p>
    <div class="signature">
      <img v-if="existingValues" :src="signatureURL" alt="Users Signature" />
      <img
        v-else
        :src="$store.getters['user/signatureUrl']"
        alt="Users Signature"
      />
    </div>
    <p>
      {{ name }}
    </p>
    <slot> </slot>
  </div>
</template>

<script>
import { createImageURL } from "@/functions/helpers.js";

export default {
  name: "UserSignOff",
  props: {
    hideMessage: {
      type: Boolean
    },
    existingValues: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      existingSignature: null
    };
  },
  computed: {
    name() {
      const { firstName, lastName } =
        (this.existingValues && this.existingValues.user) ||
        this.$store.state.auth.user;
      return `${firstName} ${lastName}`;
    },
    signatureURL() {
      return this.existingSignature && createImageURL(this.existingSignature);
    }
  },
  watch: {
    existingValues: {
      immediate: true,
      handler({ signature }) {
        const id = signature.id ? signature.id : signature;
        this.$axios.get(`signatures/${id}`).then(({ data }) => {
          this.existingSignature = data.signature;
        });
      }
    }
  }
};
</script>

<style lang="scss"></style>
