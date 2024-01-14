<template>
  <div class="signature-modal">
    <modal
      :show-modal="show"
      :hide-close-btn="!currentSignature"
      :classes="['items-center']"
      @close="onClose"
    >
      <div class="space-y-2">
        <div
          v-if="currentSignature"
          class="current-sig-container p-2 space-y-2 flex flex-col items-center mx-16"
        >
          <div class="w-auto">Current signature</div>
          <div class="current-sig">
            <img
              :src="currentSignature"
              class="rounded-md"
              alt="Current Signature"
            />
          </div>
        </div>
        <div v-else>
          <template>
            <div>
              <p class="font-bold">
                Please enter your signature.
              </p>
              <p class="text-sm">
                (Will be used on all subsequent forms.)
              </p>
            </div>
          </template>
        </div>
        <div class="w-full max-w-full">
          <client-only>
            <loadingIndicator :is-uploading="isUploading">
              <VueSignaturePad
                id="signature"
                ref="signaturePad"
                :width="`${sigWidth}px`"
                :height="`${sigHeight}px`"
                class="border border-black mx-auto rounded-md"
                :options="options"
              />
            </loadingIndicator>
          </client-only>
        </div>
        <div class="text-center">
          {{ $store.getters["user/name"] }}
        </div>
        <div class="flex justify-between">
          <button
            :disabled="isUploading"
            class="px-4 py-2 border rounded-md"
            @click="undo"
          >
            Undo
          </button>
          <button
            :disabled="isUploading"
            class="px-4 py-2 border rounded-md"
            @click="save"
          >
            Save
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import signatureMixin from "./signatureMixin";
import modal from "@/components/partials/modal.vue";
import loadingIndicator from "@/components/partials/loadingIndicator.vue";

export default {
  name: "SignatureModal",
  components: {
    modal,
    loadingIndicator
  },
  mixins: [signatureMixin],
  props: {
    show: Boolean
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("user", {
      currentSignature: "signatureUrl"
    })
  },
  mounted() {
    this.setSize();

    const { user } = this.$store.state.auth;
    if (user && user.signature) {
      this.$store.dispatch("user/getSignature", user.signature);
    }
  },
  methods: {
    save() {
      if (this.isUploading) return;

      const { isEmpty, image, fd } = this.getImage();

      if (!isEmpty) {
        const { auth } = this.$store.state;
        const user = {
          user: auth.user.id,
          full_name: `${auth.user.firstName} ${auth.user.lastName}`
        };

        fd.append("files.signature", image, "signature.png");
        fd.append("data", JSON.stringify(user));

        this.$axios
          .post("signatures", fd)
          .then(({ data }) => {
            this.$auth.fetchUser();
            this.$store.commit("user/updateSignature", data.signature);
            this.$refs.signaturePad.clearSignature();
            this.$emit("close");
          })
          .catch((e) => console.log(e))
          .finally(() => (this.isUploading = false));
      }
    }
  }
};
</script>

<style lang="css">
.current-sig-container {
  @apply border border-black text-sm bg-white rounded-md;
}

.current-sig {
  @apply w-32 h-16 text-sm bg-white;
  background-color: rgba(255, 255, 255, 0.9);
  pointer-events: none;
}
</style>
