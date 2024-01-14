<script>
import { createImageURL } from "@/functions/helpers.js";

export default {
  name: "CustomCell",
  props: {
    type: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    column: {
      type: String,
      required: true
    }
  },
  methods: {
    createDate(input) {
      return input ? new Date(input).toLocaleDateString() : "";
    },
    createPressureLabel(input, label = "bar") {
      return input ? `${input} ${label}` : "";
    },
    createDurationLabel(input) {
      return input ? `${input} min` : "";
    },
    createImage(input) {
      const src = createImageURL(input, "thumbnail");
      return {
        attrs: {
          src
        }
      };
    }
  },
  render(h) {
    const { type, data, column } = this.$props;

    switch (type) {
      case "date":
        return h("span", this.createDate(data.row[column]));
      case "pressure":
        return h(
          "span",
          this.createPressureLabel(
            data.row[column],
            column === "pipework_pressure" ? "bar" : "mbar"
          )
        );
      case "duration":
        return h("span", this.createDurationLabel(data.row[column]));
      case "image":
        return h("img", this.createImage(data.row[column]));
      case "boolean":
        return h("div", data.row[column] ? "✓" : "");
      default:
        break;
    }
    return h("span", data.row[column]);
  }
};
</script>

<style lang="css" scoped>
img {
  max-height: 100px;
}
</style>
