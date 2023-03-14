<template>
  <div class="pt-8">
    <div
      class="flex items-cennter text-xl lg:text-2xl space-x-2 font-semibold text-gray-400"
    >
      <router-link :to="`/application-programs`">
        <span class="text-gray-400">
          <q-icon name="fa-solid fa-arrow-left" class="mr-2" />
          Application program
        </span>
      </router-link>
      <span>/</span>
      <router-link :to="`/application-programs/campaign`">Campaign</router-link>
      <span>/</span>
      <span class="text-gray-800">Campaign Setting</span>
    </div>
    <!-- Content -->
    <div class="p-4 bg-white rounded-lg lg:p-6 my-6">
      <h5 class="font-bold text-xl">Campaign Setting</h5>
      <div class="grid lg:grid-cols-3 xl:grid-cols-4 gap-x-6 mt-7 gap-y-6">
        <div>
          <div>
            <p class="font-semibold mb-1">
              Title <span class="text-red-600">*</span>
            </p>
            <q-input
              v-model="form.name"
              :rules="[(val) => required(val)]"
              placeholder="Enter title ..."
              outlined
              lazy-rules
              dense
            />
          </div>
          <div>
            <p class="font-semibold mb-1">
              Channel <span class="text-red-600">*</span>
            </p>
            <q-select
              v-model="form.channels"
              :options="channelOptions"
              use-input
              :rules="[(val) => required(val)]"
              :input-debounce="700"
              outlined
              multiple
              dense
              use-chips
            />
          </div>
          <div>
            <p class="font-semibold">
              Recipients <span class="text-red-600">*</span>
            </p>
            <div class="text-xs text-gray-400 mb-2">
              Total recipients: {{ form.customerGroups.length }}
            </div>
            <BaseMultiOptions
              v-model="form.customerGroups"
              filter-url="/items/customer_groups"
              :options="options.customerGroups"
              option-variable-name="customerGroups"
              :mode="'edit'"
              @update:multi-options="updateMultiOptions"
            />
          </div>
          <div>
            <p class="font-semibold mb-1">
              Send a test message <span class="text-red-600">*</span>
            </p>
            <div class="text-xs text-gray-400 mb-2">
              Test your message before sending to your recipients
            </div>
            <BaseMultiOptions
              v-model="form.customers"
              filter-url="/items/customers"
              :options="options.customers"
              option-variable-name="customers"
              :mode="'edit'"
              name-label="first_name"
              @update:multi-options="updateMultiOptions"
            />
          </div>
          <q-btn
            no-caps
            color="primary"
            label="Send text message"
            class="mt-4"
          />
        </div>
        <div class="col-span-2">
          <MessageBox
            title="Create Internal Note"
            :message="message"
            padding="lg:px-2 lg:py-2"
            :show="show"
            @click="show = false"
          />
          <div
            class="mt-4 py-3 border-l-8 border-primary px-4 bg-[#4B44F60D]/5"
          >
            <h6 class="font-semibold">Tips</h6>
            <span class="text-[#4C4C4C]">
              The message template name field must not exceed 512 characters.
              <br />
              The message template content field must not exceed 1024
              characters.
            </span>
          </div>
          <div class="mt-5">
            <p class="font-semibold mb-2">Message</p>
            <div
              class="flex items-center justify-center h-40 w-full border-primary rounded-lg border border-dotted"
            >
              <div class="flex flex-col items-center">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.7647 6.64707H6.64706C3.52827 6.64707 1 9.17534 1 12.2941V43.3529C1 46.4717 3.52827 49 6.64706 49H37.7059C40.8247 49 43.3529 46.4717 43.3529 43.3529V29.2353M39.3599 2.65398C41.5652 0.448672 45.1407 0.448672 47.346 2.65398C49.5513 4.8593 49.5513 8.43482 47.346 10.6401L23.1038 34.8824H15.1176L15.1176 26.8962L39.3599 2.65398Z"
                    stroke="#9CA3AF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="mt-2">Create a new template</span>
              </div>
            </div>
          </div>
          <div
            class="flex items-center justify-center w-full border-[#D1D5DB] rounded-lg border border-dashed mt-5"
          >
            <div class="flex flex-col items-center py-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28 8H12C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12V32M8 32V36C8 37.0609 8.42143 38.0783 9.17157 38.8284C9.92172 39.5786 10.9391 40 12 40H36C37.0609 40 38.0783 39.5786 38.8284 38.8284C39.5786 38.0783 40 37.0609 40 36V28M8 32L17.172 22.828C17.9221 22.0781 18.9393 21.6569 20 21.6569C21.0607 21.6569 22.0779 22.0781 22.828 22.828L28 28M40 20V28M40 28L36.828 24.828C36.0779 24.0781 35.0607 23.6569 34 23.6569C32.9393 23.6569 31.9221 24.0781 31.172 24.828L28 28M28 28L32 32M36 8H44M40 4V12M28 16H28.02"
                  stroke="#9CA3AF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="mt-2">
                <div>
                  <span class="text-primary font-semibold">Upload a file </span>
                  <span>or drag and drop</span>
                </div>
                <div class="text-[#6B7280]">PNG, JPG, PDF up to 10MB</div>
              </span>
            </div>
          </div>
          <div class="flex items-center justify-between mt-5">
            <button class="btn-dotted">Return</button>
            <div class="flex items-center space-x-3">
              <button class="btn-dotted">Save Draft</button>
              <q-btn no-caps color="primary" label="Preview and send" />
            </div>
          </div>
        </div>
        <!-- Variable search -->
        <div class="flex items-center">
          <div>
            <p class="mb-1">Variables</p>
            <q-select
              v-model="search.query"
              :options="search.options"
              use-input
              :rules="[(val) => required(val)]"
              :input-debounce="700"
              outlined
              dense
              placeholder="Search"
              use-chips
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import MessageBox from "src/components/MessageBox.vue";
import { required } from "src/utils/validation-rules";
import { ICustomerGroup } from "src/types/CustomerGroupTypes";
import { api } from "src/boot/axios";
import BaseMultiOptions from "src/components/BaseMultiOptions.vue";

const message = `Create your own campaign message send it via Internal Note`;
const show = ref(true);

const search = reactive({
  query: null,
  options: [
    "{{firstname}}",
    "{{lastname}}",
    "phonenumber",
    "companyname",
    "lists",
    "country",
    "{{priority}}",
  ],
});

const options: { [key: string]: any[] } = reactive({
  customerGroups: [] as ICustomerGroup[],
  customers: [],
});
const channelOptions = ["whatsapp"];
const form = reactive({
  name: "",
  channels: null,
  customerGroups: [],
  customers: [],
});

const updateMultiOptions = async (val: {
  data: any[];
  filterUrl: string;
  variableName: string;
  nameLabel: string;
}) => {
  const { data: payload, filterUrl, variableName, nameLabel } = val;
  const {
    data: { data },
  } = await api.get(filterUrl, {
    params: {
      fields: "*",
      limit: 10,
      ...(nameLabel !== "first_name"
        ? undefined
        : { "filter[first_name][_neq]": "null" }),
      search: payload,
    },
  });
  options[variableName] = data.map((item: any) => {
    return {
      value: item.id,
      label:
        nameLabel === "first_name"
          ? `${item[nameLabel]} ${item.last_name}`
          : item[nameLabel],
    };
  });
};
</script>
