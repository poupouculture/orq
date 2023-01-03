<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div
      class="bg-negative q-px-md q-mt-md q-py-md"
      style="border-radius: 20px"
    >
      <div
        class="text-body1 q-mb-sm"
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
      >
        Serving customers
      </div>
      <div
        class="bg-white q-px-sm row"
        style="
          gap: 10px;
          border-radius: 20px;
          padding-top: 6px;
          padding-bottom: 6px;
        "
      >
        <div class="firstInput">
          <InputSelect
            :isBorder="true"
            :options="['full name', 'first name', 'last name']"
          />
        </div>
        <div class="secondInput">
          <InputSelect
            :isColorGray="true"
            :isBorder="true"
            :options="['Chester Buchanan', 'Chester', 'Buchanan']"
          />
        </div>
        <div class="thirdInput">
          <q-toggle v-model="switchBox" />
          <q-icon name="fa-solid fa-lock" size="sm" style="color: gray" />
        </div>
      </div>
    </div>
    <div class="q-mt-xl row items-center" style="gap: 10px">
      <button
        class="bg-primary cursor-pointer text-white no-border no-outline shadow-1"
        style="
          border-radius: 10px;
          padding: 10px 20px;
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
      >
        Merge
      </button>
      <button
        class="q-px-md q-py-sm bg-transparent cursor-pointer text-secondary no-outline"
        style="
          border: 2px solid #4b44f6;
          border-radius: 10px;
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
      >
        Transaction Log
      </button>
    </div>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="start"
      narrow-indicator
      style="
        margin-top: 8px;
        margin-left: -15px;
        border-bottom: 1px solid #e2e2e9;
      "
    >
      <q-tab
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
          text-transform: capitalize;
        "
        name="general"
        label=" General Information "
      />
      <q-tab
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
          text-transform: capitalize;
        "
        name="information"
        label="Other Information"
      />
      <q-tab
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
          text-transform: capitalize;
        "
        name="contact"
        label="Contact Information"
      />
      <q-tab
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
          text-transform: capitalize;
        "
        name="remark"
        label="Remark"
      />
      <q-tab
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
          text-transform: capitalize;
        "
        name="attchment"
        label="Attchment"
      />
    </q-tabs>

    <q-tab-panels style="margin-left: -15px" v-model="tab" animated>
      <q-tab-panel name="general">
        <!-- Service Customer -->
        <div class="row q-mt-sm items-center">
          <div style="width: 13%">
            <div
              class="bg-transparent row items-center justify-center"
              style="
                width: 70px;
                height: 70px;
                border-radius: 10px;
                border: 1px solid #e6e6ec;
              "
            >
              <img
                :src="logo"
                style="width: 70%; height: 70%; object-fit: contain"
              />
            </div>
          </div>
          <div style="display: flex; flex-direction: column; flex: 1">
            <div
              class="text-h6 text-secondary"
              style="
                font-family: 'Archivo', sans-serif;
                font-weight: 500;
                font-size: 14px;
              "
            >
              Service reacord
            </div>
            <InputSelect
              :isColorGray="true"
              :options="['Tags help describe and mange user']"
              default="Tags help describe and mange user"
            />
          </div>
        </div>
        <!-- Service reacord form-->
        <ServiceForm />
      </q-tab-panel>

      <q-tab-panel name="information">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="contact">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <q-tab-panel name="remark">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <q-tab-panel name="attchment">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref } from "vue";
import logo from "../../assets/images/logo.png";
import InputSelect from "../InputSelect.vue";
import ServiceForm from "../ServiceForm.vue";

const tab = ref("general");
const switchBox = ref("");
</script>

<style scoped>
.firstInput {
  width: 16%;
}
.thirdInput {
  border-left: 1px solid #e2e2e9;
}
.secondInput {
  display: flex;
  flex: 1;
  border-left: 1px solid #e2e2e9;
  padding-left: 10px;
}

@media (max-width: 550px) {
  .firstInput {
    width: 100%;
    margin-bottom: 10px;
  }
  .thirdInput {
    width: 100%;
    border: none;
  }
  .secondInput {
    width: 100%;
    border: none;
    padding-left: 0px;
    margin-bottom: 10px;
  }
}
</style>
