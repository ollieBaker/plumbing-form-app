<template>
  <div class="form-container">
    <formView
      :title="name"
      :component-name="componentName"
      :child-forms="children"
      :can-submit="canSubmit"
      :complete-children="completeChildren"
      @activateChild="onActivateChild"
      @deactivateChild="onDeactivateChild"
      @cancelChild="cancelChild"
      @showChild="onShowChild"
      @hideChild="onHideChild"
    ></formView>
    <template v-for="childForm in children">
      <modal
        :key="childForm.id"
        :show-modal="visibleChild === childForm.componentName"
        @close="onHideChild"
      >
        <formView
          :name="'child-form-view'"
          :title="childForm.name"
          :existing-values="parentValues"
          :component-name="childForm.componentName"
          @complete="onChildComplete"
        ></formView>
      </modal>
    </template>
  </div>
</template>

<script>
import modal from "@/components/partials/modal.vue";
import formView from "@/components/formView.vue";

export default {
  name: "FormContainer",
  components: {
    formView,
    modal
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    componentName: {
      type: String,
      required: true
    },
    children: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeChildren: [],
      visibleChild: null,
      parentValues: {},
      completeChildren: {}
    };
  },
  computed: {
    canSubmit() {
      // TODO update this
      console.log(
        "can submit",
        Object.keys(this.completeChildren).length,
        this.activeChildren.length
      );
      const completeChildren = Object.keys(this.completeChildren).filter(
        (key) => this.completeChildren[key]
      );
      return completeChildren.length === this.activeChildren.length;
    }
  },
  methods: {
    onChildComplete({ fieldName, data }) {
      this.$set(this.completeChildren, fieldName, data);
      this.onHideChild();
      // this data should probably be the id of the submitted form which can then be passed to the main form
    },
    onShowChild({ name, values }) {
      this.parentValues = values;
      this.visibleChild = name;
    },
    onHideChild() {
      this.visibleChild = null;
    },
    onActivateChild(name) {
      if (!this.activeChildren.includes(name)) {
        this.activeChildren.push(name);
      }
    },
    onDeactivateChild(name) {
      const names = [...this.activeChildren];
      const i = names.indexOf(name);
      if (i != null) {
        names.splice(i, 1);
        this.activeChildren = names;
      }
    },
    cancelChild(fieldName) {
      this.$delete(this.completeChildren, fieldName);
    }
  }
};
</script>

<style lang="scss"></style>
