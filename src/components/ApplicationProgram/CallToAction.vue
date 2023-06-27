<template>
  <div class="w-full grid sm:grid-cols-12 bg-gray-200 rounded-md p-4 gap-4">
    <div class="col-span-4 flex flex-col">
      <span class="font-semibold"> Type of Action </span>
      <InputSelect
        :options="actionTypeOptions"
        :default="props.action?.type"
        :value="actionType"
        @input="updateActionType"
        class="bg-white rounded-lg"
      />
    </div>
    <div class="col-span-2 flex flex-col">
      <span class="font-semibold"> Button Text </span>
      <input
        type="text"
        class="w-full h-10 block border rounded-lg pl-4"
        v-model="actionText"
        @change="handleAllChange"
      />
    </div>
    <div
      class="col-span-2 sm:col-span-3 md:col-span-2 flex flex-col"
      v-if="actionType === at.CALL_PHONE"
    >
      <span class="font-semibold"> Country: </span>
      <InputSelect
        :options="actionCountryOptions"
        :default="actionCountry"
        :value="actionCountry"
        @input="updateActionCountry"
        class="bg-white rounded-lg"
      />
    </div>
    <div
      class="flex flex-col sm:col-span-4"
      :class="{
        'col-span-4': actionType === at.CALL_PHONE,
        'col-span-6': actionType !== at.CALL_PHONE,
      }"
    >
      <span class="font-semibold">
        {{ actionType === at.CALL_PHONE ? "Phone Number" : "URL" }}
      </span>
      <input
        type="text"
        class="w-full h-10 block border rounded-lg pl-4"
        v-model="actionValue"
        @change="handleAllChange"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { actionType as at } from "../../constants/messageTemplate.js";
import { phoneCodes } from "src/constants/phoneCodes";
import InputSelect from "../InputSelect.vue";

const props = defineProps({
  index: {
    type: Number,
    default: () => 0,
  },
  action: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(["updateAction"]);

const actionTypeOptions = [at.CALL_PHONE, at.VIEW_WEB];
const actionCountryOptions = ref([]);

const actionType = ref(at.CALL_PHONE);
const actionValue = ref("");
const actionText = ref("");
const actionCountry = ref("ID +62");

const updateActionType = (value) => {
  actionType.value = value;
  actionCountry.value = value === at.CALL_PHONE ? "ID +62" : "Static";
  handleAllChange();
};

const updateActionCountry = (value) => {
  actionCountry.value = value;
  handleAllChange();
};

const handleAllChange = () => {
  const emitData = {
    index: props.index,
    type: actionType.value,
    label: actionText.value,
    country: actionCountry.value,
    value: actionValue.value,
  };

  emit("updateAction", emitData);
};

onMounted(() => {
  actionCountryOptions.value = phoneCodes.map(
    (phone) => phone.code + " " + phone.dial_code
  );
  if (props.action !== undefined && props.action !== null) {
    actionType.value = props.action.type;
    actionText.value = props.action.label;
    actionCountry.value = props.action.country;
    actionValue.value = props.action.value;

    handleAllChange();
  }
});
</script>
