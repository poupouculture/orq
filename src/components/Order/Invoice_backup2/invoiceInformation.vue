<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { getDocumentTemplates } from "src/api/documentTemplate";
import { Notify } from "quasar";
import useInvoice from "src/stores/modules/useInvoices";
const invoice = useInvoice();
const { getInvoice } = storeToRefs(invoice);

const components: any[] = ref([]);
const componentModels: string[] = ref([]);
const uplader: any = ref(null);

const imageSizeFilter = (files: readonly any[] | FileList) => {
  const filterFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size <= 1024 * 1024 * 5) {
      filterFiles.push(file);
    }
  }
  if (!filterFiles.length) {
    Notify.create({
      message: "Image cannot exceed 5M",
      type: "negative",
      color: "purple",
      position: "top",
    });
  }
};
// Optional State
const customDefault = reactive(getInvoice.value.optional.customField);
const addItem = ref(false);
const newForm = reactive({
  description: "",
  qty: "",
  rate: "",
  amount: "",
});
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

const upload = (val) => {
  console.log(val);
};

onMounted(async () => {
  const result = await getDocumentTemplates({});
  const document = result.data.data.find((doc: any) => doc.type === "invoice");
  components.value = document.components;
  componentModels.value = Array(components.value.values.length).fill("");
});
const addNewItem = () => {
  invoice.addItems(newForm);
  addItem.value = !addItem.value;

  resetItem();
};

const resetItem = () => {
  newForm.description = "";
  newForm.qty = "";
  newForm.rate = "";

  newForm.description.resetValidation();
  newForm.qty.resetValidation();
  newForm.rate.resetValidation();
};

// Validation

const number = reactive([
  (val: any) => (val !== null && val !== "") || "Please type Percentage",
]);
const reg = /^\d+$/;

const requiredNumber = reactive([
  (val: string) => (val !== null && val !== "") || "This field is required",
  (val: string) => reg.test(val) || "This field is number",
]);

const required = reactive([
  (val: string) => (val !== null && val !== "") || "This field is required",
]);

onMounted(() => {
  const getPanel = document.querySelector(".q-panel.scroll");

  getPanel?.classList.remove("scroll");
});
</script>

<template>
  <div class="mt-5">
    <div
      class="w-full mt-4"
      v-for="(component, index) in components"
      :key="index"
    >
      <p class="label-style mb-2">{{ component.key.replace("_", " ") }}</p>
      <q-input
        v-model="componentModels[index]"
        :placeholder="component.key.replace('_', ' ')"
        dense
        outlined
        v-if="component.type === 'string'"
      />
      <q-input
        type="date"
        v-model="componentModels[index]"
        placeholder="Invoice Number"
        dense
        outlined
        v-if="component.type === 'date'"
      />
      <button
        class="px-4 py-2 bg-primary text-white rounded-md"
        @click="uplader?.pickFiles"
        v-if="component.type === 'media'"
      >
        <q-uploader
          ref="uplader"
          accept=".gif, .jpg, .jpeg, .png, image/*"
          class="hidden invisible"
          :filter="imageSizeFilter"
          @added="upload"
        />
        <q-icon name="image" />
        Upload
      </button>
      <div class="w-full flex flex-col" v-if="component.type === 'items'">
        <div class="w-full flex gap-3">
          <div class="w-5/12 flex flex-col">
            <div class="text-gray-500 font-semibold">ITEM</div>
            <input
              type="text"
              placeholder="Enter Item Name"
              class="w-full border rounded-lg mt-4 h-10 p-4"
            />
            <textarea
              rows="2"
              placeholder="Enter a description (optional)"
              class="w-full border rounded-lg mt-2 p-4"
            ></textarea>
          </div>
          <div class="w-3/12 flex flex-col">
            <div class="w-full text-right text-gray-500 font-semibold">QTY</div>
            <input
              type="number"
              placeholder="Enter the Qty"
              class="w-full border rounded-lg mt-4 h-10 p-4"
            />
            <button class="py-2 text-red-700 text-left">
              <q-icon name="add" class="text-xl" />
              Add Unit
            </button>
          </div>
          <div class="w-1/12 flex flex-col">
            <div class="w-full text-right text-gray-500 font-semibold">
              Rate
            </div>
          </div>

          <div class="col-span-2">
            <div class="">
              <p class="label-style mb-2">Upload File</p>
              <q-uploader
                url="http://localhost:4444/upload"
                class="w-1/2"
                square
                color="primary"
                flat
              />
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
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
          <div class="col-span-2 sm:col-span-1">
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

          <div class="col-span-2 sm:col-span-1" v-if="customDefault.option">
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
            <q-form
              @submit.prevent.stop="addNewItem"
              class="col-span-2 flex flex-col gap-3"
            >
              <div class="grid gap-2 grid-cols-6">
                <div class="col-span-6">
                  <q-input
                    v-model="newForm.description"
                    placeholder="Add Description"
                    dense
                    outlined
                    :rules="required"
                  />
                </div>
                <div class="col-span-3 text-center">
                  <q-input
                    v-model="newForm.qty"
                    placeholder="Qty"
                    dense
                    outlined
                    :rules="requiredNumber"
                  />
                </div>
                <div class="col-span-3 text-center">
                  <q-input
                    v-model="newForm.rate"
                    placeholder="Rate"
                    dense
                    outlined
                    :rules="requiredNumber"
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
                  type="submit"
                  class="rounded-lg py-1 px-2 text-white bg-primary"
                >
                  Save
                </button>
              </div>
            </q-form>
          </template>

          <div class="col-span-2" v-else>
            <q-btn
              size="sm"
              @click="addItem = !addItem"
              color="primary"
              class=""
            >
              Add item
            </q-btn>
          </div>
        </div>
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
