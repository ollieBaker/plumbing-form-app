<template>
  <div class="image-input w-full items-center space-y-2">
    <div class="flex flex-row flex-wrap  space-y-2 justify-between">
      <div class="input space-y-2 mr-3 no-print">
        <h2 class="photo-title"><slot>Upload Picture</slot></h2>
        <label class="block btn-red w-32 text-center" :disabled="isUploading">
          {{ image ? "Replace" : "Upload" }}
          <input
            :disabled="isUploading"
            class="hidden"
            type="file"
            accept="image/*"
            @change="save"
          />
        </label>
      </div>

      <loadingIndicator :is-uploading="isUploading" class="loading-indicator">
        <div
          v-if="image"
          class="fade-in image max-w-sm border rounded-sm overflow-hidden p-1"
        >
          <img :src="imageURL" alt="Talk Photo" class="" />
        </div>
      </loadingIndicator>
    </div>
  </div>
</template>

<script>
import { createImageURL } from "@/functions/helpers.js";
import loadingIndicator from "@/components/partials/loadingIndicator.vue";

export default {
  name: "ImageInput",
  components: { loadingIndicator },
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
      image: null,
      isUploading: false
    };
  },
  computed: {
    imageURL() {
      return createImageURL(this.image);
    }
  },
  created() {
    if (this.existingImage) {
      this.image = this.existingImage;
    }
  },
  methods: {
    save(e) {
      if (this.isUploading) return;

      const file = e.target.files[0];
      if (file) {
        const fd = new FormData();
        const fileName = file.name.split(".");
        const ext = fileName.pop();

        fd.append(
          "files",
          file,
          `${fileName
            .join()
            .toLocaleLowerCase()
            .replace(/ /g, "-")}-talk.${ext}`
        );
        console.log(fd);

        this.isUploading = true;

        this.$axios
          .post("upload", fd)
          .then(({ data }) => {
            this.onImageUploaded(data);
          })
          .catch((e) => console.log(e))
          .finally(() => {
            this.isUploading = false;
          });
      }
    },
    onImageUploaded(e) {
      const upload = e[0];

      this.image = upload;

      this.$emit("imageUploaded", upload);
    }
  }
};
</script>

<style lang="css">
.btn-red[disabled="disabled"] {
  opacity: 0.7;
}

.image-input .photo-title {
  @apply font-bold capitalize;
}

.image-input .input {
  width: calc(50% - 0.75rem);
}

.image-input .loading-indicator {
  flex-basis: auto;
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
}

.image-input.full-width .loading-indicator {
  max-width: 100%;
}
.image-input.centered {
  @apply text-center;
}
.image-input.centered .input {
  @apply w-full;
  @apply mr-0;
}
.image-input.centered .input > * {
  @apply mx-auto;
}
</style>
