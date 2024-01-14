<template>
  <div class="workplace-safety-inspection-form space-y-4">
    <locationSelect :hide-elements="['plot']" :existing-values="values" />

    <div
      v-for="(section, i) in form"
      :key="i"
      class="form-section space-y-4 px-8"
    >
      <h2 class="font-bold text-red text-2xl">
        {{ i + 1 }}. {{ section.title }}
      </h2>
      <div v-if="section.needsPrompt">
        1 = Excellent - 5 = Unsatisfactory
      </div>
      <formulate-input
        v-for="input in section.inputs"
        :key="input.name"
        :class="`input-${section.type}`"
        :type="input.type === 'text' ? 'textarea' : 'radio'"
        :name="section.name + '_' + input.name"
        :label="input.label || input.name"
        :options="options[input.type]"
        :validation="input.type === 'text' ? false : 'required'"
        :validation-messages="validationMessages"
      />
      <hr />
    </div>
    <userSignOff :existing-values="values">
      <slot name="submit-button"></slot>
      <p v-if="values && values['created_at']">
        Signed:
        {{ convertTimeStamp(values["created_at"]) }}
      </p>
    </userSignOff>
  </div>
</template>

<script>
import formBase from "./mixins/formBase.js";

export default {
  name: "WorkplaceSafetyInspection",
  components: {},
  mixins: [formBase],
  props: {
    values: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: [
        {
          title: "Safety Management",
          name: "safety",
          inputs: [
            {
              name: "signed_in",
              label: "Are ALL operatives signed in?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "rams_available",
              label:
                "Is a current RAMS available in site office, and have all operatives signed it?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "site_induction",
              label: "Have all operatives had a site induction",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "traffic_routes",
              label: "Are traffic routes clear?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "comments",
              label: "Comments",
              type: "text"
            }
          ]
        },
        {
          title: "Site Health and Welfare",
          name: "health",
          needsPrompt: true,
          inputs: [
            {
              name: "toilets",
              label: "Toilets",
              type: "integer"
            },
            {
              name: "first_aid",
              label: "First Aid",
              type: "integer"
            },
            {
              name: "washing",
              label: "Washing Facilities",
              type: "integer"
            },
            {
              name: "drinking",
              label: "Drinking Facilities",
              type: "integer"
            },
            {
              name: "comments",
              label: "Comments",
              type: "text"
            }
          ]
        },
        {
          title: "Works being carried out",
          name: "works",
          needsPrompt: true,
          inputs: [
            {
              name: "rams",
              label:
                "Are Risk Assesments in the RAMS, for works that are being carried out on site?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "hazards",
              label: "Have ALL hazards been identified",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "coshh",
              label:
                "Is there a COSHH assessment in the RAMS for substances being used on site?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "safe_practices",
              label: "Are general works on safe practices being observed?",
              type: "integer"
            },
            {
              name: "safe_manual_handling",
              label: "Is the manual handling good practice, being observed?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "comments",
              label: "Comments",
              type: "text"
            }
          ]
        },
        {
          title: "PPE",
          name: "ppe",
          inputs: [
            {
              name: "correctly",
              label: "Is PPE being used correctly?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "equipment",
              label: "Is the correct PPE equipment being used for tasks?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "condition",
              label: "Is the PPE in good condition?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "logo",
              label: "Is the company logo on High Visibility work wear?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "hearing",
              label: "Is hearing protection being used?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "comments",
              label: "Comments",
              type: "text"
            }
          ]
        },
        {
          title: "Fire Precautions",
          name: "fire",
          inputs: [
            {
              name: "extinguishers",
              label: "Are extinguishers adequate for the task?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "extinguishers_id",
              label: "Is the extinguishers ID number visible?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "hot_works",
              label: "Has a Hot works permit been obtained",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "comments",
              label: "Comments",
              type: "text"
            }
          ]
        },
        {
          title: "Storage Facilities",
          name: "storage",
          needsPrompt: true,
          inputs: [
            {
              name: "rams",
              label: "Are the on site RAMS available for reference?",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "policy",
              label:
                "Is the Company Health and Safety policy available for reference",
              type: "enumeration",
              enum: ["yes", "no"]
            },
            {
              name: "materials",
              label: "Are materials Stored / Stacked Correctly?",
              type: "integer"
            },
            {
              name: "comments",
              label: "Comments",
              type: "text"
            }
          ]
        },
        {
          title: "Site",
          name: "site",
          needsPrompt: true,
          inputs: [
            {
              name: "work_areas",
              label: "Are work areas tidy?",
              type: "integer"
            },
            {
              name: "traffic",
              label: "Are traffic ways clear?",
              type: "integer"
            },
            {
              name: "tidy",
              label: "Is the site tidy?",
              type: "integer"
            },
            {
              name: "comments",
              label: "Comments",
              type: "text"
            }
          ]
        }
      ],
      validationMessages: {
        required: "This question is required"
      },
      options: {
        integer: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" },
        enumeration: { yes: "Yes", no: "No" }
      }
    };
  },
  methods: {
    convertTimeStamp(val) {
      try {
        const string = new Date(val).toLocaleDateString("en-GB", {
          timeZone: "Europe/London"
        });

        return string;
      } catch (error) {}

      return val;
    }
  }
};
</script>

<style lang="css"></style>
