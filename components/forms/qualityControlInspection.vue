<template>
  <div class="quality-control-inspection-form space-y-4">
    <locationSelect :existing-values="values" />

    <div class="space-y-4 px-8">
      <formInput :name="'first_fix'" :values="values">
        <formulate-input
          type="date"
          name="first_fix"
          label="1st Fix"
          validation="dateOrEmpty"
        />
      </formInput>

      <formInput :name="'gas_carcas'" :values="values">
        <formulate-input
          type="date"
          name="gas_carcas"
          label="Gas Carcass"
          validation="dateOrEmpty"
        />

        <div class="gas-number">
          <span class="text-left company"
            >Company Gas Safe&nbsp;#:
            {{
              values.company_gas_safe_number ||
                $store.state.site.company_gas_safe_number
            }}
          </span>
          <span class="text-right operative">
            Operative Gas Safe License&nbsp;#:
            {{ values.gasNumber || $store.state.auth.user.gasNumber }}
          </span>
        </div>
      </formInput>

      <formInput :name="'second_fix'" :values="values">
        <formulate-input
          type="date"
          name="second_fix"
          label="2nd Fix"
          validation="dateOrEmpty"
        />
      </formInput>
      <formInput :name="'third_fix'" :values="values">
        <formulate-input
          type="date"
          name="third_fix"
          label="3rd Fix"
          validation="dateOrEmpty"
        />
      </formInput>
      <formInput :name="'fourth_fix'" :values="values">
        <formulate-input
          type="date"
          name="fourth_fix"
          label="4th Fix"
          validation="dateOrEmpty"
        />
      </formInput>
      <formInput :name="'other_fix'" :values="values">
        <formulate-input
          type="date"
          name="other_fix"
          label="Other works"
          validation="dateOrEmpty"
          validation-name="Other works"
        />
      </formInput>

      <formInput :name="'other_detail'" :values="values">
        <formulate-input
          v-if="values['other_fix']"
          type="textarea"
          name="other_detail"
          placeholder="Other work detail..."
          validation="required"
          :validation-messages="{
            required: 'Details for Other works are required'
          }"
        />
      </formInput>
      <hr />
    </div>
    <levelWithDate title="Gutter" :existing-values="values" />
    <levelWithDate title="Down Pipes" :existing-values="values" />

    <div class="px-8 space-y-4">
      <formInput :name="'finals'" :values="values">
        <formulate-input
          type="date"
          name="finals"
          label="Finals"
          validation="dateOrEmpty"
        />
      </formInput>

      <formInput :name="'commission_types'" :values="values">
        <commission :title="'Commission'" :existing-values="values" />
      </formInput>

      <formInput :name="'pre_occupation_form'" :values="values">
        <div class="pre-occupation-form space-y-1">
          <h2>Pre-Occupation Sign-Off</h2>
          <formulate-input
            type="date"
            label="Date:"
            name="pre_occupation_date"
          />
          <formulate-input
            type="text"
            hidden="true"
            name="pre_occupation_form"
          />
          <button
            :disabled="!values['pre_occupation_date']"
            type="button"
            class="btn-red no-print"
            @click="showChildForm"
          >
            FILL IN FORM
          </button>
          <button
            v-if="values['pre_occupation_date']"
            type="button"
            class="btn-red no-print"
            @click="
              $set(values, 'pre_occupation_date', null);
              $set(values, 'pre_occupation_form', null);
              $emit('cancelChild', 'pre_occupation_form');
            "
          >
            Cancel
          </button>
        </div>
      </formInput>

      <formInput :name="'comments'" :values="values">
        <formulate-input type="textarea" name="comments" label="Comments" />
      </formInput>
      <hr class="border-red" />
    </div>

    <pressureDurationSelect title="Gas" :existing-values="values" />

    <pressureDurationSelect title="Pipework" :existing-values="values" />

    <pressureDurationSelect title="Interim Soil" :existing-values="values" />

    <formInput class="px-8" :name="'soil_test_date'" :values="values">
      <h2 class="text-red font-bold text-xl">
        Soil Test WITH inspector
      </h2>
      <div class="flex flex-row items-center space-x-4">
        <formulate-input
          class="w-3/5"
          type="date"
          label="Date:"
          name="soil_test_date"
        />
        <formulate-input
          :key="values['soil_test_date']"
          class="flex-1 self-end mb-2"
          :disabled="!values['soil_test_date']"
          type="checkbox"
          label="Complete:"
          name="soil_test_complete"
        />
      </div>
    </formInput>

    <siteManagerSignOff :existing-values="values" />

    <hr />

    <userSignOff :existing-values="values">
      <p v-if="!canSubmit" class="no-print">
        <em
          >Date Added for Pre-Occupation Sign-Off Please complete form or
          cancel</em
        >
      </p>
      <slot name="submit-button"></slot>
    </userSignOff>
  </div>
</template>

<script>
import formBase from "./mixins/formBase.js";
import pressureDurationSelect from "./elements/pressureDurationSelect.vue";
import levelWithDate from "./elements/levelWithDate.vue";
import commission from "./elements/commission.vue";

export default {
  name: "QualityControlInspection",
  components: {
    pressureDurationSelect,
    levelWithDate,
    commission
  },
  mixins: [formBase],
  props: {
    canSubmit: Boolean
  },
  data() {
    return {};
  },
  watch: {
    values(newValue, oldValue) {
      const newDate = newValue.pre_occupation_date;
      const oldDate = oldValue.pre_occupation_date;
      if (newDate && newDate !== oldDate) {
        this.$emit("activateChild", "preOccupation");
      } else if (!newDate) {
        this.$emit("deactivateChild", "preOccupation");
      }
    }
  },
  methods: {
    showChildForm() {
      this.$emit("showChild", {
        name: "preOccupation",
        values: Object.assign({}, this.values, { site_manager_signature: null })
      });
    }
  }
};
</script>

<style lang="css">
div.submit,
button[type="submit"] {
  @apply w-full text-white bg-red px-4 py-2 text-center;
}
.gas-number {
  @apply text-sm font-semibold flex justify-between mt-0 !important;
}
.gas-number > span {
  max-width: 50%;
}
.gas-number .operative::after {
  background-image: url("~assets/icons/gas-safe.svg?inline");
  display: inline-block;
  content: "";
  width: 19px;
  height: 19px;
  vertical-align: text-bottom;
}
</style>
