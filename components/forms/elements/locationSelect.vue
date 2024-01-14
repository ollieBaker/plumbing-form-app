<template>
  <div class="location-select space-y-4 px-8">
    <formInput :name="'developer'" :values="existingValues">
      <formulate-input
        v-if="!hideElements.includes('developer')"
        v-model="developer"
        :options="developers"
        type="select"
        placeholder="-
    select -"
        name="developer"
        label="Developer/House Builder"
        validation="required"
        :validation-messages="{ required: 'Developer is required.' }"
        :disabled="disabled"
        @input="resetDependentValues('developer')"
      />
    </formInput>

    <formInput :name="'site'" :values="existingValues">
      <formulate-input
        v-if="!hideElements.includes('site')"
        v-model="site"
        :options="sites"
        type="select"
        placeholder="- select -"
        name="site"
        label="Site"
        validation="required"
        :disabled="disabled"
        @input="resetDependentValues('site')"
      />
    </formInput>

    <formInput
      v-if="multiplePlots"
      class="plot-list space-y-2"
      :name="'plots'"
      :values="existingValues"
    >
      <formulate-input
        v-model="selectedPlot"
        :options="plots"
        type="select"
        placeholder="- select -"
        label="Plot No."
        class="no-print"
        @change="addPlotToList"
      />
      <h2 class="font-bold text-lg">Plots:</h2>
      <ul class="space-y-2">
        <li
          v-for="{ label, value } in plotList.map((id) =>
            plots.find((plot) => plot.value === id)
          )"
          :key="value"
        >
          <p class="space-x-2">
            <span>{{ label }}</span>
            <button
              type="button"
              class="rounded-md border border-black px-2 ml-4 no-print"
              @click="removePlot(value)"
            >
              ×
            </button>
          </p>
        </li>
      </ul>
      <formulate-input
        v-model="plotList"
        name="plots"
        type="select"
        validation="min:1"
        :validation-messages="{ min: 'You need at least 1 plot' }"
        class="formulate-hidden"
        hidden
      />
    </formInput>

    <formInput
      v-else-if="!hideElements.includes('plot')"
      :name="'plot'"
      :values="existingValues"
    >
      <formulate-input
        v-model="plot"
        :options="plots"
        type="select"
        placeholder="- select -"
        name="plot"
        label="Plot No."
        validation="required"
        :disabled="disabled"
        @input="resetDependentValues('plot')"
      />
    </formInput>
    <slot></slot>

    <hr class="hr-red" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import formElement from "../mixins/formElement";

export default {
  name: "LocationSelect",
  mixins: [formElement],
  props: {
    disabled: {
      type: [Boolean, String],
      default: false
    },
    multiplePlots: {
      type: Boolean,
      default: false
    },
    hideElements: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      plotList: [],
      selectedPlot: "",
      developer: "",
      site: "",
      plot: ""
    };
  },
  computed: {
    ...mapState("site", {
      developers(state) {
        const filter = !this.$route.path.includes("/submissions/");
        return state.developers
          .filter((site) => (filter ? site.active !== false : true))
          .map((value) => ({
            label: value.name,
            value: value.id
          }));
      },
      sites(state) {
        if (this.developer) {
          const developer = state.developers.find(
            (d) => d.id === this.developer
          );

          return developer.sites
            .map((value) => ({
              label: value.name,
              value: value.id
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        }
        return "";
      },
      plots(state) {
        if (this.site) {
          const site = state.sites.find((s) => s.id === this.site);

          return site.plots
            .map((value) => ({
              label: value.name,
              value: value.id
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        }
        return "";
      }
    })
  },
  mounted() {
    if (this.multiplePlots) {
      const plots = this.existingValues && this.existingValues.plots;
      if (plots) {
        this.plotList = plots.map((plot) => plot.id);
      }
    }
  },
  methods: {
    resetDependentValues(state) {
      if (this.disabled || this.existingValues) return;

      const values = {
        developer: { site: "", plot: "" },
        site: { plot: "" },
        plot: {}
      };
      const newState = Object.assign({}, values[state]);
      Object.keys(newState).forEach((key) => (this[key] = newState[key]));
    },

    addPlotToList({ target }) {
      const plot = target.value;
      this.resetDependentValues("plot");
      console.log(plot);
      const id = parseInt(plot);
      if (!this.plotList.includes(id)) {
        this.plotList.push(id);
      }
      this.mode = "idle";
      this.selectedPlot = "";
    },

    removePlot(id) {
      const index = this.plotList.indexOf(id);
      this.plotList.splice(index, 1);
      this.selectedUser = "";
    }
  }
};
</script>

<style lang="css">
.location-select .hr-red {
  height: 0.5rem;
  box-sizing: border-box;
  border-bottom-width: 2px;
  border-top: 0;
}
</style>
