<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import useInvoice from "src/stores/modules/useInvoices";

const { getInvoice } = useInvoice();
const statusOptions = ref(["Pending", "Draft", "Paid", "Over Due"]);

// Optional State
const customDefault = reactive(getInvoice.optional.customField);
const memo = reactive(getInvoice.optional.memo);
const footer = reactive(getInvoice.optional.footer);
const taxOption = ref();
const labelHead = ref([
  {
    label: "Items",
    class: "col-span-3",
  },
  {
    label: "Qty",
    class: "col-span-1 text-center",
  },
  {
    label: "Rate",
    class: "col-span-1 text-center",
  },
  {
    label: "Amount",
    class: "col-span-1 text-center",
  },
]);

const taxOptions = ref([
  {
    name: "Select Tax",
    value: null,
  },
  {
    name: "GST",
    value: 200,
  },
  {
    name: "Sales",
    value: 20,
  },
  {
    name: "Custom",
    value: "custom",
  },
]);

//  Watch
watchEffect(() => {
  if (customDefault.option) customDefault.active = true;
  else customDefault.active = false;

  if (footer.option) footer.active = true;
  else footer.active = false;

  if (memo.option) memo.active = true;
  else memo.active = false;
});
</script>

<template>
  <div class="mt-5">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Invoice Number</p>
          <q-input
            v-model="getInvoice.invoiceNumber"
            placeholder="Invoice Number"
            dense
            outlined
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Status</p>
          <q-select
            dense
            outlined
            v-model="getInvoice.status.value"
            :options="statusOptions"
          />
          <div class="flex items-center mt-2">
            <q-checkbox size="xs" v-model="getInvoice.status.setDefault" />
            <span class="text-sm font-normal text-[#9A9AAF]">
              set as default
            </span>
          </div>
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Date Issue</p>
          <q-input
            bg-color="white"
            v-model="getInvoice.dateIssue"
            :rules="['date']"
            placeholder="Date Issue"
            dense
            outlined
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="getInvoice.dateIssue"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Due Date</p>
          <q-select
            outlined
            v-model="taxOption"
            option-label="name"
            option-value="value"
            :options="taxOptions"
            :dense="true"
            :options-dense="true"
          />
          <q-input
            bg-color="white"
            v-model="getInvoice.dueDate"
            :rules="['date']"
            placeholder="Due Date"
            dense
            outlined
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="getInvoice.dueDate"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="col-span-1" v-if="customDefault.option">
        <div class="w-full">
          <p class="label-style capitalize mb-2">
            {{ customDefault.fieldName }}
          </p>
          <q-input dense outlined v-model="customDefault.fieldValue" />
        </div>
      </div>

      <div class="col-span-2 mt-5">
        <div class="grid grid-cols-6">
          <div
            v-for="(item, index) in labelHead"
            :key="index"
            :class="item.class"
          >
            <p class="font-semibold text-base">{{ item.label }}</p>
          </div>
        </div>
      </div>

      <div class="col-span-2">
        <div
          v-for="(item, index) in getInvoice.items"
          :key="index"
          class="grid grid-cols-6 mb-2"
        >
          <div class="col-span-3">
            <p class="font-extralight text-[#2E2E3A] text-xs">
              {{ item.item }}
            </p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-extralight text-[#2E2E3A] text-xs">{{ item.qty }}</p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-extralight text-[#2E2E3A] text-xs">
              {{ item.rate }}
            </p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-extralight text-[#2E2E3A] text-xs">
              {{ item.amount.label }}
            </p>
          </div>
        </div>
      </div>

      <div class="col-span-2 flex flex-col gap-3">
        <div
          v-for="(newItem, index) in getInvoice.form"
          :key="index"
          class="grid gap-5 grid-cols-6"
        >
          <div class="col-span-3">
            <q-input
              v-model="newItem.description"
              placeholder="Add Description"
              dense
              outlined
            />
          </div>
          <div class="col-span-1 text-center px-2">
            <q-input v-model="newItem.qty" placeholder="0" dense outlined />
          </div>
          <div class="col-span-1 text-center px-2">
            <q-input v-model="newItem.rate" placeholder="0" dense outlined />
          </div>
          <div class="col-span-1 text-center px-2">
            <q-input v-model="newItem.amount" placeholder="0" dense outlined />
          </div>
        </div>
      </div>
    </div>

    <div class="w-full flex justify-end mt-5">
      <div class="flex text-primary gap-3 flex-col">
        <div class="text-end flex gap-5">
          <span class="w-[80px]">Total</span>
          <span class="w-[80px]"> {{ getInvoice.totalPrice.label }} </span>
        </div>
        <div class="text-end flex gap-5">
          <span class="w-[80px] cursor-pointer">
            Add tax
            <q-popup-proxy>
              <q-select
                class="tax-selected"
                outlined
                v-model="taxOption"
                option-label="name"
                option-value="value"
                :options="taxOptions"
                :dense="true"
                :options-dense="true"
              >
              </q-select>
            </q-popup-proxy>
          </span>
          <span class="w-[80px]">$0</span>
        </div>
        <div class="text-end flex gap-5">
          <span class="text-end">Add discount</span>
          <span class="w-[80px]">$0</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="w-full">
        <p class="label-style mb-2">Notes (Optional)</p>
        <q-input
          v-model="getInvoice.optional.notes"
          placeholder="Notes or payment details"
          dense
          outlined
        />
      </div>
      <div class="w-full">
        <p class="label-style mb-2">Terms</p>
        <q-input
          v-model="getInvoice.optional.terms"
          placeholder="Terms & conditions"
          dense
          outlined
        />
      </div>

      <p class="text-base font-semibold">Custom fields</p>
      <div class="flex items-center">
        <q-checkbox
          @update:model-value="customDefault.active = !customDefault.active"
          size="xs"
          val="field"
          v-model="customDefault.option"
        />
        <span class="text-sm font-normal text-[#9A9AAF]">
          Add custom field
        </span>
        <q-menu no-parent-event v-model="customDefault.active">
          <q-banner dense rounded class="bg-[#4B44F6]/10 p-4">
            <label>Custom Field {{ customDefault.active }}</label>
            <q-input
              class="bg-white rounded-xl mt-3"
              dense
              v-model="customDefault.fieldName"
              outlined
              type="text"
              placeholder="Field Name"
            />
            <q-input
              class="bg-white rounded-xl mt-3"
              dense
              v-model="customDefault.fieldValue"
              outlined
              type="text"
              placeholder="Field Value"
            />
            <q-checkbox
              v-model="customDefault.setDefault"
              class="text-[#94A3B8] text-xs"
              size="xs"
              label="set as default for future invoices"
            />
            <div class="flex justify-end gap-3">
              <button
                class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
              >
                Cancel
              </button>
              <button class="rounded-lg py-1 px-2 text-white bg-primary">
                Save
              </button>
            </div>
          </q-banner>
        </q-menu>
      </div>
      <div class="flex items-center">
        <q-checkbox size="xs" val="memo" v-model="memo.option" />
        <span class="text-sm font-normal text-[#9A9AAF]"> Memo </span>
        <q-menu no-parent-event v-model="memo.active">
          <q-banner dense rounded class="w-64 bg-[#4B44F6]/10 p-4">
            <label>Memo</label>
            <q-input
              class="rounded-xl bg-white mt-3"
              outlined
              v-model="memo.memo"
              type="textarea"
              placeholder="Some Text"
            />
            <q-checkbox
              v-model="memo.setDefault"
              class="text-[#94A3B8] text-xs"
              size="xs"
              label="set as default for future invoices"
            />
            <div class="flex justify-end gap-3">
              <button
                class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
              >
                Cancel
              </button>
              <button class="rounded-lg py-1 px-2 text-white bg-primary">
                Save
              </button>
            </div>
          </q-banner>
        </q-menu>
      </div>
      <div class="flex items-center">
        <q-checkbox size="xs" val="footer" v-model="footer.option" />
        <span class="text-sm font-normal text-[#9A9AAF]"> Footer </span>
        <q-menu no-parent-event v-model="footer.active">
          <q-banner dense rounded class="w-64 bg-[#4B44F6]/10 p-4">
            <label>Footer</label>
            <q-input
              class="rounded-xl bg-white mt-3"
              outlined
              v-model="footer.value"
              type="textarea"
              placeholder="Some Text"
            />
            <q-checkbox
              v-model="footer.active"
              class="text-[#94A3B8] text-xs"
              size="xs"
              label="set as default for future invoices"
            />
            <div class="flex justify-end gap-3">
              <button
                class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
              >
                Cancel
              </button>
              <button class="rounded-lg py-1 px-2 text-white bg-primary">
                Save
              </button>
            </div>
          </q-banner>
        </q-menu>
      </div>
      <div class="">
        <q-btn
          color="primary"
          :to="{ name: 'order.payment' }"
          icon-right="east"
          label="Payment Setting"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.tax-selected div) {
  min-width: 100px;
}
</style>
