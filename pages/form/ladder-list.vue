<template>
  <div class="">
    <formHeader title="Ladder Lists" />
    <div class="px-8 space-y-4 mt-8">
      <div class="input space-y-2">
        <label for="ladder" class="font-bold">Ladder List</label>
        <select id="ladder" name="ladder" @change="openLadderForm($event)">
          <option selected disabled>Please Select a Ladder</option>
          <option
            v-for="{ id, name, equipment_reference } in ladders"
            :key="id"
            :value="id"
            >{{ name }} - {{ equipment_reference }}</option
          >
        </select>
      </div>
      <ul class="space-y-4">
        <li class="flex justify-between items-center">
          <nuxt-link to="/form/ladder-list/new">
            <button type="button" class="ml-auto btn-red">
              Add New
            </button></nuxt-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import formHeader from "@/components/forms/elements/formHeader.vue";

export default {
  name: "LadderList",
  components: {
    formHeader
  },
  async fetch() {
    await this.$store.dispatch("site/getLadders");
  },

  computed: {
    ...mapState("user", {
      ladderList: (state) => state.ladderList
    }),
    ...mapState("site", {
      ladders: (state) => state.ladders
    })
  },
  methods: {
    openLadderForm(e) {
      this.$router.push(`/form/ladder-list/${e.target.value}`);
    }
  }
};
</script>

<style lang="css" scoped>
.btn-red {
  @apply px-8;
}
</style>
