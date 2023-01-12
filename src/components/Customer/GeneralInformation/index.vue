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
              <q-select outlined v-model="tags" dense />
            </div>
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">First Name</p>
            <q-input
              v-model="firstName"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
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
              dense
            />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">ID Number</p>
            <q-input
              v-model="idNumber"
              class="indi"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
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
            <q-select outlined v-model="position" dense />
          </div>
          <div class="col">
            <p class="label-style">Company</p>
            <q-select outlined v-model="company" dense />
          </div>
        </div>
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Customer Group</p>
            <q-select outlined v-model="customerGroup" dense />
          </div>
          <div class="col"></div>
        </div>
        <q-checkbox v-model="isActive" label="is Active" />
        <div class="row q-mb-lg q-gutter-xl q-mt-lg">
          <div class="col">
            <div class="btn-cls" @click="returnDialog = true">
              <p>Return</p>
            </div>
          </div>
          <div class="col">
            <div class="btn-hold">
              <div class="btn-cls" @click="deleteDialog = true">
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

<script setup>
import { onMounted, ref } from "vue";
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import useCustomerStore from "src/stores/modules/customer.js";
import { required } from "src/utils/validation-rules.js";

const emit = defineEmits(["submit"]);
const customerStore = useCustomerStore();

const firstName = ref("");
const lastName = ref("");
const idNumber = ref("");
const customerCode = ref("");
const gender = ref("");
const dateOfBirth = ref("");
const position = ref("");
const company = ref("");
const customerGroup = ref("");
const isActive = ref("");

const deleteDialog = ref(false);
const returnDialog = ref(false);
const tags = ref("");
const genderOptions = [
  {
    value: "m",
    label: "Male",
  },
  { value: "f", label: "Female" },
];
const customerForm = ref(null);
// const options = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];

onMounted(() => {
  const customer = customerStore.getCustomer;
  if (customer) {
    firstName.value = customer.first_name;
    lastName.value = customer.last_name;
    idNumber.value = customer.id_number;
    customerCode.value = customer.customer_code;
    dateOfBirth.value = customer.dob;
    isActive.value = customer.isActive;

    gender.value = genderOptions.find((item) => item.value === customer.gender);
  }
});

const submitDelete = () => {
  deleteDialog.value = false;
};

const onSubmit = async () => {
  try {
    const validate = await customerForm.value.validate();

    if (validate) {
      const payload = {
        first_name: firstName.value,
        last_name: lastName.value,
        id_number: idNumber.value,
        customer_code: customerCode.value,
        gender: gender.value.value,
        isActive: isActive.value,
        dob: dateOfBirth.value,
      };
      emit("submit", payload);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped src="./style.scss" />
