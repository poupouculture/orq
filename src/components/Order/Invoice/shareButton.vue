<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import ThankYou from "src/components/Order/Invoice/thankYou.vue";

interface Props {
  shareInvoice: {
    via: string;
    setDefault: boolean;
  };
}

// State
const whatsappShare = ref<boolean>(false);
const emailShare = ref<boolean>(false);
const props = defineProps<Props>();
const filter = ref("");
const sendTime = ref("customDate");
const activeTab = ref("send");
const customDate = ref("");
const sendLinks = ref([]);
const customTime = ref("00:00");
const customTimeZone = ref("Pakistan Standard Time (GMT + 5)");
const $q = useQuasar();
const thankYou = ref(false);
const shareInvoice = reactive({
  via: props.shareInvoice.via,
  setDefault: props.shareInvoice.setDefault,
});
const timeZoneOptions = ["Pakistan Standard Time (GMT + 5)"];
const bgImage = ref(
  "bg-[url('https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80')]"
);

// tabs
const tabs = ref([
  {
    label: "Send Now",
    value: "send",
  },
  {
    label: "Schedule",
    value: "schedule",
  },
]);

// Table
const columns = ref([
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "company",
    align: "center",
    label: "Company",
    field: "company",
    sortable: true,
  },
  {
    name: "customerCode",
    align: "center",
    label: "Customer Code",
    field: "customerCode",
  },
  { name: "action", align: "center", label: "Action", field: "action" },
]);

const emailsTabs = ref(["johnDoe@gmail.com"]);

const rows = ref([
  {
    name: "Asim",
    company: "Syn",
    customerCode: 122339828,
  },
  {
    name: "Asim q",
    company: "Syn",
    customerCode: 122339828,
  },
  {
    name: "John q",
    company: "Syn",
    customerCode: 122339828,
  },
]);

const optionsGroup = ref([
  {
    label: "One hour",
    value: "oneHour",
  },
  {
    label: "Two hour",
    value: "twoHour",
  },
  {
    label: "Tomorrow",
    value: "tomorrow",
  },
  {
    label: "Custom Date and Time",
    value: "customDate",
  },
]);

// Funtion
const copyLink = () => {
  navigator.clipboard.writeText(sendLinks.value[0]).then(() => {
    $q.notify({
      position: "top",
      type: "positive",
      color: "primary",
      message: "Link copied to clipboard",
    });
  });
};

onMounted(() => {
  const date = new Date();

  const month = date.getMonth() >= 10 ? date.getMonth() : `0${date.getMonth()}`;
  const getDate = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;

  customDate.value = `${date.getFullYear()}/${month}/${getDate}`;
});
</script>

<template>
  <span>
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
                  class="cursor-pointer"
                  v-model="shareInvoice.via"
                  val="Email"
                  label="Email Now"
                  @click="emailShare = !emailShare"
                />
                <q-icon style="color: #ccc; font-size: 1.4em" name="send" />
              </div>
              <q-checkbox
                v-model="shareInvoice.setDefault"
                size="xs"
                val="xs"
                label="Set as default"
              />
            </div>
            <div class="flex-col flex">
              <div class="gap-3 cursor-pointer items-center flex">
                <q-radio
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  size="xs"
                  class="cursor-pointer"
                  @click="whatsappShare = !whatsappShare"
                  label="Whatsapp"
                  v-model="shareInvoice.via"
                  val="Whatsapp"
                />
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

    <q-dialog v-model="whatsappShare">
      <q-card class="w-[900px]">
        <q-card-section>
          <div class="text-h6">Customers</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-table
            :rows="rows"
            flat
            :columns="columns"
            :filter="filter"
            row-key="name"
          >
            <template v-slot:top-right>
              <q-input
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" @click="onRowClick(props.row)">
                <q-td style="padding: 30px 20px" key="name" :props="props">
                  <div class="flex gap-2">
                    <div
                      class="rounded-full w-10 h-10 bg-cover bg-center"
                      :class="bgImage"
                    />
                    <div class="flex flex-col">
                      <span>{{ props.row.name }}</span>
                      <span class="text-xs text-slate-400">06-06-2023</span>
                    </div>
                  </div>
                </q-td>
                <q-td style="padding: 30px 20px" key="company" :props="props">
                  {{ props.row.company }}
                </q-td>
                <q-td
                  style="padding: 30px 20px"
                  key="customerCode"
                  :props="props"
                >
                  {{ props.row.customerCode }}
                </q-td>
                <q-td style="padding: 30px 20px" key="action" :props="props">
                  <q-btn label="Choose" color="primary" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="emailShare">
      <q-card class="w-[900px] h-[636px]">
        <q-card-section class="flex items-center justify-between">
          <div class="text-h6">Share this link</div>

          <q-btn
            @click="emailShare = !emailShare"
            size="md"
            flat
            round
            color="primary"
            icon="close"
          />
        </q-card-section>

        <q-card-section>
          <div class="w-[80%]">
            <q-tabs
              v-model="activeTab"
              dense
              active-color="primary"
              no-caps
              indicator-color="primary"
            >
              <q-tab
                v-for="(item, index) in tabs"
                :key="index"
                :name="item.value"
                :label="item.label"
              />
            </q-tabs>
          </div>
          <q-separator class="q-mt-none" />

          <q-tab-panels v-model="activeTab">
            <q-tab-panel name="send">
              <div class="container">
                <q-select
                  multiple
                  v-model="sendLinks"
                  :options="emailsTabs"
                  hint="Add a message (Options)"
                >
                  <template v-slot:selected-item="scope">
                    <q-chip
                      removable
                      dense
                      @remove="scope.removeAtIndex(scope.index)"
                      :tabindex="scope.tabindex"
                      color="grey-4"
                      text-color="primary"
                    >
                      <q-avatar class="">
                        <img
                          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                        />
                      </q-avatar>
                      {{ scope.opt }}
                    </q-chip>
                  </template>
                </q-select>

                <div class="mt-5 flex justify-end">
                  <q-btn
                    @click="thankYou = !thankYou"
                    size="sm"
                    class=""
                    color="primary"
                  >
                    send
                  </q-btn>
                </div>

                <div class="flex gap-5 flex-col">
                  <div>
                    <q-btn
                      @click="copyLink"
                      round
                      class="bg-[#F5F5F5] text-[#9A9AAF] rotate-[-97deg]"
                      icon="fa-solid fa-link "
                    />
                  </div>

                  <span class="text-xs">Copy link</span>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="schedule">
              <div class="flex flex-col">
                <div class="">
                  <p class="font-light text-sm">Schedule to send after</p>
                </div>
                <div>
                  <q-option-group
                    :options="optionsGroup"
                    type="radio"
                    v-model="sendTime"
                  />
                </div>

                <div
                  v-if="sendTime == 'customDate'"
                  class="flex flex-col mt-5 gap-5"
                >
                  <div class="grid grid-cols-2 gap-10">
                    <div>
                      <p for="" class="mb-3 font-bold">Select Date</p>
                      <q-input
                        :rules="['date']"
                        v-model="customDate"
                        class="mb-3"
                        dense
                        outlined
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover :breakpoint="600">
                              <q-date v-model="customDate" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div>
                      <p for="" class="mb-3 font-bold">Select Time</p>
                      <q-input v-model="customTime" class="mb-3" dense outlined>
                        <template v-slot:append>
                          <q-icon name="schedule" class="cursor-pointer">
                            <q-popup-proxy cover :breakpoint="600">
                              <q-time v-model="customTime" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>

                  <div class="">
                    <p for="" class="mb-3 font-bold">Select Time Zone</p>
                    <q-select
                      class="mb-3"
                      v-model="customTimeZone"
                      dense
                      outlined
                      :options="timeZoneOptions"
                    />
                  </div>
                </div>

                <div class="flex gap-4 justify-end mt-4">
                  <button
                    class="rounded-lg py-1 px-4 border-dotted border-2 text-primary border-primary"
                  >
                    Cancel
                  </button>
                  <button class="rounded-lg py-1 px-4 text-white bg-primary">
                    Save
                  </button>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>

    <ThankYou
      :dialog="thankYou"
      @closeDialog="(newValue) => (thankYou = newValue)"
    />
  </span>
</template>

<style scoped></style>
