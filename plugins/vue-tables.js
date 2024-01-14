import Vue from "vue";
import { ServerTable, ClientTable } from "vue-tables-2";
import { pickValueFromObject } from "@/functions/helpers.js";
import tailwindTheme from "@/node_modules/vue-tables-2/compiled/themes/tailwind.js";
const { assign } = Object;
const defaultTheme = tailwindTheme();
const theme = function() {
  return assign(defaultTheme, {
    pagination: assign(defaultTheme.pagination, {
      active: "bg-red text-white font-bold border-0"
    })
  });
};

Vue.use(ClientTable, false, theme);

const SUPPORT_FILTER = false;

Vue.use(
  ServerTable,
  {
    requestKeys: {
      query: "_q",
      limit: "_limit",
      orderBy: "_sort",
      ascending: "asc",
      page: "page",
      byColumn: "byColumn"
    },
    filterable: SUPPORT_FILTER,
    filterByColumn: SUPPORT_FILTER,
    responseAdapter(response) {
      const { data } = response;
      return {
        data: data.items.map((form) => pickValueFromObject(form)),
        count: data.count
      };
    },
    requestFunction(data) {
      const { _q, _limit, page, _sort, asc } = data;
      const params = {
        _start: (page - 1) * _limit,
        _limit
      };

      if (SUPPORT_FILTER) {
        const keys = Object.keys(_q);
        if (_q && keys.length) {
          keys.forEach((key) => {
            const value = _q[key];
            const verb = parseInt(value) ? "" : "_contains";
            params[key + verb] = value;
          });
        }
      }

      if (_sort) {
        params._sort = `${_sort}:${asc ? "ASC" : "DESC"}`;
      }

      return this.$axios
        .get(this.url, {
          params
        })
        .catch(function(e) {
          this.dispatch("error", e);
        });
    }
  },
  false,
  theme
);
