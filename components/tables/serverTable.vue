<template>
  <v-server-table
    ref="table"
    :url="url"
    :columns="[...columns, 'actions']"
    :options="options"
    class="space-y-4"
  >
    <template v-slot:id="props">
      <div class="flex items-center space-between">
        <div>{{ props.row.id }}</div>
        <button type="button" class="open-button" @click="saveAsPDF(props.row)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path
              d="M527.9 224H480v-48c0-26.5-21.5-48-48-48H272l-64-64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h400c16.5 0 31.9-8.5 40.7-22.6l79.9-128c20-31.9-3-73.4-40.7-73.4zM48 118c0-3.3 2.7-6 6-6h134.1l64 64H426c3.3 0 6 2.7 6 6v42H152c-16.8 0-32.4 8.8-41.1 23.2L48 351.4zm400 282H72l77.2-128H528z"
            />
          </svg>
        </button>
      </div>
    </template>
    <template v-for="imageColumn in imageColumns" v-slot:[imageColumn]="props">
      <cell
        :key="imageColumn"
        :type="'image'"
        :data="props"
        :column="imageColumn"
        class="fa fa-date"
      />
    </template>

    <template v-for="dateColumn in dateColumns" v-slot:[dateColumn]="props">
      <cell
        :key="dateColumn"
        :type="'date'"
        :data="props"
        :column="dateColumn"
        class="fa fa-date"
      />
    </template>

    <template
      v-for="pressureColumn in pressureColumns"
      v-slot:[pressureColumn]="props"
    >
      <cell
        :key="pressureColumn"
        :type="'pressure'"
        :data="props"
        :column="pressureColumn"
        class="fa fa-date"
      />
    </template>

    <template
      v-for="durationColumn in durationColumns"
      v-slot:[durationColumn]="props"
    >
      <cell
        :key="durationColumn"
        :type="'duration'"
        :data="props"
        :column="durationColumn"
        class="fa fa-date"
      />
    </template>

    <template v-for="boolColumn in boolColumns" v-slot:[boolColumn]="props">
      <cell
        :key="boolColumn"
        :type="'boolean'"
        :data="props"
        :column="boolColumn"
        class="fa fa-date mx-auto text-center"
      />
    </template>

    <template v-slot:document="talk">
      <a
        v-if="talk.row['document']"
        :href="createImageURL(talk.row['document'])"
        target="_blank"
        class="block p-2 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          class="inline-icon"
        >
          <path
            d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm76.45 211.36l-96.42 95.7c-6.65 6.61-17.39 6.61-24.04 0l-96.42-95.7C73.42 337.29 80.54 320 94.82 320H160v-80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v80h65.18c14.28 0 21.4 17.29 11.27 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"
          />
        </svg>
      </a>
    </template>
    <template v-slot:actions="submission">
      <button
        v-if="submission.row['id']"
        target="_blank"
        class="block p-2 text-center mx-auto"
        @click="deleteItem(submission.row)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="inline-icon"
        >
          <path
            d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
          />
        </svg>
      </button>
    </template>
  </v-server-table>
</template>

<script>
import {
  imageColumns,
  dateColumns,
  durationColumns,
  pressureColumns,
  boolColumns,
  hiddenColumns
} from "@/static/columnTypes.js";
import cell from "@/components/tables/cell.vue";
import { createImageURL } from "@/functions/helpers.js";

export default {
  name: "ServerTable",
  components: {
    cell
  },
  props: {
    url: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    pageSize: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      imageColumns,
      dateColumns,
      durationColumns,
      pressureColumns,
      boolColumns,
      hiddenColumns,
      headings: {
        created_at: "Submitted",
        condition: "Satisfactory Condition?",
        developer: "Developer",
        actions: ""
      }
    };
  },
  computed: {
    hiddenCols() {
      if (this.$auth.user.role.name === "Administrator") {
        return this.hiddenColumns;
      }
      return [...this.hiddenColumns, "actions"];
    },
    options() {
      return {
        perPage: this.pageSize,
        hiddenColumns: this.hiddenCols,
        headings: this.headings,
        sortIcon: {
          base: "fa",
          up: "fa-sort-asc",
          down: "fa-sort-desc",
          is: "fa-sort"
        },
        sortable: [...this.columns]
      };
    }
  },
  watch: {
    pageSize(newValue) {
      this.$refs.table.setLimit(newValue);
    }
  },
  methods: {
    saveAsPDF({ id }) {
      this.$nextTick(() => {
        window.scrollTo(0, 0);
      });
      this.$emit("openPDFModal", id);
    },
    createImageURL(img) {
      return createImageURL(img);
    },
    deleteItem({ id }) {
      if (confirm("Are you sure you want to delete this item?")) {
        this.$axios
          .delete(`${this.url}/${id}`)
          .then(({ data }) => {
            console.log(data);
            this.$refs.table.refresh();
          })
          .catch((e) => console.log(e));
      }
    }
  }
};
</script>

<style scoped>
>>> .table-responsive {
  @apply rounded-sm;
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}
/* CHECK THIS */

>>> .grid-rows-1,
>>> .VueTables__limit {
  display: none;
}

>>> .VuePagination {
  @apply flex flex-row flex-no-wrap justify-center;
}

>>> .VuePagination > nav {
  @apply flex flex-col flex-no-wrap items-center;
}
>>> .VuePagination > nav > ul > * + * {
  margin-left: 0.25rem;
}

>>> .VuePagination > nav > ul > li {
  @apply rounded-md w-10 h-10 overflow-hidden;
}
>>> .VuePagination .active {
  @apply font-bold bg-red;
}
>>> .VuePagination .active > a {
  @apply bg-red;
  background-color: red;
}

>>> table {
  @apply text-sm;
}
>>> table th {
  min-width: 12ch;
}
.open-button {
  /* https://faicons.dev/ */
  @apply w-6 h-6 ml-2;
}
</style>
