<template>
  <div class="loading-indicator relative">
    <div
      v-if="isUploading"
      class="absolute w-full h-full flex justify-center items-center loading-cover"
    >
      <img class="loading-indicator fade-in" src="@/assets/Spin-1s-200px.svg" />
    </div>
    <slot>
      <div v-if="isUploading" class="dummyImage border w-40 h-32"></div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "LoadingIndicator",
  props: {
    isUploading: {
      type: Boolean
    }
  }
};
</script>

<style lang="css">
.loading-cover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
