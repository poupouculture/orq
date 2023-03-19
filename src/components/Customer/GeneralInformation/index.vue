<script setup lang="ts">
import { ref, watch, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import useCustomerStore from "src/stores/modules/customer";
import { required } from "src/utils/validation-rules";
import useMessagingStore from "src/stores/modules/messaging";
import BaseMultiOptions from "src/components/BaseMultiOptions.vue";
import { api } from "src/boot/axios";
import type { Tag as ITag } from "src/types/TagTypes";
import type { ICustomerGroup } from "src/types/CustomerGroupTypes";
import type { Company as ICompany } from "src/types/CompanyTypes";
import { useRouter } from "vue-router";
import { date } from "quasar";
import { ICustomer } from "src/types/CustomerTypes";
import {
  transforCustomerGroupPayload,
  transformCompaniesPayload,
  transformTagPayload,
} from "src/utils/transform-object";

// Type Interface
interface Option {
  value: string | number;
  label: string;
}

interface Gender {
  value: "m" | "f";
  label: "Male" | "Female";
}

interface Emit {
  (e: "submit", val: any): void;
}

interface Props {
  mode?: string;
  showActive?: boolean;
  showReturnButton?: boolean;
  showDeleteButton?: boolean;
}

type Position = Option;
type ITagOptions = Option & ITag;

// Props & Emit

const emit = defineEmits<Emit>();
const router = useRouter();
const props = withDefaults(defineProps<Props>(), {
  mode: "show",
});

// Array State
const genderOptions: Gender[] = [
  {
    value: "m",
    label: "Male",
  },
  { value: "f", label: "Female" },
];

const positionOptions: Position[] = [
  { value: "purchase_manager", label: "Purchase Manager" },
  { value: "owner", label: "Owner" },
  { value: "restaurant_chef", label: "Restaurant Chef" },
];

// State Ref
const mode = ref(props.mode ? props.mode : "edit");
const customerStore = useCustomerStore();
const messagingStore = useMessagingStore();
const getContactNumber = computed(() => messagingStore.getContactNumber);
const { getSelectedChatId } = storeToRefs(messagingStore);
const options: { [key: string]: any[] } = reactive({
  tags: [] as ITagOptions[],
  customerGroups: [] as ICustomerGroup[],
  companies: [] as ICompany[],
});

const deleteDialog = ref(false);
const returnDialog = ref(false);
const customerForm = ref(null);
const { getCustomer } = storeToRefs(customerStore);

// State Reactive
const formData = ref<ICustomer>({
  companies: [],
});

watch(getCustomer, (value) => {
  mode.value = "show";
  formData.value = {
    ...value,
    position: positionOptions.find(
      (item) => item.value === getCustomer.value.position
    ),
    gender: genderOptions.find(
      (item) => item.value === getCustomer.value.gender
    ),
    tags: getCustomer.value.tags.map((data: any) => {
      return {
        label: data.tags_id.name,
        value: data.tags_id.id,
      };
    }),
    companies: mappingCompanies(),
    customer_groups: mappingCustomerGroups(),
    user_updated: "User updated", // Sample
  };
});

onMounted(async () => {
  const customer = customerStore.getCustomer;
  if (customer) {
    formData.value = {
      ...customer,
      position: positionOptions.find(
        (item) => item.value === getCustomer.value.position
      ),
      gender: genderOptions.find(
        (item) => item.value === getCustomer.value.gender
      ),
      tags: getCustomer.value.tags.map((data: any) => {
        return {
          label: data.tags_id.name,
          value: data.tags_id.id,
        };
      }),
      companies: mappingCompanies(),
      customer_groups: mappingCustomerGroups(),
    };
  }
});

// // Watch Contact number
watch(getContactNumber, (val: string) => {
  customerForm.value?.resetValidation();
  formData.value.id_number = val;
});

const filter = (val: string) => {
  console.log(val);
};

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
      search: payload,
    },
  });
  options[variableName] = data.map((item: any) => {
    return {
      value: item.id,
      label: item[nameLabel],
    };
  });
};

const onSubmit = () => {
  customerForm.value.validate().then((success) => {
    if (success) {
      const payload = {
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
        id_number: formData.value.id_number,
        cust_cd: formData.value.cust_cd,
        gender: formData.value.gender.value,
        isActive: formData.value.isActive,
        dob: formData.value.dob,
        position: formData.value.position.value,
        customer_group: transforCustomerGroupPayload(
          getCustomer.value,
          formData.value.customer_groups
        ),
        companies: transformCompaniesPayload(
          getCustomer.value,
          formData.value.companies
        ),
        tags: transformTagPayload(getCustomer.value, formData.value.tags),
        location_code: formData.value.location_code,
        tel: formData.value.tel,
        delivery_location_address: formData.value.delivery_location_address,
        customer_company_name_en: formData.value.customer_company_name_en,
        delyloc_no: formData.value.delyloc_no,
        div_no: formData.value.div_no,
        delyloc_name_e: formData.value.delyloc_name_e,
        delyloc_name_c: formData.value.delyloc_name_c,
        delyloc_add1_e: formData.value.delyloc_add1_e,
        delyloc_add2_e: formData.value.delyloc_add2_e,
        delyloc_add3_e: formData.value.delyloc_add3_e,
        delyloc_add1_c: formData.value.delyloc_add1_c,
        delyloc_add2_c: formData.value.delyloc_add2_c,
        delyloc_add3_c: formData.value.delyloc_add3_c,
        salesman_cd: formData.value.salesman_cd,
      };
      emit("submit", payload);
    }
  });
};

const discardChanges = () => {
  returnDialog.value = false;
  router.go(-1);
};

const submitDelete = () => {
  deleteDialog.value = false;
};

const optionDateFn = (qdate: string) => {
  return qdate <= date.formatDate(Date.now(), "YYYY/MM/DD");
};

const mappingCompanies = () => {
  return getCustomer.value.companies
    .filter((data: any) => data.companies_id !== null)
    .map((data: any) => ({
      label: data.companies_id.name_english,
      value: data.companies_id.id,
    }));
};
const mappingCustomerGroups = () => {
  return getCustomer.value.customer_groups
    .filter((data: any) => data.customer_groups_id !== null)
    .map((data: any) => ({
      label: data.customer_groups_id.name,
      value: data.customer_groups_id.id,
    }));
};
</script>
<template>
  <div>
    <q-form
      ref="customerForm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      @submit="onSubmit"
    >
      <div class="q-pa-md">
        <div
          class="row q-mb-lg ml-auto flex justify-end"
          v-if="mode === 'show' && getSelectedChatId"
        >
          <q-btn
            @click="mode = 'edit'"
            color="primary"
            label="Edit"
            class="dark-btn"
          />
        </div>
        <div class="row q-mb-lg">
          <div class="col-2">
            <img src="src/assets/images/imagetaker.png" name="folder_open" />
          </div>
          <div class="col-10">
            <div class="w-full">
              <BaseMultiOptions
                v-model="formData.tags"
                label="Labels"
                :rules="[(val) => required(val)]"
                filter-url="/items/tags"
                :options="options.tags"
                option-variable-name="tags"
                :mode="mode"
                @filter="filter"
                @update:multi-options="updateMultiOptions"
              />
            </div>
          </div>
        </div>
        <div class="row q-mb-xs q-gutter-xl">
          <div class="col">
            <p class="label-style">First Name</p>
            <q-input
              v-model="formData.first_name"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Last Name</p>
            <q-input
              v-model="formData.last_name"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-mb-xs q-gutter-xl">
          <div class="col">
            <p class="label-style">Contact Number</p>
            <q-input
              v-model="formData.id_number"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Customer Code</p>
            <q-input
              v-model="formData.cust_cd"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Gender</p>
            <q-select
              v-model="formData.gender"
              :options="genderOptions"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Date Of Birth</p>
            <q-input
              v-model="formData.dob"
              mask="####-##-##"
              lazy-rules
              dense
              outlined
              :disable="mode == 'show'"
              bg-color="white"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="formData.dob"
                      :options="optionDateFn"
                      mask="YYYY-MM-DD"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Position</p>
            <q-select
              outlined
              v-model="formData.position"
              :options="positionOptions"
              dense
              :rules="[(val) => required(val)]"
              :disable="mode == 'show'"
            />
          </div>
          <div class="col">
            <BaseMultiOptions
              v-model="formData.companies"
              label="Companies"
              filter-url="/items/companies"
              :options="options.companies"
              :mode="mode"
              @filter="filter"
              @update:multi-options="updateMultiOptions"
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <BaseMultiOptions
              v-model="formData.customer_groups"
              label="Customer Groups"
              :rules="[(val) => required(val)]"
              filter-url="/items/customer_groups"
              :options="options.customerGroups"
              option-variable-name="customerGroups"
              :mode="mode"
              @filter="filter"
              @update:multi-options="updateMultiOptions"
            />
          </div>
          <div class="col">
            <p class="label-style">Location Code</p>
            <q-input
              v-model="formData.location_code"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Company Tel</p>
            <q-input
              v-model="formData.tel"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Deliver Location Address</p>
            <q-input
              v-model="formData.delivery_location_address"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Delivery Location</p>
            <q-input
              v-model="formData.delyloc_no"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Division</p>
            <q-input
              v-model="formData.div_no"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Customer Name (English)</p>
            <q-input
              v-model="formData.delyloc_name_e"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Customer Name (China)</p>
            <q-input
              v-model="formData.delyloc_name_c"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Customer Company Name En</p>
            <q-input
              v-model="formData.customer_company_name_en"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Last modify date</p>
            <q-input
              v-model="formData.last_modify_date"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              disable
              dense
            />
          </div>
        </div>

        <div class="row q-mb-lg q-gutter-xl">
          <div class="col flex flex-col gap-3">
            <p class="label-style">Address (English)</p>
            <div class="flex flex-col gap-4">
              <q-input
                v-model="formData.delyloc_add1_e"
                class="indi"
                :rules="[(val) => required(val)]"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
              <q-input
                v-model="formData.delyloc_add2_e"
                class="indi"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
              <q-input
                v-model="formData.delyloc_add3_e"
                class="indi"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
            </div>
          </div>
          <div class="col flex flex-col gap-3">
            <p class="label-style">Address (China)</p>
            <div class="flex flex-col gap-4">
              <q-input
                v-model="formData.delyloc_add1_c"
                class="indi"
                :rules="[(val) => required(val)]"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
              <q-input
                v-model="formData.delyloc_add2_c"
                class="indi"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
              <q-input
                v-model="formData.delyloc_add3_c"
                class="indi"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
            </div>
          </div>
        </div>

        <div class="row q-mb-lg q-gutter-xl">
          <div class="col flex flex-col gap-3">
            <p class="label-style">Salesman Code</p>
            <div class="flex flex-col gap-4">
              <q-input
                v-model="formData.salesman_cd"
                class="indi"
                :rules="[(val) => required(val)]"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
            </div>
          </div>
          <div class="col flex justify-center items-center">
            <q-checkbox
              v-if="formData"
              :disable="mode == 'show'"
              v-model="formData.is_active"
              label="Customer Active"
            />
          </div>
        </div>

        <div class="row q-gutter-xl" v-if="mode !== 'show'">
          <div v-if="showReturnButton" class="col">
            <div class="btn-cls" @click="returnDialog = true">
              <p>Return</p>
            </div>
          </div>
          <div class="col">
            <div class="btn-hold">
              <div
                v-if="showDeleteButton"
                class="btn-cls"
                @click="deleteDialog = true"
              >
                <p>Delete</p>
              </div>
              <q-btn
                color="primary"
                label="Save"
                class="dark-btn"
                type="submit"
              />
            </div>
          </div>
        </div>
      </div>
    </q-form>
    <DeleteDialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @submitDelete="submitDelete"
    />
    <ReturnDialog
      v-model="returnDialog"
      @cancel="returnDialog = false"
      @submit="discardChanges()"
    />
  </div>
</template>

<style scoped src="./style.scss" />
