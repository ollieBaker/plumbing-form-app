<template>
  <div class="toolbox-talk-form space-y-4">
    <div class="existing-talks form-section px-8 no-print">
      <label for="talks-list" class="font-bold text-lg"
        >Select Existing Talk:</label
      >
      <select id="talks-list" name="talks-list" @change="fillTalkValues">
        <option value="-" placeholder selected disabled>- select -</option>
        <option v-for="option in talks" :key="option.id" :value="option.id">{{
          option.name
        }}</option>
      </select>
    </div>

    <div class="form-section space-y-4 px-8">
      <formulate-input
        v-model="topic"
        type="textarea"
        name="topic"
        label="Topic of Talk"
        validation="required"
      />
      <a
        v-if="selectedTalk && documentUrl"
        :href="documentUrl"
        target="_blank"
        class="p-1"
      >
        Document For {{ selectedTalk.name }}
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="inline-icon"
          >
            <path
              d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm76.45 211.36l-96.42 95.7c-6.65 6.61-17.39 6.61-24.04 0l-96.42-95.7C73.42 337.29 80.54 320 94.82 320H160v-80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v80h65.18c14.28 0 21.4 17.29 11.27 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"
            />
          </svg>
        </span>
      </a>
    </div>
    <locationSelect :hide-elements="['plot']" :existing-values="values">
      <formulate-input
        type="date"
        name="talk_date"
        label="Date"
        validation="required"
      />
    </locationSelect>
    <div class="form-section space-y-4 px-8">
      <h2 class="text-red font-bold text-xl h-8">Attendees</h2>
      <ul>
        <li
          v-for="attendee in attendees.map((attendees) =>
            allUsers.find((user) => user.id == attendees)
          )"
          :key="attendee.id"
        >
          <div class="attendee space-x-2 h-12">
            <div class="name space-x-2">
              <p>{{ attendee.firstName }} {{ attendee.lastName }}</p>
              <button
                type="button"
                class="no-print"
                @click="removeUser(attendee)"
              >
                ×
              </button>
            </div>
            <img
              v-show="attendee.signature"
              :src="createImageURL(attendee)"
              alt="Users Signature"
            />
          </div>
        </li>
      </ul>
      <formulate-input
        v-model="attendees"
        class="formulate-hidden"
        name="attendees"
        type="checkbox"
        validation="required"
        hidden
      />
      <formulate-input
        v-if="selectedTalk && selectedTalk.document"
        v-model="selectedTalk.document"
        class="formulate-hidden"
        name="document"
        type="text"
        hidden
      />
      <hr />
      <div class="no-print">
        <button type="button" @click="onAttendeeAdded">
          Add attendee
        </button>
        <select id="user-list" v-model="selectedUser" @change="addAttendee">
          <option disabled selected value="">Select a name</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
      </div>
      <imgageInput :existing-image="photo" @imageUploaded="photo = $event.id" />
      <formulate-input v-model="photo" type="text" name="photo" hidden="true" />
      <hr class="hr-red" />
    </div>

    <userSignOff :existing-values="values">
      <slot name="submit-button"></slot>
    </userSignOff>
  </div>
</template>

<script>
import { mapState } from "vuex";
import imgageInput from "./elements/imageInput.vue";
import formBase from "./mixins/formBase.js";
import { createImageURL } from "@/functions/helpers.js";

export default {
  name: "ToolboxTalkForm",
  components: {
    imgageInput
  },
  mixins: [formBase],
  async fetch() {
    const getTalks = this.$axios
      .get("/toolbox-talks")
      .then(({ data }) => (this.talks = data))
      .catch((e) => console.log(e));
    await Promise.all([this.$store.dispatch("site/getUsers"), getTalks]);
  },
  data() {
    return {
      talks: [],
      selectedTalk: null,
      topic: "",
      mode: "selecting", // selecting / idle
      photo: null,
      selectedUser: "",
      attendees: []
    };
  },
  computed: {
    ...mapState("site", {
      allUsers: (state) => state.users,
      users(state, { usersWithoutBlocked }) {
        return usersWithoutBlocked.filter(
          (user) => !this.attendees.includes(user.id)
        );
      }
    }),
    documentUrl() {
      return this.selectedTalk
        ? createImageURL(this.selectedTalk.document)
        : null;
    }
  },
  created() {
    this.useExistingValues();
  },
  methods: {
    useExistingValues() {
      if (this.values) {
        const { topic, photo, attendees, document } = this.values;
        this.topic = topic;
        this.attendees = attendees ? attendees.map(({ id }) => id) : [];
        this.photo = photo;
        this.selectedTalk = { name: "talk", document };
      }
    },
    addAttendee({ target }) {
      const id = parseInt(target.value);
      if (!this.attendees.includes(id)) {
        this.attendees.push(id);
      }
      this.mode = "idle";
      this.selectedUser = "";
    },
    onAttendeeAdded(e) {
      this.mode = "selecting";
      this.selectedUser = "";
      console.log(e);
    },
    removeUser({ id }) {
      const index = this.attendees.indexOf(id);
      this.attendees.splice(index, 1);
      this.selectedUser = "";
    },
    createImageURL({ signature }) {
      if (signature) {
        return createImageURL(signature.signature);
      }
    },
    fillTalkValues({ target }) {
      console.log("talk:", target.value);
      const id = parseInt(target.value);
      this.selectedTalk = this.talks.find((talk) => talk.id === id);
      this.topic = this.selectedTalk.topic_of_talk;
    }
  }
};
</script>

<style lang="css">
.attendee {
  opacity: 1;
  transition: opacity 1s;
  @apply flex flex-row flex-no-wrap items-center justify-between;
}
.attendee > .name {
  @apply flex flex-row flex-no-wrap items-center justify-start;
}
.attendee > .name > p {
  @apply font-bold;
}
.attendee > img {
  @apply h-12;
}
.attendee > div > button {
  @apply w-4;
}
</style>
