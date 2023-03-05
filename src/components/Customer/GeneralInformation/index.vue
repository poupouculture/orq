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
            <img
              src="../../../assets/images/imagetaker.png"
              name="folder_open"
            />
          </div>
          <div class="col-10">
            <div class="field-holder">
              <BaseMultiOptions
                v-model="tags"
                label="Labels"
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
              v-model="firstName"
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
              v-model="lastName"
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
              v-model="idNumber"
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
              v-model="customerCode"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-gutter-xl">
          <div class="col">
            <p class="label-style">Gender</p>
            <q-select
              v-model="gender"
              :options="genderOptions"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Date Of Birth</p>
            <q-input
              v-model="dateOfBirth"
              mask="####-##-##"
              :rules="[(val) => required(val)]"
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
                      v-model="dateOfBirth"
                      @input="() => $refs.qDateProxy.hide()"
                    ></q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-mb-xs q-gutter-xl">
          <div class="col">
            <p class="label-style">Position</p>
            <q-select
              outlined
              v-model="position"
              :options="positionOptions"
              dense
              :disable="mode == 'show'"
            />
          </div>
          <div class="col">
            <BaseMultiOptions
              v-model="companies"
              label="Companies"
              filter-url="/items/companies"
              :options="options.companies"
              option-variable-name="companies"
              name-label="name_english"
              :mode="mode"
              @filter="filter"
              @update:multi-options="updateMultiOptions"
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <BaseMultiOptions
              v-model="customerGroups"
              label="Customer Groups"
              filter-url="/items/customer_groups"
              :options="options.customerGroups"
              option-variable-name="customerGroups"
              :mode="mode"
              @filter="filter"
              @update:multi-options="updateMultiOptions"
            />
          </div>
          <div class="col"></div>
        </div>
        <q-checkbox
          v-if="props.showActive && mode !== 'show'"
          v-model="isActive"
          label="is Active"
        />
        <div class="row q-gutter-xl" v-if="mode !== 'show'">
          <div v-if="showReturnButton" class="col">
            <div class="btn-cls" @click="returnDialog = true">
              <p>Return</p>
            </div>
          </div>
          <div class="col">
            <div class="btn-hold">
              <!-- <div
                v-if="showDeleteButton"
                class="btn-cls"
                @click="deleteDialog = true"
              >
                <p>Delete</p>
              </div> -->
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

<script setup lang="ts">
import { onMounted, ref, watch, reactive, computed } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import useCustomerStore from "src/stores/modules/customer";
import { required } from "src/utils/validation-rules";
import useMessagingStore from "src/stores/modules/messaging";
import BaseMultiOptions from "src/components/BaseMultiOptions.vue";
import {
  transforCustomerGroupPayload,
  transformCompaniesPayload,
  transformTagPayload,
} from "src/utils/transform-object";
import { api } from "src/boot/axios";
import type { Tag as ITag } from "src/types/TagTypes";
import type { ICustomerGroup } from "src/types/CustomerGroupTypes";
import type { Company as ICompany } from "src/types/CompanyTypes";
import { useRouter } from "vue-router";

interface Option {
  value: string | number;
  label: string;
}

interface Gender {
  value: "m" | "f";
  label: "Male" | "Female";
}

type Position = Option;
type ITagOptions = Option & ITag;

const emit = defineEmits(["submit"]);
const router = useRouter();
const props = defineProps({
  mode: {
    type: String,
    default: "show",
  },
  showActive: {
    type: Boolean,
    default: true,
  },
  showReturnButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
});
const mode = ref(props.mode ? props.mode : "edit");
const customerStore = useCustomerStore();
const messagingStore = useMessagingStore();
const getContactNumber = computed(() => messagingStore.getContactNumber);
const { getSelectedChatId } = storeToRefs(messagingStore);
const positionOptions: Position[] = [
  { value: "purchase_manager", label: "Purchase Manager" },
  { value: "owner", label: "Owner" },
  { value: "restaurant_chef", label: "Restaurant Chef" },
];
const genderOptions: Gender[] = [
  {
    value: "m",
    label: "Male",
  },
  { value: "f", label: "Female" },
];

const firstName = ref("");
const lastName = ref("");
const idNumber = ref("");
const customerCode = ref("");
const gender: Ref<Gender | undefined> = ref(undefined);
const dateOfBirth = ref("");
const position: Ref<Position | undefined> = ref(undefined);
const companies: Ref<Option[]> = ref([]);
const customerGroups: Ref<Option[]> = ref([]);
const tags: Ref<Option[]> = ref([]);
const isActive = ref(true);

const options: { [key: string]: any[] } = reactive({
  tags: [] as ITagOptions[],
  customerGroups: [] as ICustomerGroup[],
  companies: [] as ICompany[],
});

const deleteDialog = ref(false);
const returnDialog = ref(false);
const customerForm = ref(null);
const { getCustomer } = storeToRefs(customerStore);

onMounted(async () => {
  const customer = customerStore.getCustomer;

  if (customer) {
    firstName.value = customer.first_name;
    lastName.value = customer.last_name;
    idNumber.value = customer.id_number;
    customerCode.value = customer.customer_code;
    dateOfBirth.value = customer.dob;
    isActive.value = customer.isActive;
    position.value = positionOptions.find(
      (item) => item.value === customer.position
    );
    gender.value = genderOptions.find((item) => item.value === customer.gender);

    tags.value = customer.tags.map((data: any) => ({
      label: data.tags_id.name,
      value: data.tags_id.id,
    }));
    companies.value = mappingCompanies();
    customerGroups.value = mappingCustomerGroups();
  }
});

watch(getCustomer, () => {
  mode.value = "show";
  firstName.value = getCustomer.value.first_name;
  lastName.value = getCustomer.value.last_name;
  idNumber.value = getCustomer.value.id_number;
  customerCode.value = getCustomer.value.customer_code;
  dateOfBirth.value = getCustomer.value.dob;
  isActive.value = getCustomer.value.isActive;
  position.value = positionOptions.find(
    (item) => item.value === getCustomer.value.position
  );

  position.value = positionOptions.find(
    (item) => item.value === getCustomer.value.position
  );
  gender.value = genderOptions.find(
    (item) => item.value === getCustomer.value.gender
  );
  tags.value = getCustomer.value.tags.map((data: any) => ({
    label: data.tags_id.name,
    value: data.tags_id.id,
  }));
  companies.value = mappingCompanies();
  customerGroups.value = mappingCustomerGroups();
  customerForm.value?.resetValidation();
});

// Watch Contact number
watch(getContactNumber, (val: string) => {
  customerForm.value?.resetValidation();
  idNumber.value = val;
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

const onSubmit = async () => {
  try {
    if (!customerForm.value) {
      return;
    }
    const validate = await customerForm.value.validate();
    if (!validate) return;
    const payload = {
      first_name: firstName.value,
      last_name: lastName.value,
      id_number: idNumber.value,
      customer_code: customerCode.value,
      gender: gender.value?.value,
      isActive: isActive.value,
      dob: dateOfBirth.value,
      position: position.value?.value,
      customer_groups: transforCustomerGroupPayload(
        getCustomer.value,
        customerGroups.value
      ),
      companies: transformCompaniesPayload(getCustomer.value, companies.value),
      tags: transformTagPayload(getCustomer.value, tags.value),
    };
    emit("submit", payload);
  } catch (err) {
    console.log(err);
  }
};

const discardChanges = () => {
  returnDialog.value = false;
  router.go(-1);
};

const submitDelete = () => {
  deleteDialog.value = false;
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

<style scoped src="./style.scss" />
