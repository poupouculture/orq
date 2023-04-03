<script setup lang="ts">
import { ref, reactive, watchEffect, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useInvoice from "src/stores/modules/useInvoices";

const invoice = useInvoice();
const { getInvoice, getTax, getTotalPrice, getDiscount } = storeToRefs(invoice);
const statusOptions = ref(["Pending", "Draft", "Paid", "Over Due"]);

// Optional State
const customDefault = reactive(getInvoice.value.optional.customField);
const memo = reactive(getInvoice.value.optional.memo);
const addItem = ref(false);
const newTax = reactive({
  name: "",
  value: "",
});
const discountPercentage = ref(0);
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

//  Watch
watchEffect(() => {
  // getInvoice.optional.footer.option
  if (customDefault.option) customDefault.active = true;
  else customDefault.active = false;

  if (getInvoice.value.optional.footer.option)
    getInvoice.value.optional.footer.active = true;
  else getInvoice.value.optional.footer.active = false;

  if (memo.option) memo.active = true;
  else memo.active = false;
});

// Methods

const addTax = () => {
  invoice.addTax(newTax);
  newTax.name = "";
  newTax.value = "";
};

const cancelAddItems = () => {
  addItem.value = !addItem.value;
};

const addNewItem = (item: any) => {
  invoice.addItems(item);

  addItem.value = !addItem.value;
};

// Validation

const number = reactive([
  (val: any) => (val !== null && val !== "") || "Please type Percentage",
]);

const required = reactive([
  (val: string) => (val !== null && val !== "") || "This field is required",
]);

const addDiscount = () => {
  invoice.addDiscount(discountPercentage.value);
};

const editDiscount = (discount: number) => {
  invoice.editDiscount(discount);
};

onMounted(() => {
  const getPanel = document.querySelector(".q-panel.scroll");

  getPanel?.classList.remove("scroll");
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

      <template v-if="getInvoice.items.length > 0">
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
              <p class="font-extralight text-[#2E2E3A] text-xs">
                {{ item.qty }}
              </p>
            </div>
            <div class="col-span-1 text-center relative">
              <p class="font-extralight text-[#2E2E3A] text-xs">
                {{ item.rate }}
              </p>

              <div class="absolute -top-1 -right-24 z-50">
                <q-icon name="edit" class="cursor-pointer text-primary">
                  <q-menu anchor="bottom right" self="top end">
                    <q-banner class="bg-[#4B44F6]/10 p-4" dense rounded>
                      <q-input
                        class="bg-white rounded-xl mt-3"
                        dense
                        v-model="item.item"
                        outlined
                        type="text"
                        placeholder="Item Name"
                      />
                      <q-input
                        class="bg-white rounded-xl mt-3"
                        dense
                        v-model="item.qty"
                        outlined
                        type="number"
                        placeholder="Qty"
                        lazy-rules
                        :rules="number"
                      />
                      <q-input
                        class="bg-white rounded-xl mt-3"
                        dense
                        v-model="item.amount.totalPrice"
                        outlined
                        type="number"
                        placeholder="Rate"
                        lazy-rules
                        :rules="number"
                      />

                      <div class="flex mt-3 justify-end gap-3">
                        <button
                          v-close-popup
                          class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
                        >
                          Cancel
                        </button>
                        <button
                          v-close-popup
                          @click="invoice.editItems(index, item)"
                          class="rounded-lg py-1 px-2 text-white bg-primary"
                        >
                          Save
                        </button>
                      </div>
                    </q-banner>
                  </q-menu>
                </q-icon>
                <q-icon
                  @click="invoice.deleteItems()"
                  name="delete"
                  class="text-red-500 cursor-pointer"
                />
              </div>
            </div>
            <div class="col-span-1 text-center">
              <p class="font-extralight text-[#2E2E3A] text-xs">
                {{ item.amount.label }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <template v-if="addItem">
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
                :rules="required"
              />
            </div>
            <div class="col-span-1 text-center px-2">
              <q-input
                v-model="newItem.qty"
                placeholder="0"
                dense
                outlined
                :rules="required"
              />
            </div>
            <div class="col-span-1 text-center px-2">
              <q-input
                v-model="newItem.rate"
                placeholder="0"
                dense
                outlined
                :rules="required"
              />
            </div>
            <div class="col-span-1 text-center px-2">
              <q-input
                v-model="newItem.amount"
                placeholder="0"
                dense
                outlined
                :rules="required"
              />
            </div>
          </div>

          <div class="flex px-2 mt-3 gap-3 justify-end">
            <button
              @click="cancelAddItems"
              class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
            >
              Cancel
            </button>
            <button
              @click="addNewItem(newItem)"
              class="rounded-lg py-1 px-2 text-white bg-primary"
            >
              Save
            </button>
          </div>
        </div>
      </template>

      <div class="col-span-2" v-else>
        <q-btn size="sm" @click="addItem = !addItem" color="primary" class="">
          Add item
        </q-btn>
      </div>
    </div>

    <div class="mt-4">
      <q-expansion-item
        label="Tax"
        icon="fa-solid fa-tag"
        header-class="text-primary"
        expand-icon-class="text-primary"
        class="overflow-hidden"
      >
        <q-card>
          <q-card-section class="flex flex-col">
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <p class="font-semibold text-base">TAX Name</p>
              </div>

              <div class="col-span-2">
                <p class="font-semibold text-center text-base">Percentage</p>
              </div>

              <div class="col-span-1 text-center">
                <p class="font-semibold text-base">TAX</p>
              </div>
            </div>
            <div
              v-for="(item, index) in getTax"
              :key="index"
              class="grid mt-3 grid-cols-6"
            >
              <div class="col-span-3">
                <p class="font-extralight text-[#2E2E3A] text-xs">
                  {{ item.name }}
                </p>
              </div>

              <div class="col-span-2">
                <p class="font-extralight text-[#2E2E3A] text-center text-xs">
                  {{ item.value }}%
                </p>
              </div>

              <div class="col-span-1 text-center relative">
                <p class="font-extralight text-[#2E2E3A] text-xs">
                  {{ item.taxPrice.label }}
                </p>

                <div class="absolute -top-1 -right-4">
                  <q-icon name="edit" class="cursor-pointer text-primary">
                    <q-menu anchor="bottom right" self="top end">
                      <q-banner class="bg-[#4B44F6]/10 p-4" dense rounded>
                        <q-input
                          class="bg-white rounded-xl mt-3"
                          dense
                          v-model="item.name"
                          outlined
                          type="text"
                          placeholder="Tax"
                        />
                        <q-input
                          class="bg-white rounded-xl mt-3"
                          dense
                          v-model="item.value"
                          outlined
                          type="number"
                          placeholder="Value"
                          lazy-rules
                          :rules="number"
                        />

                        <div class="flex mt-3 justify-end gap-3">
                          <button
                            v-close-popup
                            class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
                          >
                            Cancel
                          </button>
                          <button
                            @click="invoice.editTax(index, item)"
                            class="rounded-lg py-1 px-2 text-white bg-primary"
                          >
                            Save
                          </button>
                        </div>
                      </q-banner>
                    </q-menu>
                  </q-icon>
                  <q-icon
                    name="delete"
                    @click="invoice.deleteTax(index)"
                    class="cursor-pointer text-red-500"
                  />
                </div>
              </div>
            </div>

            <div class="mt-4">
              <q-btn size="sm" color="primary" label="Add tax">
                <q-menu anchor="bottom right" self="top end">
                  <q-banner class="bg-[#4B44F6]/10 p-4" dense rounded>
                    <q-input
                      class="bg-white rounded-xl mt-3"
                      dense
                      v-model="newTax.name"
                      outlined
                      lazy-rules
                      :rules="required"
                      type="text"
                      placeholder="Tax"
                    />
                    <q-input
                      class="bg-white rounded-xl mt-3"
                      dense
                      v-model="newTax.value"
                      outlined
                      type="text"
                      placeholder="Value"
                      lazy-rules
                      :rules="number"
                    />

                    <div class="flex mt-3 justify-end gap-3">
                      <button
                        v-close-popup
                        class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
                      >
                        Cancel
                      </button>
                      <button
                        @click="addTax"
                        class="rounded-lg py-1 px-2 text-white bg-primary"
                      >
                        Save
                      </button>
                    </div>
                  </q-banner>
                </q-menu>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        label="Discount"
        icon="percent"
        header-class="text-primary"
        expand-icon-class="text-primary"
        class="overflow-hidden"
      >
        <q-card>
          <q-card-section class="flex flex-col">
            <template v-if="getDiscount.length > 0">
              <div class="grid grid-cols-6">
                <div class="col-span-3">
                  <p class="font-semibold text-base"></p>
                </div>

                <div class="col-span-2">
                  <p class="font-semibold text-center text-base">Percentage</p>
                </div>

                <div class="col-span-1 text-center">
                  <p class="font-semibold text-base">Discount</p>
                </div>
              </div>

              <div
                v-for="(item, index) in getDiscount"
                :key="index"
                class="grid mt-3 grid-cols-6"
              >
                <div class="col-span-3">
                  <p class="font-extralight text-[#2E2E3A] text-xs">
                    {{ item.name }}
                  </p>
                </div>

                <div class="col-span-2 relative">
                  <div
                    class="font-extralight cursor-pointer text-[#2E2E3A] text-center text-xs"
                  >
                    {{ item.percentage }}%
                    <q-popup-edit
                      v-model="item.percentage"
                      auto-save
                      v-slot="scope"
                    >
                      <q-input
                        type="number"
                        v-model="scope.value"
                        dense
                        autofocus
                        counter
                        @keyup.enter="editDiscount(scope.value)"
                      />
                    </q-popup-edit>

                    <q-icon class="ml-3 absolute" color="primary" name="edit" />
                  </div>
                </div>

                <div class="col-span-1 text-center relative">
                  <p class="font-extralight text-[#2E2E3A] text-xs">
                    {{ item.discountPrice.label }}
                  </p>

                  <q-icon
                    @click="invoice.deleteDiscount()"
                    class="ml-3 absolute cursor-pointer top-0 -right-3 text-red-500"
                    name="delete"
                  />
                </div>
              </div>
            </template>

            <div v-else class="mt-4">
              <q-btn size="sm" color="primary" label="Add Discount">
                <q-menu anchor="bottom right" self="top end">
                  <q-banner class="bg-[#4B44F6]/10 p-4" dense rounded>
                    <q-input
                      class="bg-white rounded-xl mt-3"
                      dense
                      v-model="discountPercentage"
                      outlined
                      type="number"
                      placeholder="Percentage"
                      lazy-rules
                      :rules="number"
                    />

                    <div class="flex mt-3 justify-end gap-3">
                      <button
                        v-close-popup
                        class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
                      >
                        Cancel
                      </button>
                      <button
                        @click="addDiscount"
                        class="rounded-lg py-1 px-2 text-white bg-primary"
                      >
                        Save
                      </button>
                    </div>
                  </q-banner>
                </q-menu>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <div class="w-full flex justify-end mt-5">
      <div class="flex text-primary gap-1 w-[236px] flex-col">
        <div class="text-end flex gap-5">
          <span class="w-[100px]">Total</span>
          <span class="w-[100px]"> {{ getInvoice.totalPrice.label }} </span>
        </div>
        <template v-if="getTax.length > 0">
          <div
            v-for="(item, index) in getTax"
            :key="index"
            class="text-end flex gap-5"
          >
            <span class="w-[100px] cursor-pointer">
              {{ item.taxName }} {{ item.percentage }}%
            </span>
            <span class="w-[100px]">{{ item.taxPrice.label }}</span>
          </div>
        </template>

        <template v-if="getDiscount.length > 0">
          <div
            v-for="(item, index) in getDiscount"
            :key="index"
            class="text-end flex gap-5"
          >
            <span class="w-[100px] text-red-500 cursor-pointer">
              {{ item.discountName }} {{ item.percentage }}%
            </span>
            <span class="w-[100px] text-red-500"
              >- {{ item.discountPrice.label }}</span
            >
          </div>
        </template>

        <div class="text-end flex gap-5">
          <span class="w-[100px]">Amoun Due</span>
          <span class="w-[100px]"> {{ getTotalPrice.label }} </span>
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
                v-close-popup
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
                v-close-popup
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
        <q-checkbox
          size="xs"
          :val="true"
          v-model="getInvoice.optional.footer.option"
        />
        <span class="text-sm font-normal text-[#9A9AAF]"> Footer </span>
        <q-menu no-parent-event v-model="getInvoice.optional.footer.active">
          <q-banner dense rounded class="w-64 bg-[#4B44F6]/10 p-4">
            <label>Footer</label>
            <q-input
              class="rounded-xl bg-white mt-3"
              outlined
              v-model="getInvoice.optional.footer.value"
              type="textarea"
              placeholder="Some Text"
            />
            <q-checkbox
              v-model="getInvoice.optional.footer.active"
              class="text-[#94A3B8] text-xs"
              size="xs"
              label="set as default for future invoices"
            />
            <div class="flex justify-end gap-3">
              <button
                v-close-popup
                class="rounded-lg py-1 px-2 border-dotted border-2 text-primary border-primary"
              >
                Cancel
              </button>
              <button
                v-close-popup
                class="rounded-lg py-1 px-2 text-white bg-primary"
              >
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

:deep(.q-panel) {
  overflow-x: hidden !important;
}
</style>
