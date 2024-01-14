<template>
  <div class="default-layout">
    <nuxt class="pb-8" />
    <portal-target name="modal" multiple>
    </portal-target>
    <signatureModal :show="showSignatureModal" @close="toggleSignatureModal" />
  </div>
</template>
<script>
import signatureModal from "@/components/modals/signatureModal.vue";
export default {
  components: {
    signatureModal
  },
  async fetch() {
    const { loggedIn, user } = this.$store.state.auth;
    if (!loggedIn) return;

    const { signature } = user;

    if (signature) {
      const id = signature.id ? signature.id : signature;
      console.log("Signature is ID", signature);
      const status = await this.$store
        .dispatch("user/getSignature", id)
        .catch((e) => console.log(e));
      if (!this.showSignatureModal && status === "no-signature") {
        this.toggleSignatureModal();
      }
    }
  },
  data() {
    return {
      showSignatureModal: false
    };
  },
  mounted() {
    this.$event.$on("toggleSignatureModal", this.toggleSignatureModal);
    const { user } = this.$store.state.auth;
    const noSig = user && !user.signature;
    if (!this.showSignatureModal && noSig) {
      this.toggleSignatureModal();
    }
  },
  beforeDestroy() {
    this.$event.$off("toggleSignatureModal", this.toggleSignatureModal);
  },
  methods: {
    toggleSignatureModal() {
      this.showSignatureModal = !this.showSignatureModal;
    }
  }
};
</script>

<style>
html {
  font-size: 16px;
  /* word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;*/
  color: rgb(35, 31, 32);
}

#print-container .no-print,
#print-container .no-print * {
  display: none !important;
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
  }
  img {
    page-break-inside: avoid;
  }
  html {
    font-size: 12px;
  }
  .formulate-input-element[data-type]::before {
    display: none !important;
  }

  .no-print {
    display: none !important;
  }

  .avoid-break {
    position: relative;
    display: block !important;
    page-break-before: always;
    page-break-after: auto;
    page-break-inside: avoid;
    -webkit-region-break-inside: avoid;
  }

  .print-inline {
    display: inline;
  }
  .formulate-input-wrapper {
    display: inline;
  }

  .user-sign-off .signature {
    max-width: 75%;
    margin: 0 auto;
  }
}

.inline-icon {
  @apply w-4 inline;
}

select,
input {
  @apply relative appearance-none h-10 bg-white border-black rounded-md p-2 w-full;
}

select {
  @apply truncate max-w-full pr-6;
}

.formulate-input[data-classification="select"]
  select[data-placeholder-selected] {
  color: #a8a8a8;
}

.formulate-input .formulate-input-wrapper label {
  @apply font-semibold text-lg leading-normal;
}
.formulate-input select {
  height: 2.625rem;
}

select,
input[type="date"],
input[type="number"],
input[type="text"] {
  @apply rounded-md border;
  border-color: rgb(102, 102, 102);
}

.formulate-input-element[data-type="select"],
.formulate-input-element[data-type="date"] {
  position: relative;
}

.formulate-hidden :not(.formulate-input-errors, .formulate-input-error) {
  display: none;
}

.formulate-input-element[data-type="select"]::before,
.formulate-input-element[data-type="date"]::before {
  pointer-events: none;
  content: "";
  background-image: url("~assets/arrow.svg");
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: 50%;
  width: 20px;
  padding: 1rem 1.5rem;
  height: 100%;
  z-index: 1;
  @apply absolute top-0 right-0;
}

/* make the native arrow invisible and stretch it over the whole field so you can click anywhere in the input field to trigger the native datepicker*/
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  color: transparent;
  background: transparent;
}

@media screen and (min-width: 768px) {
  input[type="date"]::-webkit-calendar-picker-indicator {
    left: 95px;
  }
}

/* adjust increase/decrease button */
input[type="date"]::-webkit-inner-spin-button {
  visibility: hidden;
}

/* adjust clear button */
input[type="date"]::-webkit-clear-button {
  z-index: 1;
}

input[type="email"],
input[type="password"] {
  @apply rounded-none border-white;
}

body.no-scroll {
  height: 100vh;
  overflow-y: hidden;
}

.scroll-wrap {
  padding-left: calc(100vw - 100%);
}

.default-layout div[class*="-page"] {
  min-height: 100vh;
  /* padding: 1.5rem; */
}

.default-layout > .page-red {
  background: linear-gradient(rgb(205, 46, 57), rgb(222, 83, 91));
}

.btn-red {
  @apply text-white bg-red px-4 py-2 font-semibold text-sm tracking-wide;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fade-in {
  animation: fadein 0.5s;
}

.bg-red {
  background: linear-gradient(
    to right bottom,
    rgb(205, 46, 57),
    rgb(222, 83, 91)
  );
}

h1 {
  @apply text-white text-3xl font-bold text-center;
}

.icon {
  @apply w-10 inline;
}

.formulate-input-wrapper input,
select,
textarea {
  @apply w-full px-4 py-2;
  /* outline: 1px solid black; */
}

.formulate-input[disabled="disabled"],
button[disabled="disabled"] {
  opacity: 0.7;
  cursor: auto;
}

.formulate-input-wrapper input[type="radio"] {
  @apply w-auto p-1;
}

.formulate-input-group {
  @apply flex;
}
.formulate-input-group > * + * {
  @apply pl-4;
}

.hr-red {
  border-top-width: 2px;
  border-color: rgb(205, 46, 57);
}

.formulate-input-error {
  @apply text-red;
}

select,
input[type="date"] {
  @apply bg-white;
}

.formulate-input[data-classification="box"] .formulate-input-wrapper {
  @apply flex flex-row-reverse justify-end items-center;
}
.formulate-input[data-classification="box"]
  .formulate-input-wrapper
  .formulate-input-element--checkbox {
}
.formulate-input[data-classification="box"]
  .formulate-input-wrapper
  .formulate-input-element--checkbox
  input {
  margin-left: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: red;
  appearance: checkbox !important;
}

.formulate-input textarea {
  @apply border rounded-md border-black h-32;
}

.formulate-input-element input[type="radio"] {
  position: absolute;
  left: -999px;
}
.formulate-input-element--radio {
  overflow: hidden;
  display: flex;
  align-items: center;
}
.formulate-input-element--radio .formulate-input-element-decorator {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid black;
  position: relative;
}

.formulate-input-element--radio .formulate-input-element-decorator::before {
  content: "";
  display: block;
  background-size: contain;
  background-position: right;
  width: calc(100% - 0.375rem);
  height: calc(100% - 0.375rem);
  box-sizing: border-box;
  position: absolute;
  top: 0.1875rem;
  left: 0.1875rem;
}
input[type="radio"]:checked ~ .formulate-input-element-decorator {
}
input[type="radio"]:checked ~ .formulate-input-element-decorator::before {
  background-color: rgb(215, 9, 36);
  border-radius: 1em;
}

.sign-off {
}
.sign-off .title {
  color: white;
  text-align: center;
  @apply p-4 text-2xl my-6 font-bold;
  background-color: rgb(13, 13, 13);
}
</style>
