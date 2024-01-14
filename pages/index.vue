<template>
  <div class="welcome-page page-red flex flex-col">
    <header class="header">
      <h1 class="">CLIENT</h1>
      <small>Plumbing & Heating (Contractors) LTD</small>
    </header>
    <div
      class="content single-column h-full w-full flex-1 flex flex-col flex-wrap max-w-screen-sm mx-auto"
    >
      <div class="menu w-full flex items-center wrap flex-col">
        <ul class="form-list space-y-6">
          <li
            v-for="form in formList"
            :key="form.key"
            class="form-item flex items-center rounded-md bg-white shadow-md"
            :data-warning="
              form.warning && $store.getters['user/oldLadders'].length > 0
            "
          >
            <nuxt-link
              :to="`/form/${form.link || form.id}`"
              class="flex items-center w-full p-4"
              ><img
                :src="require(`~/assets/icons/${form.icon}`)"
                class="w-10 mr-3"
                :alt="form.name"
              />
              <div class="flex flex-col">
                <span class="text-lg leading-tight font-bold">{{
                  form.name
                }}</span>
                <small v-if="form.subheading" class="text-gray-600">{{
                  form.subheading
                }}</small>
              </div>
            </nuxt-link>
          </li>
          <template v-if="NODE_ENV == 'development'">
            <li>
              <nuxt-link to="/submissions">Form List</nuxt-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <footer
      class="text-white text-center my-4 flex flex-col space-y-2 items-center"
    >
      <small> Logged in as {{ $store.getters["user/name"] }}</small>
      <div class="flex">
        <button
          class="px-2 py-1 text-sm uppercase"
          @click="toggleSignatureModal"
        >
          Edit Profile
        </button>
        <button class="px-2 py-1 text-sm uppercase" @click="logout">
          Logout
        </button>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "Welcome",
  fetch() {
    // return this.$store.dispatch("user/getLadderList");
  },
  data() {
    return {
      NODE_ENV: process.env.NODE_ENV
    };
  },
  computed: {
    ...mapState("site", {
      formList(state, something, root) {
        return state.formList
          .filter((form) => !form.hidden)
          .filter((form) => {
            const { user } = this.$auth.$state;
            return user && form.requires
              ? form.requires.includes(user.role.name.toLowerCase()) ||
                  user.access_toolbox_talks
              : true;
          });
      }
    })
  },
  methods: {
    toggleSignatureModal() {
      this.$event.$emit("toggleSignatureModal");
    },
    logout() {
      try {
        this.$auth.logout();
        this.$router.push("/login");
      } catch (error) {}
    }
  }
};
</script>

<style lang="css">
.single-column {
  max-width: 68.3958275%;
  min-width: 242px;
}
.form-item {
  width: 100%;
}
.form-item[data-warning] {
  position: relative;
  overflow: hidden;
  padding-right: 2rem;
}
.form-item[data-warning]::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  background-image: url("~assets/icons/warning.svg");
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
  font-weight: bold;
  text-align: center;
  width: 2rem;
  height: 100%;
  background-color: #f7c412;
}
.header {
  @apply sticky p-5 mb-5 text-center text-white top-0;
  background-color: rgb(205, 46, 57);
  background: linear-gradient(rgb(205, 46, 57), rgba(205, 56, 67, 0.97));
}
.welcome-page {
}
</style>
