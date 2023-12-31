<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import useInvoice from "src/stores/modules/useInvoices";
import Visa from "src/assets/images/visa-logo.png";
import WeChatPay from "src/assets/images/WeChatPay.png";
import Receipt from "src/assets/images/receipt.png";
import AliPay from "src/assets/images/alipay.png";
import ShareButton from "src/components/Order/Invoice/shareButton.vue";
import { storeToRefs } from "pinia";

const invoice = useInvoice();
const {
  getCompany,
  getInvoice,
  getCustomer,
  getTax,
  getDiscount,
  getTotalPrice,
} = storeToRefs(invoice);

const payment = ref("creditCard");
const firstTab = ref(true);
const paymentMethod = ref(false);
const drawer = ref(false);
const shareInvoice = reactive({
  via: "Email",
  setDefault: true,
});
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

const unavailablePayment = computed(() =>
  paymentOptions.value.filter((item) => !item.active)
);

const getWidth = () => {
  if (screen.width < 450) {
    return screen.width;
  }
  return 600;
};
</script>

<template>
  <q-layout view="hHh lpR fFf" class="shadow-2">
    <q-page-container>
      <div
        class="w-full flex flex-col lg:flex-row min-h-screen lg:h-full justify-between"
      >
        <div class="bg-white py-16 px-5 rounded-2xl w-full lg:w-1/2">
          <div class="w-full flex flex-col">
            <div class="pb-3 flex items-center gap-3">
              <q-btn
                :to="{ name: 'order.invoices' }"
                flat
                round
                color="primary"
                icon="arrow_back"
              />
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

                    <q-card class="flex justify-center">
                      <q-card-section class="w-96">
                        <div
                          v-if="availablePayment.length > 0"
                          class="bg-white divide-y divide-slate-300 gap-3 flex flex-col p-4 drop-shadow-xl rounded-lg"
                        >
                          <div
                            v-for="(payment, index) in availablePayment"
                            :key="index"
                            class="flex items-center pt-3 justify-between"
                          >
                            <div class="w-6">
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
                                @click="payment.active = !payment.active"
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
                </q-list>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col pl-10 py-16 w-full lg:w-1/2">
          <p class="font-semibold capitalize text-2xl tetx-[#111827]">
            preview
          </p>

          <div class="flex gap-10 flex-col">
            <div class="flex justify-end">
              <ShareButton
                v-model:shareInvoice="shareInvoice"
                @update:via="(newValue) => (shareInvoice.via = newValue)"
                @update:setDefault="
                  (newValue) => (shareInvoice.setDefault = newValue)
                "
              />
            </div>

            <div class="flex p-10 gap-10 flex-col rounded-xl bg-white">
              <div
                class="flex flex-col gap-4 p-5 bg-white drop-shadow-xl rounded-lg"
              >
                <div class="">
                  <div class="grid grid-rows-2">
                    <div class="grid grid-cols-2">
                      <p class="text-[#111827] text-base font-semibold">
                        Company Name
                      </p>
                      <p class="text-black text-sm font-normal">
                        {{ getCompany.companyName }}
                      </p>
                    </div>
                    <div class="grid grid-cols-2">
                      <p class="text-[#111827] text-base font-semibold">
                        Invoice
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
                  <p
                    @click="drawer = !drawer"
                    class="mt-3 cursor-pointer text-[#2E2E3A] text-xs"
                  >
                    View more details <q-icon size="" name="navigate_next" />
                  </p>
                </div>

                <div class="flex items-center justify-evenly">
                  <div class="cursor-pointer">
                    <img class="w-20" :src="Receipt" alt="" />
                  </div>
                  <p class="text-[40px] text-[#4B44F6] font-semibold">
                    {{ getInvoice.totalPrice.label }}
                  </p>
                </div>
              </div>

              <div
                v-if="availablePayment.length > 0"
                class="flex flex-col gap-4 p-5 bg-white drop-shadow-xl rounded-lg"
              >
                <div>
                  <p class="text-xl font-semibold text-[#2E2E3A]">
                    Choose you want to pay with
                  </p>
                </div>

                <div class="flex flex-col gap-5">
                  <q-item
                    v-for="(item, index) in availablePayment"
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
                          <img class="w-6" :src="item.img" alt="" />
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
                <div v-if="availablePayment.length > 0">
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
                        v-model="item.active"
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

                <div v-if="unavailablePayment.length > 0">
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
                        v-model="item.active"
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
                  <q-btn v-close-popup color="primary"> Save </q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-dialog>
      </div>
    </q-page-container>

    <q-drawer
      overlay
      :width="getWidth()"
      :breakpoint="200"
      v-model="drawer"
      bordered
      side="right"
    >
      <!-- drawer content -->
      <div class="h-full flex justify-center items-center">
        <div class="min-h-[90vh] w-full flex flex-col py-10">
          <div
            class="flex border border-b pb-2 border-t-0 border-l-0 border-r-0 items-center justify-between"
          >
            <div class="text-capitalize px-10">summary</div>
          </div>
          <div class="mt-10 px-10 flex flex-col gap-5 w-1/2">
            <div class="grid grid-cols-2">
              <p class="text-[#111827] capitalize text-sm font-semibold">to</p>
              <p class="text-black text-sm font-normal">
                {{ getCustomer.email }}
              </p>
            </div>

            <div class="grid grid-cols-2">
              <p class="text-[#111827] capitalize text-sm font-semibold">
                from
              </p>
              <p class="text-black text-sm font-normal">
                {{ getCompany.companyName }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2">
              <p class="text-[#111827] capitalize text-sm font-semibold">
                invoice
              </p>
              <p class="text-black text-sm font-normal">
                {{ getInvoice.invoiceNumber }}
              </p>
            </div>

            <p class="text-[#111827] mt-20 capitalize text-lg font-semibold">
              Due On {{ getInvoice.dueDate }}
            </p>
          </div>

          <div class="mt-10 px-10">
            <p
              class="uppercase font-bold border border-b border-t-0 border-l-0 border-r-0 pb-4"
            >
              items
            </p>

            <div
              class="mt-10 border pb-10 border-b border-t-0 border-l-0 border-r-0"
            >
              <div class="grid grid-cols-3">
                <p class="font-bold">Item</p>
                <p class="font-bold">Qty</p>
                <p class="font-bold">Amount</p>
              </div>

              <div
                v-for="(item, index) in getInvoice.items"
                :key="index"
                class="grid mt-4 text-gray-500 grid-cols-3"
              >
                <p class="">{{ item.item }}</p>
                <p class="">{{ item.qty }}</p>
                <p class="">{{ item.amount.label }}</p>
              </div>
            </div>

            <div class="mt-10 flex flex-col">
              <div class="grid grid-cols-3">
                <p class="font-bold col-span-2">Sub total</p>

                <p class="font-bold">{{ getInvoice.totalPrice.label }}</p>
              </div>

              <template v-if="getInvoice.tax.length > 0">
                <div
                  v-for="(tax, index) in getTax"
                  :key="index"
                  class="grid grid-cols-3"
                >
                  <p class="font-bold col-span-2">
                    {{ tax.taxName }}
                    <span class="text-primary">{{ `${tax.percentage}%` }}</span>
                  </p>

                  <p class="font-bold">{{ tax.taxPrice.label }}</p>
                </div>
              </template>

              <template v-if="getDiscount.length > 0">
                <div
                  v-for="(discount, index) in getDiscount"
                  :key="index"
                  class="grid grid-cols-3"
                >
                  <p class="font-bold col-span-2">
                    {{ discount.discountName }}
                    <span class="text-red-500">{{
                      `${discount.percentage}%`
                    }}</span>
                  </p>

                  <p class="font-bold text-red-500">
                    -{{ discount.discountPrice.label }}
                  </p>
                </div>
              </template>

              <div class="grid grid-cols-3">
                <p class="font-bold col-span-2">Balance Due</p>

                <p class="font-bold">{{ getTotalPrice?.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute" style="top: 15px; left: -16px">
        <q-btn
          @click="drawer = false"
          dense
          round
          unelevated
          color="primary"
          icon="chevron_right"
        />
      </div>
    </q-drawer>
  </q-layout>
</template>

<style lang="scss" scoped>
.q-tabs {
  .q-tab {
    text-transform: none;
  }
}
</style>
