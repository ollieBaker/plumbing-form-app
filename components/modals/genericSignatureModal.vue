<template>
  <div class="signature-modal">
    <modal :show-modal="show" :classes="['items-center']" @close="onClose">
      <div class="space-y-2">
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
import signatureMixin from "./signatureMixin";
import modal from "@/components/partials/modal.vue";
import loadingIndicator from "@/components/partials/loadingIndicator.vue";

export default {
  name: "GenericSignatureModal",
  components: {
    modal,
    loadingIndicator
  },
  mixins: [signatureMixin],
  props: {
    show: Boolean,
    fileName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {
    this.setSize();
  },
  methods: {
    save() {
      if (this.isUploading) return;

      const { isEmpty, image, fd } = this.getImage();

      if (!isEmpty) {
        fd.append(
          "files",
          image,
          `${this.fileName
            .toLocaleLowerCase()
            .replace(/ /g, "-")}-signature.png`
        );
        console.log(fd);

        this.$axios
          .post("upload", fd)
          .then(({ data }) => {
            setTimeout(() => {
              this.$emit("signatureUploaded", data);
              this.$refs.signaturePad.clearSignature();
              this.$emit("close");
            }, 50);
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
