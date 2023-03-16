<script setup lang="ts">
import { ref } from "vue";

const check = ref(false);
</script>

<template>
  <div
    class="w-full flex flex-col lg:flex-row min-h-screen lg:h-full justify-between"
  >
    <div class="bg-white py-16 px-5 rounded-2xl w-full lg:w-1/2">
      <div class="w-full flex flex-col">
        <div class="pb-3">
          <p class="text-capitalize text-[#111827] font-semibold text-2xl">
            Payment Collection
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col pl-10 py-16 w-full lg:w-1/2">
      <p class="font-semibold capitalize text-2xl tetx-[#111827]">preview</p>

      <div class="flex gap-10 flex-col">
        <div class="flex justify-end">
          <q-btn push color="primary" icon-right="send" label="Share via">
            <q-popup-proxy>
              <q-banner>
                <div class="flex flex-col">
                  <div class="border-b-2 flex-col flex">
                    <div class="gap-3 items-center flex">
                      <q-radio
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        size="xs"
                        v-model="send"
                        val="Email"
                        label="Email Now"
                      />

                      <q-icon
                        style="color: #ccc; font-size: 1.4em"
                        name="send"
                      />
                    </div>
                    <q-checkbox
                      size="xs"
                      v-model="check"
                      val="xs"
                      label="Set as default"
                    />
                  </div>

                  <div class="flex-col flex">
                    <div
                      @click="openDialog = !openDialog"
                      class="gap-3 cursor-pointer items-center flex"
                    >
                      <q-radio
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        size="xs"
                        v-model="send"
                        val="Whatsapp"
                      />
                      <span>Whatsapp </span>
                      <q-icon
                        style="color: #ccc; font-size: 1.4em"
                        name="fa-brands fa-whatsapp"
                      />
                    </div>
                  </div>
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </div>

        <div class="flex p-10 gap-10 flex-col rounded-xl bg-white">
          <div
            class="flex flex-col gap-4 p-5 bg-white drop-shadow-xl rounded-lg"
          >
            <div class="">
              <div class="grid grid-cols-2">
                <div class="">
                  <p class="text-[#111827] text-base font-semibold">
                    Company Name
                  </p>
                  <p class="text-[#111827] text-base font-semibold">Invoice</p>
                </div>
                <div class="">
                  <p class="text-black text-sm font-normal">Synque</p>
                  <p class="text-black text-sm font-normal">Inv-0006</p>
                </div>
              </div>
            </div>

            <div>
              <p class="text-xl font-semibold text-[#2E2E3A]">
                February 20, 2023
              </p>
              <p class="mt-3 cursor-pointer text-[#2E2E3A] text-xs">
                View more details <q-icon size="" name="navigate_next" />
              </p>
            </div>

            <div class="flex items-center justify-evenly">
              <div>
                <img class="w-20" src="/src/assets/images/receipt.png" alt="" />
              </div>
              <p class="text-[40px] text-[#4B44F6] font-semibold">$100.00</p>
            </div>
          </div>

          <div
            class="flex flex-col gap-4 p-5 bg-white drop-shadow-xl rounded-lg"
          >
            <div>
              <p class="text-xl font-semibold text-[#2E2E3A]">
                Choose you want to pay with
              </p>
            </div>

            <div class="flex items-center justify-evenly">
              <div>
                <img class="w-20" src="/src/assets/images/receipt.png" alt="" />
              </div>
              <p class="text-[40px] text-[#4B44F6] font-semibold">$100.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-tabs {
  .q-tab {
    text-transform: none;
  }
}
</style>
