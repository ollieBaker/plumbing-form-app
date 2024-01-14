<template>
  <div class="heating-controls-handover-form space-y-4">
    <locationSelect :multiple-plots="true" :existing-values="values" />

    <electricianSignOff :existing-values="values">
      <div class="conditions px-8">
        <p class="text-sm text-gray-600">
          In signing this document it releases the heating controls
          responsibility to electircal contractor
        </p>
        <p class="text-sm text-gray-600">
          If the electrician has signed for the plot it means that the
          contractor is happy that all rooms stats / programmers / cylinder
          stat/s writing centres / weather compensator / underﬂoor heating
          connections are present at the time of signature:
        </p>
      </div>
    </electricianSignOff>

    <hr />
    <userSignOff :hide-message="true" :existing-values="values">
      <slot name="submit-button"></slot>
    </userSignOff>
  </div>
</template>

<script>
import formBase from "./mixins/formBase.js";

import electricianSignOff from "./elements/electricianSignOff.vue";

export default {
  name: "HeatingControlsHandover",
  components: {
    electricianSignOff
  },
  mixins: [formBase]
};
</script>

<style lang="scss"></style>
