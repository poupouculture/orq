<template>
  <q-dialog v-model="deletedialog" persistent class="dialog-class">
    <q-card class="card-class">
      <q-card-section class="row items-center">
        <img src="../../assets/images/warning.png" />
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
        <img src="../../assets/images/warning.png" />
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
  <div v-if="customerStore.customer">
    <div class="q-pa-md">
      <div class="row">
        <div class="col-2">
          <img src="../../assets/images/imagetaker.png" name="folder_open" />
        </div>
        <div class="col-10">
          <div class="field-holder">
            <p class="label-style">Label</p>
            <q-select outlined v-model="tags" :options="options" dense />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="label-style">First Name</p>
          <q-input
            outlined
            v-model="customerStore.customer.first_name"
            class="indi"
            dense
          />
        </div>
        <div class="col">
          <p class="label-style">Last Name</p>
          <q-input
            outlined
            v-model="customerStore.customer.last_name"
            class="indi"
            dense
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="label-style">ID Number</p>
          <q-input
            outlined
            v-model="customerStore.customer.id_number"
            class="indi"
            dense
          />
        </div>
        <div class="col">
          <p class="label-style">Customer Code</p>
          <q-input
            outlined
            v-model="customerStore.customer.customer_code"
            class="indi"
            dense
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="label-style">Gender</p>
          <q-select outlined v-model="gender" :options="genderdata" dense />
        </div>
        <div class="col">
          <p class="label-style">Date Of Birth</p>
          <q-input
            v-model="date"
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
      <div class="row">
        <div class="col">
          <p class="label-style">Position</p>
          <q-select outlined v-model="position" :options="positiondata" dense />
        </div>
        <div class="col">
          <p class="label-style">Company</p>
          <q-select outlined v-model="company" :options="companydata" dense />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="label-style">Customer Group</p>
          <q-select outlined v-model="position" :options="positiondata" dense />
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
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
import "./GeneralInformation.scss";
import useCustomerStore from "src/stores/modules/customer";

const customerStore = useCustomerStore();

const gender = ref();
const deletedialog = ref(false);
const savedialog = ref(false);
const tags = ref("");
const options = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];
const genderdata = ["Male", "Female", "Others"];
</script>

<style lang="sass" scoped>
.row > div
  padding: 5px 10px
.row + .row
  margin-top: 1rem
</style>
