<template>
  <div class="form-submissions space-y-8">
    <formHeader :hide-back-button="true" />
    <div class="container mx-auto">
      <div class="mx-4 space-y-4">
        <h2 class="text-center text-black font-bold text-2xl">Form Types</h2>
        <ul class="max-w-sm mx-auto space-y-2">
          <li
            v-for="form in $store.state.site.formList"
            :key="form.key"
            class="list-item"
          >
            <nuxt-link
              :to="`/submissions/${form.api}`"
              class="font-semibold block text-left p-4"
            >
              <img
                :src="require(`~/assets/icons/${form.icon}`)"
                class="icon"
                :alt="form.name + ' forms'"
              />
              {{ form.name }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import formHeader from "@/components/forms/elements/formHeader.vue";
export default {
  name: "FormSubmissions",
  middleware: "admin-employee-only",
  components: {
    formHeader
  }
};
</script>

<style scoped>
.list-item {
  @apply flex justify-center items-center rounded-md text-center border border-black;
}
.list-item > a {
  flex-basis: 305px;
}
</style>
