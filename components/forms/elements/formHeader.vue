<template>
  <header class="form-header">
    <div class="bg-red">
      <div class="container mx-auto flex items-center justify-start relative">
        <button v-if="!hideBackButton" class="back-btn" @click="goBack">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="back-icon"
          >
            <path
              color="white"
              d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"
            />
          </svg>
        </button>
        <nuxtLink class="home-button mx-auto" to="/">
          <h1 class="client">CLIENT</h1>
          <small>Plumbing & Heating (Contractors) LTD</small>
        </nuxtLink>
      </div>
    </div>
    <div v-if="title" class="title-wrap">
      <h2 class="title font-semibold">{{ title }}</h2>
    </div>
  </header>
</template>

<script>
export default {
  name: "FormHeader",
  props: {
    title: { type: String, default: null },
    hideBackButton: { type: Boolean }
  },
  methods: {
    goHome() {
      this.$router.push({ path: "/" });
    },
    goBack() {
      const h = this.$router.history;
      try {
        if (h._startLocation === h.current.path) {
          return this.goHome();
        }
      } catch (error) {
        this.$router.back();
      }

      this.$router.back();
    }
  }
};
</script>

<style lang="css">
.form-header {
}
.form-header {
  color: white;
  text-align: center;
}
.home-button {
  @apply p-5;
}
.client {
  @apply w-full;
}
.title-wrap {
  @apply p-3;
  background-color: rgb(13, 13, 13);
}
.back-btn {
  position: absolute;
  z-index: 1;
  @apply block py-2 px-3 rounded-md border flex items-center justify-center ml-4;
}
.back-icon {
  @apply block w-4 h-4;
  fill: white;
}
</style>
