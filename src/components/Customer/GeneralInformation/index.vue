<template>
  <q-dialog v-model="deletedialog" persistent class="dialog-class">
    <q-card class="card-class">
      <q-card-section class="row items-center">
        <img src="assets/images/warning.png" />
        <span class="q-ml-sm">
          <p class="deletetxt">Delete</p>
        </span>
      </q-card-section>
      <p class="lowertext">
        This action is permanent and can not be undone. Are you sure you would
        like to proceed?
      </p>
      <q-card-actions align="right" class="btn-hld">
        <q-btn
          color="primary"
          label="Cancel"
          v-close-popup
          outline
          class="dialogbtn-cls"
        />

        <q-btn
          color="primary"
          label="Delete"
          v-close-popup
          class="dialogbtn-cls"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="savedialog" persistent class="dialog-class">
    <q-card class="card-class">
      <q-card-section class="row items-center">
        <img src="assets/images/warning.png" />
        <span class="q-ml-sm">
          <p class="deletetxt">Unsave Changes</p>
        </span>
      </q-card-section>
      <p class="lowertext">Are you sure you want to leave this page?</p>
      <q-card-actions align="right" class="btn-hld">
        <q-btn
          color="primary"
          label="Discard Changes"
          v-close-popup
          outline
          class="dialogbtn-cls"
        />

        <q-btn
          color="primary"
          label="Keep Editing"
          v-close-popup
          class="dialogbtn-cls"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div>
    <div class="q-pa-md">
      <div class="row q-mb-lg">
        <div class="col-2">
          <img src="../../../assets/images/imagetaker.png" name="folder_open" />
        </div>
        <div class="col-10">
          <div class="field-holder">
            <p class="label-style">Label</p>
            <q-select outlined v-model="tags" :options="options" dense />
          </div>
        </div>
      </div>
      <div class="row q-mb-lg q-gutter-xl">
        <div class="col">
          <p class="label-style">First Name</p>
          <q-input v-model="firstName" outlined class="indi" dense />
        </div>
        <div class="col">
          <p class="label-style">Last Name</p>
          <q-input v-model="lastName" outlined class="indi" dense />
        </div>
      </div>
      <div class="row q-mb-lg q-gutter-xl">
        <div class="col">
          <p class="label-style">ID Number</p>
          <q-input v-model="idNumber" outlined class="indi" dense />
        </div>
        <div class="col">
          <p class="label-style">Customer Code</p>
          <q-input v-model="customerCode" outlined class="indi" dense />
        </div>
      </div>
      <div class="row q-gutter-xl">
        <div class="col">
          <p class="label-style">Gender</p>
          <q-select outlined v-model="gender" :options="genderdata" dense />
        </div>
        <div class="col">
          <p class="label-style">Date Of Birth</p>
          <q-input
            v-model="dateOfBirth"
            mask="####-##-##"
            :rules="['date']"
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
                    v-model="date"
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
          <q-select outlined v-model="position" :options="positiondata" dense />
        </div>
        <div class="col">
          <p class="label-style">Company</p>
          <q-select outlined v-model="company" :options="companydata" dense />
        </div>
      </div>
      <div class="row q-mb-lg q-gutter-xl">
        <div class="col">
          <p class="label-style">Customer Group</p>
          <q-select
            outlined
            v-model="customerGroup"
            :options="positiondata"
            dense
          />
        </div>
        <div class="col"></div>
      </div>
      <div class="row q-mb-lg q-gutter-xl">
        <div class="col">
          <!-- <q-btn to="/" label="Delayed navigation" @click="onDelayedClick"  color="purple" no-caps class="btn-cls" /> -->
          <div class="btn-cls">
            <p>Return</p>
          </div>
        </div>
        <div class="col">
          <div class="btn-hold">
            <div class="btn-cls" @click="deletedialog = true">
              <p>Delete</p>
            </div>
            <q-btn
              color="primary"
              label="Save"
              class="dark-btn"
              @click="savedialog = true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  customer: {
    type: Object,
    default: () => ({
      firstName: "",
      lastName: "",
      idNumber: "",
      customerCode: "",
      gender: "",
      dateOfBirth: "",
      position: "",
      company: "",
      customerGroup: "",
    }),
  },
});

const firstName = ref(props.customer.firstName);
const lastName = ref(props.customer.lastName);
const idNumber = ref(props.customer.idNumber);
const customerCode = ref(props.customer.customerCode);
const gender = ref(props.customer.gender);
const dateOfBirth = ref(props.customer.dateOfBirth);
const position = ref(props.customer.position);
const company = ref(props.customer.company);
const customerGroup = ref(props.customer.customerGroup);

const deletedialog = ref(false);
const savedialog = ref(false);
const tags = ref("");
const options = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];
const genderdata = ["Male", "Female", "Others"];
</script>

<style scoped src="./style.scss"></style>
