<script setup lang="ts">
import { ref } from "vue";
const mediaSocial = ref(["Facebook"]);
const options = ref(["Google", "Facebook", "Twitter", "Apple", "Oracle"]);
const checkBox = ref(false);
</script>

<template>
  <div class="main-container py-4">
    <div
      class="w-full text-gray-400 capitalize h-full text-base px-2 lg:p-0 lg:text-2xl font-semibold leading-8 flex items-center justify-start gap-2 lg:gap-3"
    >
      <RouterLink
        to="/application-programs"
        class="flex items-center capitalize gap-2 hover:text-primary transition-all duration-200"
      >
        <q-icon class="text-xl" name="fa-solid fa-arrow-left" />

        <span>Application Programs</span>
      </RouterLink>

      <span>/</span>

      <RouterLink
        to="/application-programs/campaign"
        class="hover:text-primary transition-all duration-200"
      >
        <span>Campaign</span>
      </RouterLink>

      <span>/</span>

      <RouterLink :to="$route.path" class="text-primary">
        <span>Campaign setting</span>
      </RouterLink>
    </div>

    <div class="grid mt-5 p-9 h-100 rounded-xl bg-white grid-cols-1 gap-5">
      <div class="">
        <p class="text-2xl font-semibold">Campaign Setting</p>
      </div>

      <div class="container">
        <div class="grid grid-rows-1 lg:grid-rows-5 lg:grid-cols-6 gap-4">
          <div
            class="lg:row-span-3 lg:col-span-2 justify-between lg:gap-40 flex flex-col gap-3 order-2 lg:order-1"
          >
            <div class="flex flex-col gap-5">
              <div class="flex flex-col gap-2">
                <p class="text-[#374151] text-sm font-medium">Title</p>
                <q-input dense label="Enter Title Here" outlined />
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-[#374151] text-sm font-medium">Channel</p>
                <q-select
                  dense
                  multiple
                  outlined
                  :options="options"
                  stack-label
                  v-model="mediaSocial"
                >
                  <template v-slot:selected-item="scope">
                    <q-chip
                      removable
                      dense
                      @remove="scope.removeAtIndex(scope.index)"
                      :tabindex="scope.tabindex"
                      square
                      color="cyan"
                      text-color="white"
                    >
                      {{ scope.opt }}
                    </q-chip>
                  </template>
                </q-select>

                <div class="flex items-center gap-2">
                  <q-checkbox v-model="checkBox" />
                  <span class="font-medium text-sm text-[#444444]">
                    Select All Channel
                  </span>
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <p class="text-[#374151] text-sm font-medium">Recipients</p>
                <span class="text-[#2E2E3A66]/40 text-[12px]">
                  Total Recipients: 0
                </span>
                <q-select
                  dense
                  multiple
                  outlined
                  :options="options"
                  stack-label
                  v-model="mediaSocial"
                >
                  <template v-slot:selected-item="scope">
                    <q-chip
                      removable
                      dense
                      @remove="scope.removeAtIndex(scope.index)"
                      :tabindex="scope.tabindex"
                      square
                      color="cyan"
                      text-color="white"
                    >
                      {{ scope.opt }}
                    </q-chip>
                  </template>
                </q-select>
              </div>

              <div class="flex flex-col gap-1">
                <p class="text-[#374151] text-sm font-medium">Schedule</p>
                <q-select
                  dense
                  multiple
                  outlined
                  :options="options"
                  stack-label
                  v-model="mediaSocial"
                >
                  <template v-slot:selected-item="scope">
                    <q-chip
                      removable
                      dense
                      @remove="scope.removeAtIndex(scope.index)"
                      :tabindex="scope.tabindex"
                      square
                      color="cyan"
                      text-color="white"
                    >
                      {{ scope.opt }}
                    </q-chip>
                  </template>
                </q-select>
              </div>

              <div class="flex flex-col gap-1">
                <p class="text-[#374151] text-sm font-medium">
                  Send a test message
                </p>
                <span class="text-[#2E2E3A66]/40 text-[12px]">
                  Test your message before sending to your recipients
                </span>
                <q-select
                  dense
                  multiple
                  outlined
                  :options="options"
                  stack-label
                  v-model="mediaSocial"
                >
                  <template v-slot:selected-item="scope">
                    <q-chip
                      removable
                      dense
                      @remove="scope.removeAtIndex(scope.index)"
                      :tabindex="scope.tabindex"
                      square
                      color="cyan"
                      text-color="white"
                    >
                      {{ scope.opt }}
                    </q-chip>
                  </template>
                </q-select>
              </div>

              <div>
                <button
                  class="bg-[#E0E7FF] text-primary rounded-lg text px-2 py-[5px]"
                >
                  Send Text Message
                </button>
              </div>
            </div>

            <div class="w-full flex justify-center">
              <q-btn color="primary" label="Add Action" />
            </div>
          </div>
          <div class="lg:col-span-4 bg-red-500 order-1 lg:order-2">02</div>
          <div class="lg:col-span-4 bg-red-500 order-3">03</div>
        </div>
      </div>
    </div>
  </div>
</template>
