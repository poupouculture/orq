<template>
  <form @submit.prevent="handleSubmit" class="q-mt-xl">
    <div class="row items-center" style="gap: 30px">
      <div
        class="col-12 col-md q-mb-md"
        style="display: flex; flex-direction: column"
      >
        <label
          class="text-body1 text-secondary text-weight-medium q-mb-sm"
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
        >
          Surename
          <span style="color: #eb483f">*</span>
        </label>
        <input
          style="
            border: 1px solid #e2e2e2;
            border-radius: 8px;
            width: 100%;
            color: #d9d9d9;
          "
          class="q-px-md q-py-sm"
          placeholder="Surename"
          v-modal="surename"
        />
      </div>
      <div
        class="col-12 col-md q-mb-md"
        style="display: flex; flex-direction: column"
      >
        <label
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
          class="text-body1 text-secondary text-weight-medium q-mb-sm"
          >Name</label
        >
        <input
          style="
            border: 1px solid #e2e2e2;
            border-radius: 8px;
            width: 100%;
            color: #d9d9d9;
          "
          class="q-px-md q-py-sm"
          placeholder="Name"
          v-modal="name"
        />
      </div>
    </div>
    <div class="row items-center" style="gap: 30px">
      <div
        class="col-12 col-md q-mb-md"
        style="display: flex; flex-direction: column"
      >
        <label
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
          class="text-body1 text-secondary text-weight-medium q-mb-sm"
          >ID field</label
        >
        <input
          style="
            border: 1px solid #e2e2e2;
            border-radius: 8px;
            width: 100%;
            color: #d9d9d9;
          "
          class="q-px-md q-py-sm"
          placeholder="ID field"
          v-modal="id"
        />
      </div>
      <div
        class="col-12 col-md q-mb-md"
        style="display: flex; flex-direction: column"
      >
        <label
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
          class="text-body1 text-secondary text-weight-medium q-mb-sm"
          >Customer Code</label
        >
        <input
          style="
            border: 1px solid #e2e2e2;
            border-radius: 8px;
            width: 100%;
            color: #d9d9d9;
          "
          class="q-px-md q-py-sm"
          placeholder="Customer Code"
          v-modal="customerCode"
        />
      </div>
    </div>
    <div class="row items-center" style="gap: 30px">
      <div
        class="col-12 col-md q-mb-md"
        style="display: flex; flex-direction: column"
      >
        <label
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
          class="text-body1 text-secondary text-weight-medium q-mb-sm"
          >Gender {{ gender }}
        </label>
        <InputSelect
          :options="options"
          default="Girl"
          :value="gender"
          @input="updateValue"
        />
      </div>
      <div
        class="col-12 col-md q-mb-md"
        style="display: flex; flex-direction: column"
      >
        <label
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
          class="text-body1 text-secondary text-weight-medium q-mb-sm"
          >Date of birth</label
        >
        <input
          style="
            border: 1px solid #e2e2e2;
            border-radius: 8px;
            width: 100%;
            color: #d9d9d9;
          "
          class="q-px-md q-py-sm"
          placeholder="Date of birth"
          v-modal="dateOfBirth"
          type="date"
        />
      </div>
    </div>
    <div class="row items-center" style="gap: 30px">
      <div
        class="col-12 col-md q-mb-md"
        style="display: flex; flex-direction: column"
      >
        <label
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
          class="text-body1 text-secondary text-weight-medium q-mb-sm"
          >Responsible member</label
        >
        <InputSelect
          :options="options"
          default="Name and login and number"
          :value="member"
          @input="updateValue"
        />
      </div>
      <div
        class="col-12 col-md q-mb-md"
        style="display: flex; flex-direction: column"
      >
        <label
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
          class="text-body1 text-secondary text-weight-medium q-mb-sm"
          >Group Leader</label
        >
        <InputSelect
          :isColorGray="true"
          :icon="pencil"
          :options="options"
          default="Group master name"
          :value="groupLeader"
          @input="updateValue"
        />
      </div>
    </div>
    <div
      class="col-12 col-md q-mb-md"
      style="display: flex; flex-direction: column"
    >
      <label
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
        class="text-body1 text-secondary text-weight-medium q-mb-sm"
        >Company</label
      >
      <InputSelect
        :isColorGray="true"
        :icon="plus"
        :options="options"
        default="The establishment of this customer company will help you to analyze the rules and regulations"
        :value="company"
        @input="updateValue"
      />
    </div>
    <v-select :options="options"></v-select>
    <div class="row items-center q-mt-md" style="gap: 10px">
      <button
        class="q-px-md q-py-sm text-weight-medium text-white no-border no-outline bg-primary cursor-pointer"
        style="
          border: 2px solid #e2e2e9;
          border-radius: 50px;
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
        type="submit"
      >
        Stroage
      </button>
      <button
        class="q-px-md q-py-sm text-weight-medium text-secondary cursor-pointer"
        style="
          border: 2px solid #e2e2e9;
          border-radius: 50px;
          background: transparent;
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
        type="submit"
      >
        Complete this service
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import InputSelect from "../components/InputSelect.vue";
import pencil from "../assets/edit.png";
import plus from "../assets/plus.png";

const surename = ref("");
const options = ["Male", "Female"];
const name = ref("");
const company = ref("");
const id = ref("");
const customerCode = ref("");
const gender = ref(null);
const dateOfBirth = ref(null);
const member = ref(null);
const groupLeader = ref(null);

function handleSubmit() {
  console.log("submit");
}
</script>

<style>
.q-select__dropdown-icon {
  display: none !important;
}
</style>
