<template>
  <div class="alert-modal">
    <modal
      :show-modal="show"
      :hide-close-btn="true"
      :classes="['alert-modal items-center']"
      @close="$emit('close')"
    >
      <div class="mx-2 space-y-8 flex flex-col justify-center items-center">
        <slot>
          <template v-if="success">
            <h1 class="heading">
              Thank you for your submission
            </h1>
            <nuxt-link class="block mx-auto btn-red" to="/"
              >BACK HOME</nuxt-link
            >
          </template>
          <template v-else>
            <img
              src="~assets/icons/warning-yellow.svg"
              alt=""
              class="bg-grey600 w-24 h-24"
            />
            <h1 class="heading">
              There was a problem with your submission please try again.
            </h1>
            <h2 v-if="message">{{ message }}</h2>
            <button class="block mx-auto btn-red" @click="$emit('close')">
              BACK TO FORM
            </button>
          </template>
        </slot>
      </div>
    </modal>
  </div>
</template>

<script>
import modal from "@/components/partials/modal.vue";

export default {
  name: "AlertModal",
  components: {
    modal
  },
  props: {
    show: Boolean,
    success: Boolean,
    message: { type: String, default: null }
  },
  methods: {}
};
</script>

<style lang="css">
.alert-modal h1.heading {
  @apply text-2xl text-black leading-tight mt-1;
  font-size: 1.7rem;
}
.alert-modal .container {
  min-height: 70vh;
  @apply flex justify-center items-center rounded-none !important;
}
</style>
