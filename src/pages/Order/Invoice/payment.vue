<script setup lang="ts">
import { ref, computed } from "vue";
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
const setAsDefault = ref(false);
const cardNumber = ref("");
const mmYY = ref("");
const vcc = ref("");
const paymentMethod = ref(false);
const newCard = ref(false);
const paymentOptions = ref([
  {
    text: "Credit Card",
    value: "creditCard",
    img: Visa,
    active: false,
    status: false,
  },
  {
    text: "WeChat Pay",
    value: "weChatPay",
    img: WeChatPay,
    active: true,
    status: false,
  },
  {
    text: "Atome",
    value: "atome",
    img: Atome,
    active: true,
    status: false,
  },
  {
    text: "Qr",
    value: "qr",
    img: Qr,
    active: false,
    status: false,
  },
  {
    text: "Alipay HK",
    value: "alipay",
    img: AliPay,
    active: true,
    status: false,
  },
]);
const availablePayment = computed(() =>
  paymentOptions.value.filter((item) => item.active)
);
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
          <div class="q-pa-md">
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
                    <div
                      class="bg-white divide-y divide-slate-300 gap-3 flex flex-col p-4 drop-shadow-xl rounded-lg"
                    >
                      <div
                        v-for="(payment, index) in availablePayment"
                        :key="index"
                        class="flex items-center pt-3 justify-between"
                      >
                        <div class="w-8">
                          <img :src="payment.img" alt="" />
                        </div>
                        <div>
                          <p class="">
                            {{ payment.text }}
                          </p>
                        </div>
                        <div>
                          <q-btn
                            flat
                            round
                            color="blue-grey-11"
                            icon="delete"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-center mt-3">
                      <q-btn
                        @click="paymentMethod = !paymentMethod"
                        flat
                        color="primary"
                        label="Add payment method"
                      />
                    </div>
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
                    <div class="grid gap-3 grid-cols-6">
                      <div class="col-span-3">
                        <q-input
                          v-model="cardNumber"
                          dense
                          outlined
                          label="Card Number"
                          mask="card"
                          fill-mask
                        />
                      </div>
                      <div class="col-span-2">
                        <q-input
                          dense
                          v-model="mmYY"
                          outlined
                          label="MM/YY"
                          mask="##/##"
                          fill-mask
                        />
                      </div>
                      <div class="col-span-1">
                        <q-input
                          dense
                          v-model="vcc"
                          outlined
                          label="CVV"
                          mask="###"
                          fill-mask
                        />
                      </div>
                    </div>
                    <div class="flex mt-3 items-center justify-end gap-3">
                      <q-btn
                        @click="newCard = !newCard"
                        flat
                        color="primary"
                        class="p-0 text-xs"
                        label="add new card"
                      />
                      <q-checkbox
                        size="xs"
                        v-model="setAsDefault"
                        val="xs"
                        label="Set as default"
                      />
                    </div>
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
                    <q-checkbox size="xs" val="xs" label="Set as default" />
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

    <!-- add payment method -->

    <q-dialog v-model="paymentMethod">
      <div class="rounded-2xl bg-white py-10 px-16">
        <div class="">
          <div class="text-h6">Payment Method for this invoice</div>
          <div class="text-xs font-thin capitalize">
            customize payment methods in invoice
          </div>
        </div>

        <div class="flex mt-5 flex-col gap-4">
          <div class="flex flex-col gap-3">
            <div>
              <div class="w-2/3">
                <p class="capitalize border-b-2 pb-2">
                  available for this invoice
                </p>
              </div>

              <div class="flex flex-col">
                <div
                  v-for="(item, index) in paymentOptions.filter(
                    (data) => data.active
                  )"
                  :key="index"
                  class="flex mt-3 items-center gap-10"
                >
                  <q-toggle
                    v-model="fourth"
                    checked-icon="check"
                    color="primary"
                    unchecked-icon="clear"
                  />
                  <img :src="item.img" class="w-6" alt="" />
                  <p>
                    {{ item.text }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div class="w-2/3">
                <p class="capitalize border-b-2 pb-2">
                  unavailable for this invoice
                </p>
              </div>

              <div class="flex flex-col">
                <div
                  v-for="(item, index) in paymentOptions.filter(
                    (data) => !data.active
                  )"
                  :key="index"
                  class="flex mt-3 items-center gap-10"
                >
                  <q-toggle
                    v-model="item.status"
                    checked-icon="check"
                    color="primary"
                    unchecked-icon="clear"
                  />
                  <img :src="item.img" class="w-6" alt="" />
                  <p>
                    {{ item.text }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <q-btn
                v-close-popup
                class="rounded-lg border-2 border-dotted"
                color="primary"
                outline
                >cancel</q-btn
              >
              <q-btn color="primary"> Save </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-dialog>

    <!-- add new card -->
    <q-dialog v-model="newCard">
      <div class="rounded-2xl bg-white py-10 px-7 w-[800px]">
        <q-form>
          <label for="number" class="text-xs capitalize"> Card Number </label>

          <q-input id="number" outlined dense class="mt-2" />

          <label for="number" class="text-xs capitalize"> name on card </label>

          <q-input id="number" outlined dense class="mt-2" />

          <div class="flex mt-4 justify-between">
            <div>
              <label for="number" class="text-xs capitalize">
                valid till
              </label>

              <q-input
                dense
                class="mt-4"
                outlined
                label="MM/YY"
                mask="##/##"
                fill-mask
              />
            </div>
            <div>
              <label for="number" class="text-xs capitalize">
                CVV or CVC
              </label>

              <q-input
                dense
                class="mt-4"
                outlined
                label="CVV"
                mask="###"
                fill-mask
              />
            </div>
          </div>
        </q-form>

        <div class="flex justify-end mt-10 gap-3">
          <q-btn
            v-close-popup
            class="rounded-lg border-2 border-dotted"
            color="primary"
            outline
            >cancel</q-btn
          >
          <q-btn color="primary"> Save </q-btn>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>
.q-tabs {
  .q-tab {
    text-transform: none;
  }
}
</style>
