<script setup lang="ts">
import { onMounted, ref, watch, reactive, computed } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import useCustomerStore from "src/stores/modules/customer";
import useContactStore from "src/stores/modules/contact";
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
import { IState } from "src/types/CustomerTypes";
import { QForm } from "quasar";

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

const emit = defineEmits(["submit", "delete", "discard"]);
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
const contactStore = useContactStore();
const getContactNumber = computed(() => messagingStore.getContactNumber);
const { getSelectedChatId } = storeToRefs(messagingStore);
const { getCurrentCustomerId, getContacts } = storeToRefs(contactStore);
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

const firstName: Ref<string | undefined> = ref("");
const lastName: Ref<string | undefined> = ref("");
const idNumber: Ref<string | undefined> = ref("");
const customerCode: Ref<string | undefined> = ref("");
const gender: Ref<Gender | undefined> = ref(undefined);
const position: Ref<Position | undefined> = ref(undefined);
const companies: Ref<Option[]> = ref([]);
const customerGroups: Ref<Option[]> = ref([]);
const tags: Ref<Option[]> = ref([]);
const isActive: Ref<IState["customer"]["is_active"]> = ref(false);
const locationCode: Ref<IState["customer"]["location_code"]> = ref(null);
const tel: Ref<IState["customer"]["tel"] | undefined> = ref("");
const deliveryLocationAddress: Ref<
  IState["customer"]["delivery_location_address"]
> = ref("");
const customerCompanyNameEn: Ref<
  IState["customer"]["customer_company_name_en"]
> = ref("");
const customerCompanyNameZht: Ref<
  IState["customer"]["customer_company_name_zht"]
> = ref("");
const delylocNo: Ref<IState["customer"]["delyloc_no"]> = ref("");
const divNo: Ref<IState["customer"]["div_no"]> = ref("");
const delylocNameE: Ref<IState["customer"]["delyloc_add1_e"]> = ref("");
const delylocNameC: Ref<IState["customer"]["delyloc_name_c"]> = ref("");
const delylocAdd1E: Ref<IState["customer"]["delyloc_add1_e"]> = ref("");
const delylocAdd2E: Ref<IState["customer"]["delyloc_add2_e"]> = ref("");
const delylocAdd3E: Ref<IState["customer"]["delyloc_add3_c"]> = ref("");
const delylocAdd1C: Ref<IState["customer"]["delyloc_add1_c"]> = ref("");
const delylocAdd2C: Ref<IState["customer"]["delyloc_add2_c"]> = ref("");
const delylocAdd3C: Ref<IState["customer"]["delyloc_add3_c"]> = ref("");
const companyCd: Ref<IState["customer"]["company_cd"] | undefined> = ref("");
const salesmanCd: Ref<IState["customer"]["salesman_cd"]> = ref("");
const lastModifyDate: Ref<IState["customer"]["last_modify_date"]> = ref("");

const options: { [key: string]: any[] } = reactive({
  tags: [] as ITagOptions[],
  customerGroups: [] as ICustomerGroup[],
  companies: [] as ICompany[],
});

const deleteDialog = ref(false);
const returnDialog = ref(false);
const customerForm: Ref<QForm | undefined> = ref();
const { getCustomer, resetForm, isCustomerExist } = storeToRefs(customerStore);
onMounted(async () => {
  const customer = customerStore.getCustomer;

  if (customer) {
    firstName.value = customer.first_name;
    lastName.value = customer.last_name;
    // idNumber.value = customer.id_number;
    customerCode.value = customer.customer_code;
    // dateOfBirth.value = customer.dob;
    isActive.value = customer.is_active || false;
    companyCd.value = customer.company_cd;
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
    tel.value = customer.tel;
    deliveryLocationAddress.value = customer.delivery_location_address;
    customerCompanyNameEn.value = customer.customer_company_name_en;
    customerCompanyNameZht.value = customer.customer_company_name_zht;
    delylocNo.value = customer.delyloc_no;
    divNo.value = customer.div_no;
    delylocNameE.value = customer.delyloc_name_e;
    delylocNameC.value = customer.delyloc_name_c;
    delylocAdd1E.value = customer.delyloc_add1_e;
    delylocAdd2E.value = customer.delyloc_add2_e;
    delylocAdd3E.value = customer.delyloc_add3_e;
    delylocAdd1C.value = customer.delyloc_add1_c;
    delylocAdd2C.value = customer.delyloc_add2_c;
    delylocAdd3C.value = customer.delyloc_add3_c;
    salesmanCd.value = customer.salesman_cd;
    lastModifyDate.value = customer.last_modify_date;
    locationCode.value = customer.location_code;
  }
});

watch(getCustomer, () => {
  mode.value = "show";
  firstName.value = getCustomer.value.first_name;
  lastName.value = getCustomer.value.last_name;
  // idNumber.value = getCustomer.value.id_number;
  customerCode.value = getCustomer.value.customer_code;
  // dateOfBirth.value = getCustomer.value.dob;
  isActive.value = getCustomer.value.is_active;
  companyCd.value = getCustomer.value.company_cd;
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
  tel.value = getCustomer.value.tel;
  deliveryLocationAddress.value = getCustomer.value.delivery_location_address;
  customerCompanyNameEn.value = getCustomer.value.customer_company_name_en;
  customerCompanyNameZht.value = getCustomer.value.customer_company_name_zht;
  delylocNo.value = getCustomer.value.delyloc_no;
  divNo.value = getCustomer.value.div_no;
  delylocNameE.value = getCustomer.value.delyloc_name_e;
  delylocNameC.value = getCustomer.value.delyloc_name_c;
  delylocAdd1E.value = getCustomer.value.delyloc_add1_e;
  delylocAdd2E.value = getCustomer.value.delyloc_add2_e;
  delylocAdd3E.value = getCustomer.value.delyloc_add3_e;
  delylocAdd1C.value = getCustomer.value.delyloc_add1_c;
  delylocAdd2C.value = getCustomer.value.delyloc_add2_c;
  delylocAdd3C.value = getCustomer.value.delyloc_add3_c;
  salesmanCd.value = getCustomer.value.salesman_cd;
  lastModifyDate.value = getCustomer.value.last_modify_date;
  companies.value = mappingCompanies();
  customerGroups.value = mappingCustomerGroups();
  customerForm.value?.resetValidation();
  locationCode.value = getCustomer.value.location_code;
});

// Watch Contact number

watch(getContactNumber, (val: string) => {
  customerForm.value?.resetValidation();
  idNumber.value = val;
});

watch(resetForm, (value) => {
  if (value) {
    onReset();
  }

  resetForm.value = false;
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

const onReset = () => {
  firstName.value = "";
  lastName.value = "";
  idNumber.value = "";
  customerCode.value = "";
  gender.value = undefined;
  position.value = undefined;
  companies.value = [];
  customerGroups.value = [];
  tags.value = [];
  isActive.value = false;
  locationCode.value = null;
  tel.value = "";
  deliveryLocationAddress.value = "";
  customerCompanyNameEn.value = "";
  customerCompanyNameZht.value = "";
  delylocNo.value = "";
  divNo.value = "";
  delylocNameE.value = "";
  delylocNameC.value = "";
  delylocAdd1E.value = "";
  delylocAdd2E.value = "";
  delylocAdd3E.value = "";
  delylocAdd1C.value = "";
  delylocAdd2C.value = "";
  delylocAdd3C.value = "";
  companyCd.value = "";
  salesmanCd.value = "";
  lastModifyDate.value = "";
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
      // id_number: idNumber.value,
      customer_code: customerCode.value,
      gender: gender.value?.value,
      isActive: isActive.value,
      // dob: dateOfBirth.value,
      position: position.value?.value,
      customer_groups: transforCustomerGroupPayload(
        getCustomer.value,
        customerGroups.value
      ),
      companies: transformCompaniesPayload(getCustomer.value, companies.value),
      tags: transformTagPayload(getCustomer.value, tags.value),
      location_code: locationCode.value,
      tel: tel.value,

      customer_company_name_en: customerCompanyNameEn.value,
      customer_company_name_zht: customerCompanyNameZht.value,

      div_no: divNo.value,
      delyloc_name_e: delylocNameE.value,
      delyloc_name_c: delylocNameC.value,
      delyloc_add1_e: delylocAdd1E.value,
      delyloc_add2_e: delylocAdd2E.value,
      delyloc_add3_e: delylocAdd3E.value,
      delyloc_add1_c: delylocAdd1C.value,
      delyloc_add2_c: delylocAdd2C.value,
      delyloc_add3_c: delylocAdd3C.value,
      salesman_cd: salesmanCd.value,
      company_cd: companyCd.value,
    };
    mode.value = "show";
    emit("submit", payload);
  } catch (err) {
    console.log(err);
  }
};

const discardChanges = () => {
  returnDialog.value = false;
  emit("discard");
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
    .filter(
      (data: any) =>
        data.customer_groups_id !== null &&
        data.customer_groups_id.type !== "personal"
    )
    .map((data: any) => ({
      label: data.customer_groups_id.name,
      value: data.customer_groups_id.id,
    }));
};

const associateContactLoading = ref(false);
const associateContact = async () => {
  associateContactLoading.value = true;
  const response = await customerStore.addContact(
    getCustomer.value.id,
    getContacts.value.id
  );
  console.log(response);
  if (response?.data?.status) {
    console.log(" associating: SUCCESS");
    // await messagingStore.fetchChats();
    contactStore.setCurrentCustomerId(getCustomer.value.id);
    associateContactLoading.value = false;
    // messagingStore.assignChatCustomer(getCustomer.value.id, customer);
    // messagingStore.setChatCustomerContact(getSelectedChat.value);
  } else {
    console.log(" associating: FAILURE");
    // tbd show error
  }
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
      <div class="q-pa-sm">
        <div
          class="q-mb-lg flex"
          :class="[
            isCustomerExist && getCustomer?.id !== getCurrentCustomerId
              ? 'justify-between'
              : 'justify-end',
          ]"
          v-if="getSelectedChatId"
        >
          <q-btn
            @click="associateContact"
            :loading="associateContactLoading"
            v-if="isCustomerExist && getCustomer?.id !== getCurrentCustomerId"
            color="primary"
            label="ASSOCIATE"
            class="dark-btn"
          />
          <!-- <q-btn
            v-if="mode === 'show'"
            @click="mode = 'edit'"
            color="primary"
            label="Edit"
            class="dark-btn"
          /> -->

          <q-btn
            v-if="mode === 'edit'"
            @click="mode = 'show'"
            outline
            style="color: red"
            >Cancel</q-btn
          >
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Customer Name (English)</p>
            <q-input
              v-model="customerCompanyNameEn"
              class="indi"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Customer Name (Chinese)</p>
            <q-input
              v-model="customerCompanyNameZht"
              class="indi"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-gutter-xl">
          <div class="col">
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
          <div class="col">
            <p class="label-style">Company Tel.</p>
            <q-input
              v-model="tel"
              class="indi"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
        </div>
        <div class="row q-mb-xs q-gutter-xl">
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
        </div>
        <div class="row q-gutter-xl">
          <div class="col">
            <p class="label-style">Division No.</p>
            <q-input
              v-model="divNo"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Location Code</p>
            <q-input
              v-model="locationCode"
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
            <p class="label-style">Salesman Code</p>
            <div class="flex flex-col gap-4">
              <q-input
                v-model="salesmanCd"
                class="indi"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
            </div>
          </div>
          <div class="col">
            <p class="label-style">Gender</p>
            <q-select
              v-model="gender"
              :options="genderOptions"
              outlined
              lazy-rules
              :disable="mode == 'show'"
              dense
            />
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
          <div class="col flex flex-col gap-3">
            <p class="label-style">Address (English)</p>
            <div class="flex flex-col gap-4">
              <q-input
                v-model="delylocAdd1E"
                class="indi"
                outlined
                lazy-rules
                :disable="mode == 'show'"
                dense
              />
            </div>
          </div>
          <div class="col flex flex-col gap-3">
            <p class="label-style">Address (Chinese)</p>
            <div class="flex flex-col gap-4">
              <q-input
                v-model="delylocAdd1C"
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
          <div class="col flex">
            <p class="label-style">Last modified date</p>
            <q-input
              v-model="lastModifyDate"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              disable
              dense
            />
          </div>
          <div class="col">
            <div class="">
              <p class="label-style">Company Code</p>
              <q-input
                v-model="companyCd"
                disable
                class="indi w-full"
                outlined
                lazy-rules
                dense
              />
            </div>
            <div class="">
              <q-checkbox
                :disable="mode == 'show'"
                v-model="isActive"
                :true-value="true"
                :false-value="false"
                label="Customer Active"
              />
            </div>
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
      @submitDelete="$emit('delete')"
    />
    <ReturnDialog
      v-model="returnDialog"
      @cancel="returnDialog = false"
      @submit="discardChanges()"
    />
  </div>
</template>

<style scoped src="./style.scss" />
