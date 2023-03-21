<script setup lang="ts">
import { ref } from "vue";
import useInvoice from "src/stores/modules/useInvoices";
import Visa from "src/assets/images/visa-logo.png";
import WeChatPay from "src/assets/images/WeChatPay.png";
import Atome from "src/assets/images/atome.png";
import Qr from "src/assets/images/qr.png";
import AliPay from "src/assets/images/alipay.png";

const { getInvoice, getCompany } = useInvoice();

const payment = ref("creditCard");
const firstTab = ref(true);
const secondTab = ref(false);
const paymentOptions = ref([
  {
    text: "Credit Card",
    value: "creditCard",
    img: Visa,
  },
  {
    text: "WeChat Pay",
    value: "weChatPay",
    img: WeChatPay,
  },
  {
    text: "Atome",
    value: "atome",
    img: Atome,
  },
  {
    text: "Qr",
    value: "qr",
    img: Qr,
  },
  {
    text: "Alipay HK",
    value: "alipay",
    img: AliPay,
  },
]);
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

        <div>
          <div class="q-pa-md" style="max-width: 350px">
            <q-list>
              <q-expansion-item
                group="somegroup"
                v-model="firstTab"
                hide-expand-icon
              >
                <template #header>
                  <q-item-section avatar>
                    <q-icon
                      name="check_circle"
                      :style="`color: ${
                        firstTab ? '#4B44F6' : '#ccc'
                      } ; font-size: 1.4em;`"
                    />
                  </q-item-section>

                  <q-item-section class="capitalize font-semibold">
                    request payment
                  </q-item-section>
                </template>

                <q-card>
                  <q-card-section>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Quidem, eius reprehenderit eos corrupti commodi magni
                    quaerat ex numquam, dolorum officiis modi facere maiores
                    architecto suscipit iste eveniet doloribus ullam aliquid.
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-separator />

              <q-expansion-item
                group="somegroup"
                v-model="secondTab"
                hide-expand-icon
              >
                <template #header>
                  <q-item-section avatar>
                    <q-icon
                      name="check_circle"
                      :style="`color: ${
                        secondTab ? '#4B44F6' : '#ccc'
                      } ; font-size: 1.4em;`"
                    />
                  </q-item-section>

                  <q-item-section class="capitalize font-semibold">
                    autocharge customer
                  </q-item-section>
                </template>

                <q-card>
                  <q-card-section>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Quidem, eius reprehenderit eos corrupti commodi magni
                    quaerat ex numquam, dolorum officiis modi facere maiores
                    architecto suscipit iste eveniet doloribus ullam aliquid.
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
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
                  <p class="text-black text-sm font-normal">
                    {{ getCompany.companyName }}
                  </p>
                  <p class="text-black text-sm font-normal">
                    {{ getInvoice.invoiceNumber }}
                  </p>
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
              <p class="text-[40px] text-[#4B44F6] font-semibold">
                {{ getInvoice.totalPrice.label }}
              </p>
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

            <div class="flex flex-col gap-5">
              <q-item
                v-for="(item, index) in paymentOptions"
                :key="index"
                :class="[
                  payment == item.value ? 'border-2 border-primary' : '',
                  'w-full py-0 rounded-lg',
                ]"
                tag="label"
                v-ripple
              >
                <q-item-section avatar>
                  <q-radio
                    v-model="payment"
                    :val="item.value"
                    color="primary"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="flex items-center gap-3">
                    <div>
                      <img class="w-10" :src="item.img" alt="" />
                    </div>

                    <p class="text-[#2E2E3A] font-medium text-base">
                      {{ item.text }}
                    </p>
                  </q-item-label>
                </q-item-section>
              </q-item>
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
