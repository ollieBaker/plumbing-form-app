<template>
  <div class="space-y-8">
    <formHeader />
    <div class="container mx-auto">
      <div class="space-y-4 mx-4">
        <h2 class="text-black font-bold text-2xl">
          <img
            :src="require(`~/assets/icons/${formData.icon}`)"
            class="icon"
            :alt="formData.name + ' forms'"
          />
          Submissions for {{ formData.name }} Form
        </h2>
        <div class="table-wrap space-y-4">
          <div
            class="filters w-full flex flex-col sm:flex-row flex-no-wrap space-y-1 sm:space-y-0 sm:space-x-2"
          >
            <formulate-input
              v-for="filter in filters"
              :key="filter.name"
              v-model="selectedFilters[filter.key]"
              class="flex-1 max-w-sm"
              :placeholder="filter.placeholder"
              :type="filter.type"
              :label="filter.label"
              :options="filter.options"
            />
          </div>
          <div class="space-y-2">
            <serverTable
              :url="tableURL"
              :columns="columns"
              :page-size="parseInt(pageSize)"
              @openPDFModal="openPDFModal"
            />
          </div>
        </div>
        <div class="flex justify-between items-center">
          <button
            type="button"
            class="rounded-md px-4 py-2 border"
            @click="exportData"
          >
            EXPORT
          </button>

          <formulate-input
            v-model="pageSize"
            class="max-w-sm"
            placeholder="- select -"
            type="select"
            label="Page size:"
            :options="{
              '5': 5,
              '10': 10,
              '20': 20,
              '50': 50
            }"
          />
        </div>
      </div>
    </div>
    <client-only placeholder="Loading...">
      <pdfModal
        v-bind="pdfModal"
        @close="pdfModal = { show: false, data: null }"
      />
    </client-only>
  </div>
</template>

<script>
import { mapState } from "vuex";
import columns from "@/static/tableColumns.json";
import {
  formatQueryString,
  formulateMap,
  downloadBlob
} from "@/functions/helpers.js";
import serverTable from "@/components/tables/serverTable.vue";
import formHeader from "@/components/forms/elements/formHeader.vue";

import pdfModal from "@/components/modals/pdfModal.vue";

export default {
  name: "FormSubmissionsTable",
  middleware: "admin-employee-only",
  components: {
    serverTable,
    formHeader,
    pdfModal
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch("site/getLocationOptions"),
      this.$store.dispatch("site/getUsers"),
      this.$store.dispatch("site/getSiteManagers"),
      this.$store.dispatch("site/getLadders")
    ]);
  },
  data() {
    return {
      pdfModal: {
        show: false,
        data: null
      },
      pageSize: 5,
      selectedFilters: {},
      formSubmissions: []
    };
  },
  computed: {
    ...mapState("site", {
      developers: (state) => state.developers,
      sites: (state) => state.sites,
      plots: (state) => state.plots,
      users: (state) => state.users,
      ladders: (state) => state.ladders,
      formList: (state) => state.formList
    }),
    testData() {
      return [
        ...this.developers,
        ...this.sites,
        ...this.plots,
        ...this.users,
        ...this.formList
      ];
    },
    formData() {
      return this.formList.find(({ api }) => api === this.$route.params.type);
    },
    tableURL() {
      const api = this.$route.params.type;
      const filterString = formatQueryString(this.selectedFilters);
      return filterString.length ? `${api}${filterString}` : api;
    },
    exportURL() {
      const api = this.$route.params.type;
      const filterString = formatQueryString(this.selectedFilters);
      return filterString.length
        ? `${api}/export/${filterString}`
        : `${api}/export`;
    },
    columns() {
      return columns[this.$route.params.type];
    },
    siteFilterOptions() {
      const developer = parseInt(this.selectedFilters.developer);
      const selectedDeveloper = developer && developer !== "*";
      const sites = selectedDeveloper
        ? this.developers.find((dev) => dev.id === developer).sites
        : this.sites;
      return formulateMap(sites);
    },
    plotFilterOptions() {
      const site = parseInt(this.selectedFilters.site);
      const selectedSite = site && site !== "*";
      const plots = selectedSite
        ? this.sites.find((s) => s.id === site).plots
        : this.plots;
      return formulateMap(plots);
    },
    filters() {
      return [
        {
          id: "developer",
          key: "developer",
          label: "Developer",
          type: "select",
          placeholder: "Select",
          options: formulateMap(this.developers)
        },
        {
          id: "site",
          key: "site",
          label: "Site",
          type: "select",
          placeholder: "Select",
          options: this.siteFilterOptions
        },
        {
          id: "plot",
          key: "plot",
          label: "Plot",
          type: "select",
          placeholder: "Select",
          options: this.plotFilterOptions
        },
        {
          id: "user",
          key: "user",
          label: "User",
          type: "select",
          placeholder: "Select",
          options: formulateMap(this.users)
        },
        {
          id: "equipment_reference",
          key: "equipment_reference",
          label: "Ladder",
          type: "select",
          placeholder: "Select",
          options: formulateMap(this.ladders, "equipment_reference")
        }
      ].filter(({ key }) => this.columns.includes(key));
    }
  },
  watch: {
    "selectedFilters.developer": {
      deep: true,
      handler() {
        console.log(this.selectedFilters);
        this.resetDependentValues("developer");
      }
    },
    "selectedFilters.site": {
      deep: true,
      handler() {
        console.log(this.selectedFilters);
        this.resetDependentValues("site");
      }
    }
  },
  methods: {
    resetDependentValues(key) {
      const needsReset = ["developer", "site"];
      if (needsReset.includes(key)) {
        const values = {
          developer: { site: "*", plot: "*" },
          site: { plot: "*" },
          plot: {}
        };

        const newState = Object.assign({}, values[key]);
        Object.keys(newState).forEach((key) => {
          this.$set(this.selectedFilters, key, newState[key]);
        });
      }
    },
    openPDFModal(id) {
      const format = (data) => {
        const clean = {};
        Object.keys(data).forEach((key) => {
          const value = data[key];
          if (value) {
            clean[key] = value;
            if (value.url) {
              clean[key] = value;
            } else if (value.id && key !== "user") {
              clean[key] = value.id;
            }
          }
        });
        return clean;
      };
      this.$axios.get(`${this.$route.params.type}/${id}`).then(({ data }) => {
        this.pdfModal = {
          show: true,
          data: format(data)
        };
      });
    },
    exportData() {
      this.$axios.get(this.exportURL).then(({ data }) => {
        console.log(data);
        const blob = new Blob([data], { type: "text/csv" });

        const dateString = new Date(Date.now())
          .toLocaleDateString()
          .replace(/\//g, "-");
        // Create a download link for the blob content
        const downloadLink = downloadBlob(
          blob,
          `${this.$route.params.type}_${dateString}.csv`
        );

        // Set the title and classnames of the link
        downloadLink.title = "Export Records as CSV";
        downloadLink.classList.add("btn-link", "download-link");

        // Set the text content of the download link
        downloadLink.textContent = "Export Records";
      });
    }
  }
};
</script>

<style lang="css" scoped>
.container {
  max-width: 80%;
}

@media screen and (max-width: 440px) {
  .container {
    max-width: 100%;
  }
}
>>> .VueTables__sortable {
}
>>> .VueTables__sort-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
  @apply block w-3 h-3;
  background-image: url("~assets/icons/sort.svg?inline");
  background-position: center;
  background-repeat: no-repeat;
}
>>> .VueTables__sort-icon.fa-sort-desc {
  background-image: url("~assets/icons/sort-up.svg?inline");
}
>>> .VueTables__sort-icon.fa-sort-asc {
  background-image: url("~assets/icons/sort-down.svg?inline");
}
</style>
