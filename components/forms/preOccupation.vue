<template>
  <div class="pre-occupation space-y-4">
    <locationSelect :existing-values="values" disabled="true" />

    <div
      v-for="(section, i) in form"
      :key="i"
      class="form-section space-y-4 px-8"
    >
      <h2 class="font-bold text-red text-2xl">
        {{ i + 1 }}. {{ section.title }}
      </h2>
      <formulate-input
        v-for="input in section.inputs"
        :key="input.name"
        value="na"
        type="radio"
        :name="section.name + '_' + input.name"
        :label="input.label"
        :options="getOptions()"
        validation="required"
        :validation-messages="validationMessages"
        class="avoid-break"
      />
      <div
        v-for="(subsection, j) in section.subsections"
        :key="subsection.title"
        class="space-y-2"
      >
        <h3 class="font-bold text-red text-xl">
          {{ i + 1 }}{{ alphabet[j] }} {{ subsection.title }}
        </h3>
        <formulate-input
          v-for="input in subsection.inputs"
          :key="input.name"
          value="na"
          type="radio"
          :name="section.name + '_' + subsection.name + '_' + input.name"
          :label="input.label"
          :options="getOptions()"
          validation="required"
          :validation-messages="validationMessages"
        />
      </div>
      <hr />
    </div>

    <siteManagerSignOff :existing-values="values" />
    <hr />
    <userSignOff :existing-values="values">
      <slot name="submit-button"></slot>
    </userSignOff>
  </div>
</template>

<script>
import formBase from "./mixins/formBase.js";
import { alphabet } from "@/functions/helpers.js";

export default {
  name: "PreOccupation",
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
      alphabet,
      form: [
        {
          title: "External Gas",
          name: "gas",
          inputs: [
            {
              name: "box",
              label:
                "Gas box in good condition? Lid/door, opening/closing correctly?"
            },
            {
              name: "bonded",
              label: "Gas bonded?"
            },
            {
              name: "pipe_sleeve",
              label: "Pipe sleeved & sealed correctly?"
            }
          ]
        },
        {
          title: "External Rainwater",
          name: "rainwater",
          inputs: [
            {
              name: "downpipes",
              label: "Downpipes ﬁtted & clipped correctly? (Using BLACK caps)"
            },
            {
              name: "gutter",
              label:
                "Gutter fully installed?  (No Parts missed) (Including checking Garage guttering)"
            },
            {
              name: "discharge_cage",
              label: "Discharge cage ﬁtted correctly?"
            },
            {
              name: "pressure_relief",
              label: "Pressure relief valve ﬁtted with mushroom?"
            },
            {
              name: "outside_tap",
              label: "Outside tap installed"
            }
          ]
        },
        {
          title: "Kitchen / Utility",
          name: "kitchen",
          inputs: [
            {
              name: "labelled",
              label: "All clipped, Sealed, Clean and Tidy pipework, labelled?"
            },
            {
              name: "connection",
              label: "Appliance connections accessible?"
            },
            {
              name: "taps",
              label: "Taps secure, plugs fitted, overflow working?"
            },
            {
              name: "hobs",
              label: "Gas hob working?"
            },
            {
              name: "appliance",
              label:
                "Applicance upstands & valves not under sink, located remotely?"
            }
          ]
        },
        {
          title: "Boiler",
          name: "boiler",
          inputs: [
            {
              name: "level",
              label:
                "Level, clearance distance correct, commission label fitted?"
            },
            {
              name: "flue",
              label:
                "Flue accessible for future servicing. Inspection hatches fitted where required, etc?"
            },
            {
              name: "fuse",
              label: "Correct 3 amp fuse in spur?"
            }
          ]
        },
        {
          title: "Heating Controls",
          name: "heating",
          inputs: [
            {
              name: "position",
              label: "Correctly positioned? Time & date set?"
            },
            {
              name: "zones",
              label:
                "Individual zones calling properly? (test one circuit at a time)"
            }
          ]
        },
        {
          title: "Radiators",
          name: "radiator",
          inputs: [
            {
              name: "level",
              label: "Installed level?"
            },
            {
              name: "pipework",
              label: "NO pipework hanging down visible?"
            },
            {
              name: "plates",
              label: "Plates behind radiator fixed and screwed correctly?"
            },
            {
              name: "lockshield",
              label:
                "All lockshield caps and TRV's installed correctly & on correct radiators?"
            },
            {
              name: "circulating",
              label:
                "Heat circulating properly in all raditors? (Vent if necessary and balance)"
            }
          ]
        },
        {
          title: "Cylinder & Zone Valves",
          name: "valves",
          inputs: [
            {
              name: "pressure",
              label: "Check heating and pressure gauge is at 1 bar?"
            },
            {
              name: "sticker",
              label: "Company details on installation sticker?"
            },
            {
              name: "tundish",
              label: "Tundish visible from the front side of cupboard?"
            },
            {
              name: "zone",
              label: "All zone valves & levers correctly labelled?"
            },
            {
              name: "pipework",
              label:
                "Pipework lagged correctly? Joints & corners taped correctly?"
            },
            {
              name: "test",
              label: "Check and test auto air vents?"
            }
          ]
        },
        {
          title: "Bathroom/s, En-Suite/s, Cloakroom/s",
          name: "bathroom",
          inputs: [],
          subsections: [
            {
              title: "W.C.'s",
              name: "wc",
              inputs: [
                {
                  name: "button",
                  label: "Flush Buttons Fitted and working correctly?"
                },
                {
                  name: "cistern",
                  label: "Cistern fills up and shuts off correctly?"
                },
                {
                  name: "seats",
                  label: "Seats fitted securely?"
                }
              ]
            },
            {
              title: "Bath and Basins",
              name: "bath",
              inputs: [
                {
                  name: "level",
                  label: "Fitted level?"
                },
                {
                  name: "hot_cold",
                  label: "Hot & Cold is working?"
                },
                {
                  name: "valves",
                  label: "Blending Valves set at 45°c?"
                },
                {
                  name: "taps",
                  label: "Tap/s secure, straight, undamaged, and NOT leaking?"
                },
                {
                  name: "pop_up",
                  label: "Pop-Up wastes working correctly?"
                },
                {
                  name: "plugs_chains",
                  label: "Plugs & Chains fitted & secure?"
                },
                {
                  name: "pipework",
                  label:
                    "Pipework & wastes installed correctly? (Rosettes fitted where required?)"
                }
              ]
            },
            {
              title: "Shower",
              name: "shower",
              inputs: [
                {
                  name: "doors",
                  label: "Doors and Screens fitted correctly?"
                },
                {
                  name: "plates",
                  label:
                    "Shower cover plates installed securely and correctly? (Check for damage)"
                },
                {
                  name: "hoses",
                  label:
                    "Shower valves, riser rails, Heads and hoses installed correctly & undamaged?"
                }
              ]
            }
          ]
        },
        {
          title: "Soil and Vent Pipes",
          name: "soil",
          inputs: [
            {
              name: "durgos",
              label: "Access Panels are installed adjacent to Durgos?"
            },
            {
              name: "svp",
              label: "SVP pipe connected in loft space to tile vent?"
            }
          ]
        }
      ],
      validationMessages: {
        required: "This field is required"
      }
    };
  },
  methods: {
    getOptions() {
      return {
        yes: "Yes",
        no: "No",
        na: "N/A"
      };
    }
  }
};
</script>

<style lang="css">
.pre-occupation .formulate-input .formulate-input-wrapper > * ~ * {
  margin-top: 0.25rem;
}
</style>
