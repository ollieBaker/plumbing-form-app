<template>
  <div>
    <modal
      :show-modal="show"
      :hide-close-btn="false"
      :scroll-body="true"
      :classes="['pdf-modal']"
      @close="$emit('close')"
    >
      <div class="mb-2">
        <button
          class="no-print rounded-md px-4 py-2 border mx-auto block"
          @click="openPrintDialog"
        >
          Print or save as PDF
        </button>
      </div>

      <div id="print-container" class="space-y-4">
        <formHeader :hide-back-button="true" :title="formTitle" />
        <div class="content">
          <FormulateForm :values="data">
            <component :is="componentName" :values="data"></component>
          </FormulateForm>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import formHeader from "@/components/forms/elements/formHeader.vue";
import modal from "@/components/partials/modal.vue";
import qualityControlInspection from "@/components/forms/qualityControlInspection.vue";
import preOccupation from "@/components/forms/preOccupation.vue";
import workplaceSafetyInspection from "@/components/forms/workplaceSafetyInspection.vue";
import heatingControlsHandover from "@/components/forms/heatingControlsHandover.vue";
import toolboxTalk from "@/components/forms/toolboxTalk.vue";
import ladderList from "@/components/forms/ladderList.vue";

import { createImageURL } from "@/functions/helpers.js";
import {
  imageColumns,
  dateColumns,
  durationColumns,
  pressureColumns,
  hiddenColumns
} from "@/static/columnTypes.js";

export default {
  name: "PdfModel",
  components: {
    modal,
    formHeader,
    qualityControlInspection,
    preOccupation,
    workplaceSafetyInspection,
    heatingControlsHandover,
    toolboxTalk,
    ladderList
  },
  props: {
    show: Boolean,
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      printing: false
    };
  },
  computed: {
    componentName() {
      const { componentName } = this.$store.state.site.formList.find(
        (form) => form.api === this.$route.params.type
      );
      return componentName;
    },
    formTitle() {
      const { name } = this.$store.state.site.formList.find(
        (form) => form.api === this.$route.params.type
      );
      return name;
    },
    cleanData() {
      if (!this.data) return [];

      return Object.keys(this.data)
        .filter((key) => this.data[key] && !hiddenColumns.includes(key))
        .map((key) => {
          const item = this.formatData(key, this.data[key]);
          const cleaned = {
            id: key,
            key: key.replace(/_/g, " "),
            type: imageColumns.includes(key) ? "image" : "text",
            value: item
          };
          return cleaned;
        });
    }
  },
  methods: {
    openPrintDialog() {
      try {
        // Print for Safari browser
        document.execCommand("print", false, null);
      } catch {
        window.print();
      }
    },
    formatData(key, val) {
      const types = [dateColumns, durationColumns, pressureColumns];
      const type = types.find((t) => t.includes(key));
      if (type) {
        switch (type) {
          case dateColumns:
            return new Date(val).toLocaleDateString();
          case durationColumns:
            return `${val} Min`;
          case pressureColumns:
            return `${val} Bar`;
        }
      }
      return val;
    },
    createImageURL(obj) {
      return createImageURL(obj);
    }
  }
};
</script>

<style lang="css" scoped>
.key {
  @apply font-bold capitalize;
  /* text-transform: capitalize; */
  /* font-weight: bold; */
}
img {
  display: inline;
  max-width: 200px;
}
#print-container {
  @apply pointer-events-none;
}
#print-container >>> textarea {
  resize: none;
}
#print-container >>> .formulate-input-element[data-type]::before {
  display: none !important;
}
</style>
