<template>
  <portal to="modal" class="scroll-wrap">
    <transition name="modal-fade">
      <div
        v-if="showModal"
        id="modal-bg"
        :class="[scrollBody ? 'scroll-body' : '']"
        @click.self="close()"
      >
        <div class="modal" :class="[...classes]">
          <div class="wrapper m-4 w-full">
            <div class="container relative">
              <button
                v-if="!hideCloseBtn"
                class="no-print close-btn z-10"
                @click="close()"
              >
                <span>×</span>
              </button>
              <slot></slot>
              <!-- ***use this for a scrollbox***
        <div class="modal-scrollbox">
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque, nostrum quisquam? Repudiandae odio ex culpa iusto alias quaerat amet? Magnam, eligendi! Excepturi voluptatum quod assumenda</p>
        </div>
        
        -->
            </div>
          </div>
        </div>
      </div>
    </transition>
  </portal>
</template>

<script>
export default {
  name: "Modal",
  inheritAttrs: false,
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    hideCloseBtn: {
      type: Boolean
    },
    scrollBody: {
      type: Boolean
    },
    classes: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    showModal(val) {
      if (!this.scrollBody) {
        const el = document.body;
        if (val && el) {
          el.classList.add("no-scroll");
        } else if (el) {
          el.classList.remove("no-scroll");
        }
      }
    }
  },
  beforeDestroy() {
    const el = document.body;
    el.classList.remove("no-scroll");
  },
  methods: {
    close() {
      if (!this.hideCloseBtn) this.$emit("close");
    }
  }
};
</script>

<style lang="css">
#modal-bg {
  @apply fixed top-0 left-0 right-0 z-50 h-screen overflow-y-auto;
  background-color: rgba(0, 0, 0, 0.3);
}

#modal-bg.scroll-body {
  @apply absolute top-0 left-0 right-0 z-50;
  height: auto;
  overflow: hidden;
}

@media print {
  #modal-bg {
    background-color: white;
  }
}
#modal-bg .modal {
  @apply flex justify-center items-start m-auto max-w-screen-sm;
}
#modal-bg > .modal > .wrapper > .container {
  @apply bg-white p-4 rounded-md;
}
#modal-bg > .modal > .wrapper > .container .close-btn {
  @apply w-8 h-8 border-gray-400 rounded-md text-center text-lg absolute top-0 right-0 bg-white flex items-center justify-center shadow-md;
  transform: translate(0.5rem, -0.5rem);
}
#modal-bg .modal {
  animation: fade-slide-modal 0.5s ease-out;
}

#modal-bg .items-center {
  align-items: center;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease-in;
}

@keyframes fade-slide-modal {
  from {
    opacity: 0;
    transform: translateY(-200px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
