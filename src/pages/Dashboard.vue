<template>
  <div class="dashboard q-px-md">
    <!-- <h2 class="text-h5">Dashboard</h2> -->

    <q-tabs
      v-model="active"
      dense
      align="left"
      active-color="primary"
      narrow-indicator
    >
      <q-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :name="tab"
        :label="tab"
      />
    </q-tabs>

    <q-separator class="q-mt-none" />

    <q-tab-panels v-model="active" animated>
      <q-tab-panel
        name="Basic"
        style="height: 600px"
        class="flex no-wrap justify-between bg-grey-2"
      >
        <Statistics
          class="left relative-position bg-white flex q-mr-md q-pt-md"
          style="flex: 5; border-radius: 20px"
        />

        <div class="right flex column" style="flex: 2">
          <div
            class="top q-mb-sm q-pa-md"
            style="flex: 1; border-radius: 20px; background-color: #4a44ed"
          >
            <h3 class="text-subtitle2 text-white">Service level</h3>
            <p class="text-grey-5">
              Average waiting time
              <q-icon
                name="fa-solid fa-right-left"
                class="text-grey-5 q-ml-sm"
                style="font-size: 12px; vertical-align: middle"
              />
            </p>
            <p
              class="text-white"
              style="font-size: 28px; line-height: 1; font-weight: 500"
            >
              3.5s
            </p>
            <div class="bar q-mt-xl flex items-end justify-around">
              <div
                v-for="(item, i) in 11"
                :key="i"
                class="bg-grey-2"
                :style="{
                  width: '8px',
                  height: 55 + Math.floor(Math.random() * 36) + 'px',
                  borderRadius: '30px',
                  opacity: i >= 4 && i <= 7 ? 1 : 0.3,
                }"
              ></div>
            </div>
          </div>

          <Satisfaction
            class="bottom bg-white q-pt-sm q-pl-sm q-pr-sm"
            style="flex: 1; border-radius: 20px"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DashBoard",
  components: {},
});
</script>

<script setup>
import Statistics from "components/charts/Statistics.vue";
import Satisfaction from "components/charts/Satisfaction.vue";

const tabs = ref([
    "Basic",
    "Conversation",
    "Customer",
    "Work order",
    "Staff",
    "Chat",
  ]),
  active = ref("Basic");
</script>

<style lang="scss" scoped>
.q-tabs {
  .q-tab {
    text-transform: none;
  }
}
</style>
