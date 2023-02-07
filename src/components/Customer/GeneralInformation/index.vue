<template>
  <div>
    <q-form
      ref="customerForm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    >
      <div class="q-pa-md">
        <div class="row q-mb-lg">
          <div class="col-2">
            <img
              src="../../../assets/images/imagetaker.png"
              name="folder_open"
            />
          </div>
          <div class="col-10">
            <div class="field-holder">
              <p class="label-style">Label</p>
              <q-select
                outlined
                v-model="tag"
                :options="tagOptions"
                :disable="mode == 'show'"
                dense
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
            <p class="label-style">ID Number</p>
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
        <div class="row q-mb-lg q-gutter-xl">
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
            <p class="label-style">Company</p>
            <q-select
              outlined
              v-model="company"
              :options="companyOptions"
              dense
              :disable="mode == 'show'"
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Customer Group</p>
            <q-select
              outlined
              v-model="customerGroup"
              :options="customerGroupOptions"
              dense
              :disable="mode == 'show'"
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
                @click="onSubmit"
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
      @keepEditing="returnDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import useCustomerStore from "src/stores/modules/customer";
import type { ICustomerGroup } from "src/types/CustomerGroupTypes";
import { required } from "src/utils/validation-rules";
import { getAllCustomerGroups } from "src/api/customerGroup";
import { getCompanies } from "src/api/companies";
import type { Company as ICompany } from "src/types/CompanyTypes";
import type { Tag } from "src/types/TagTypes";
import { getTags } from "src/api/tag";
import { useQuasar } from "quasar";
import useMessagingStore from "src/stores/modules/messaging";

interface Option {
  value: string | number;
  label: string;
}

interface Gender {
  value: "m" | "f";
  label: "Male" | "Female";
}

type Position = Option;
type ICustomerGroupOptions = Option & ICustomerGroup;
type ICompanyOptions = Option & ICompany;
type ITagOptions = Option & Tag;

const emit = defineEmits(["submit"]);
const props = defineProps({
  mode: String,
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
const customerStore = useCustomerStore();
const messagingStore = useMessagingStore();
const { getContactNumber } = storeToRefs(messagingStore);
const $q = useQuasar();

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
const company: Ref<ICompany | undefined> = ref(undefined);
const customerGroup: Ref<ICustomerGroup | undefined> = ref(undefined);
const isActive = ref(true);
const companyOptions: Ref<ICompanyOptions[] | undefined> = ref(undefined);
const customerGroupOptions: Ref<ICustomerGroupOptions[] | undefined> =
  ref(undefined);
const tagOptions: Ref<Tag[] | undefined> = ref(undefined);
const tag: Ref<Tag | undefined> = ref(undefined);

const deleteDialog = ref(false);
const returnDialog = ref(false);
const customerForm = ref(null);
const { getCustomer } = storeToRefs(customerStore);

onMounted(async () => {
  $q.loading.show({
    message: "Please wait...",
    boxClass: "bg-grey-2 text-grey-9",
    spinnerColor: "primary",
  });

  const customer = customerStore.getCustomer;

  const [customerGroups_, companies_, tags_] = await Promise.all([
    getAllCustomerGroups(),
    getCompanies(),
    getTags(),
  ]);
  const mappedCustomerGroups = customerGroups_.data.data.map(
    (item: ICustomerGroupOptions) => {
      item.value = item.id;
      item.label = item.name;
      return item;
    }
  );
  customerGroupOptions.value = mappedCustomerGroups;
  const mappedCompanies = companies_.data.data.map((item: ICompanyOptions) => {
    item.value = item.id;
    item.label = item.name_english;
    return item;
  });
  companyOptions.value = mappedCompanies;
  const mappedTags = tags_.data.data.map((item: ITagOptions) => {
    item.value = item.id;
    item.label = item.name;
    return item;
  });
  tagOptions.value = mappedTags;

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

    if (customer.customer_groups.length) {
      customerGroup.value = customerGroupOptions.value?.find(
        (item: ICustomerGroupOptions) =>
          item.value === customer.customer_groups[0].customer_groups_id
      );
    }

    if (customer.companies?.length) {
      company.value = companyOptions.value?.find(
        (item: ICompanyOptions) =>
          item.value === customer.companies[0].companies_id.id
      );
    }

    if (customer.tags?.length) {
      tag.value = tagOptions.value?.find(
        (item: ITagOptions) => item.value === customer.tags[0].tags_id.id
      );
    }
  }

  $q.loading.hide();
});

watch(getCustomer, () => {
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

  if (getCustomer.value.customer_groups.length) {
    customerGroup.value = customerGroupOptions.value?.find(
      (item: ICustomerGroupOptions) =>
        item.value === getCustomer.value.customer_groups[0].customer_groups_id
    );
  }
  if (getCustomer.value.companies?.length) {
    company.value = companyOptions.value?.find(
      (item: ICompanyOptions) =>
        item.value === getCustomer.value.companies[0].companies_id.id
    );
  }

  if (getCustomer.value.tags?.length) {
    tag.value = tagOptions.value?.find(
      (item: ITagOptions) => item.value === getCustomer.value.tags[0].tags_id.id
    );
  }
});

// Watch Contact number
watch(getContactNumber, (val: string) => {
  idNumber.value = val;
});

const submitDelete = () => {
  deleteDialog.value = false;
};

const onSubmit = async () => {
  try {
    if (!customerForm.value) {
      return;
    }

    const validate = await customerForm.value.validate();

    if (validate) {
      const payload = {
        first_name: firstName.value,
        last_name: lastName.value,
        id_number: idNumber.value,
        customer_code: customerCode.value,
        gender: gender.value?.value,
        isActive: isActive.value,
        dob: dateOfBirth.value,
        position: position.value?.value,
        customer_groups: [{ customer_groups_id: customerGroup.value?.id }],
        companies: [{ companies_id: company.value?.id }],
        tags: [{ tags_id: tag.value?.id }],
      };
      emit("submit", payload);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped src="./style.scss" />
