<template>
  <div class="ladder-list">
    <div class="form-section space-y-4 px-8">
      <header v-if="mode === 'update'" class="text-black">
        <h1 class="text-2xl text-red text-left">
          {{ title }}
        </h1>
        <p>Equipment Ref No. {{ ladderData.equipment_reference }}</p>
      </header>
      <formulate-input
        v-show="mode === 'create'"
        v-model="ladderData.name"
        type="text"
        name="name"
        label="Name"
        :hidden="mode === 'update'"
      />
      <formulate-input
        v-show="mode === 'create'"
        v-model="ladderData.equipment_reference"
        type="text"
        name="equipment_reference"
        label="Equipment Reference"
        validation="required"
        :hidden="mode === 'update'"
      />
      <formulate-input
        v-model="ladderData.condition"
        type="radio"
        name="condition"
        label="Satisfactory Condition?"
        :options="{ yes: 'Yes', no: 'No' }"
        validation="required"
      />
      <formulate-input
        v-model="ladderData.date"
        type="date"
        name="date"
        label="Date"
        validation="required"
      />
      <imgageInput
        :existing-image="
          ladderData && ladderData.photo && ladderData.photo.id
            ? ladderData.photo
            : null
        "
        @imageUploaded="$set(ladderData, 'photo', $event.id)"
      />
      <formulate-input
        v-model="ladderData.photo"
        type="text"
        name="photo"
        hidden="true"
        validation="required"
      />
      <formulate-input
        v-model="ladderData.comments"
        type="textarea"
        name="comments"
        label="Comments"
      />
      <hr />
    </div>
    <userSignOff :hide-message="true" :existing-values="values" class="mt-8">
      <formulate-input
        type="button"
        class="submit"
        name="submit"
        label="Submit"
        @click="onSubmit"
      />
    </userSignOff>
  </div>
</template>

<script>
import imgageInput from "./elements/imageInput.vue";
import formBase from "./mixins/formBase.js";

export default {
  name: "LadderList",
  components: {
    imgageInput
  },
  mixins: [formBase],
  async fetch() {
    await this.$store.dispatch("site/getLadders");
    const id = parseInt(this.$route.params.id);
    if (id > -1) {
      console.log("ID", id);
      const existingLadderData = this.$store.state.site.ladders.find(
        (ladder) => ladder.id === id
      );
      if (existingLadderData) {
        console.log(
          "Using existing data for",
          existingLadderData.name,
          existingLadderData
        );

        this.ladderData = Object.assign({}, existingLadderData);
      }
    }
    this.render = true;
  },
  data() {
    return {
      render: false,
      ladderData: {},
      mode: this.$route.params.id === "new" ? "create" : "update"
    };
  },
  computed: {
    title() {
      return this.ladderData.name
        ? this.ladderData.name
        : this.ladderData.id
        ? `Ladder ${this.ladderData.id}`
        : "";
    },
    valid() {
      // eslint-disable-next-line camelcase
      const { equipment_reference, condition, date, photo } = this.ladderData;
      // eslint-disable-next-line camelcase
      return equipment_reference && condition && date && photo;
    }
  },
  beforeDestroy() {
    this.ladderData = {};
  },
  created() {
    this.useExistingValues();
  },
  methods: {
    useExistingValues() {
      if (this.values) {
        this.ladderData = Object.assign({}, this.values);
      }
    },
    onSubmit(e) {
      if (this.mode === "create" && this.valid) {
        this.$axios
          .post(
            "ladders",
            Object.assign({}, this.ladderData, { created_by_user: true })
          )
          .then(() => {
            return this.$formulate.submit("ladderList");
          })
          .catch((error) => {
            console.log(error);
            this.$emit("error", {
              message: "Please check equipment reference is unique."
            });
          });
        return;
      }
      this.$formulate.submit("ladderList");
    }
  }
};
</script>

<style lang="scss"></style>
