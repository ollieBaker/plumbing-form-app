export default {
  props: {
    existingValues: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      responseKeys: null
    };
  },
  mounted() {
    this.useExistingValues();
  },
  methods: {
    useExistingValues() {
      if (this.existingValues) {
        this.parseComponent(this.$data);
      }
    },
    parseComponent(destination) {
      const dataKeys = Object.keys(destination);
      const keys = this.responseKeys || dataKeys;

      keys.forEach((key, i) => {
        const existingValue = this.existingValues[key];
        if (existingValue) {
          const dataKey = dataKeys[i];
          if (!key.includes(dataKey)) {
            console.error(
              "Key name mismatch. Check responseKeys are in correct order"
            );
            console.log("ResponseKeys", this.responseKeys);
          }
          destination[dataKey] = existingValue;
        }
      });
    },
    parseArray(key) {
      if (this.existingValues) {
        const value = this.existingValues[key];
        if (value) {
          const newValue = Array.isArray(value) ? value : value.split(",");
          this.internalValue = newValue;
          console.log("using internal value for", key, value);
        }
      }
    }
  }
};
