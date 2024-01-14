<template>
  <div class="login-page page-red flex flex-col">
    <header class="text-white text-center mb-8 mt-6">
      <h1 class="text-4xl font-bold">Client</h1>
      <small>Plumbing & Heating (Contractors) LTD</small>
    </header>
    <div class="content h-full flex-1 flex flex-col">
      <div v-if="errors && errors.length" class="errors text-center">
        <p v-for="error in errors" :key="error.id">{{ error.message }}</p>
      </div>
      <FormulateForm
        v-if="allowSignUp"
        v-model="formValues"
        @submit.prevent="submitHandler"
      >
        <h2 class="form-title">Register</h2>
        <FormulateInput
          type="email"
          name="email"
          label="email"
          validation="required|email"
        />
        <FormulateInput type="text" name="username" label="username" />
        <FormulateInput
          type="password"
          name="password"
          label="password"
          validation="required"
        />
        <FormulateInput
          name="password_confirm"
          type="password"
          label="Confirm your password"
          placeholder="Confirm password"
          validation="required|confirm"
          validation-name="Confirmation"
        />
        <FormulateInput
          type="number"
          name="gasNumber"
          label="Gas Number"
          validation="required"
        />
        <FormulateInput type="submit" label="Register" />
      </FormulateForm>

      <FormulateForm
        v-model="loginValues"
        class="w-full mx-auto max-w-screen-sm px-16 flex-1 flex flex-col content-center justify-center space-y-6"
        @submit="userLogin"
      >
        <FormulateInput
          class="form-input"
          type="email"
          name="identifier"
          placeholder="Email"
          validation="required|email"
        />
        <FormulateInput
          class="form-input"
          type="password"
          name="password"
          placeholder="Password"
          validation="required"
        />
        <FormulateInput type="submit" label="Sign in" />
      </FormulateForm>
      <div
        class="forgot-password text-white p-4 flex-1 flex justify-center items-center text-center"
      >
         Forgot password?
      </div>
    </div>
    <footer>
      <div class="temp w-full flex items-center justify-center">
        <img
          class="w-16"
          src="@/assets/icons/gas-safe-login.svg"
          alt="Gas Sage Logo"
        />
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  auth: false,
  name: "Login",
  components: {},
  data() {
    return {
      allowSignUp: false,
      formValues: {},
      loginValues: {},
      errors: []
    };
  },
  mounted() {
    axios.defaults.baseURL = "http://localhost:1337";
  },
  methods: {
    submitHandler(data) {
      console.log("post to api", data);
      this.errors = [];
      axios
        .post("/auth/local/register", data)
        .then((response) => {
          // Handle success.
        })
        .catch((error) => {
          // Handle error.
          this.errors = error.response.data.message[0].messages;
          console.log("An error occurred:", error);
        });
    },
    async userLogin() {
      try {
        const response = await this.$auth.loginWith("local", {
          data: this.loginValues
        });
        this.$auth.setUser(response.data.user);

        this.$router.push({
          path: "/"
        });

        if (!response.data.user.signature) {
          this.$event.$emit("toggleSignatureModal");
        }
      } catch (err) {
        this.errors = err.response?.data?.message[0].messages;
      }
    }
  }
};
</script>

<style lang="css" scoped>
>>> .form-input .formulate-input-label {
  @apply text-white;
}

>>> .formulate-input-error {
  @apply text-black text-sm mt-2;
}

>>> .form-input input {
  @apply text-white bg-transparent pr-3 py-2 border-b-2 w-full;
  outline: none;
}
>>> .form-input input::placeholder {
  color: white;
  opacity: 1; /* Firefox */
}
>>> .formulate-input-element--submit button {
  @apply bg-white px-10 py-2 text-red mx-auto block;
  outline-color: white;
}
</style>
