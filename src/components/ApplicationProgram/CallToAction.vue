<template>
    <div class="w-full grid grid-cols-12 bg-gray-200 ml-4 rounded-md p-4 gap-4">
        <div class="col-span-4 flex flex-col">
        <span class="font-semibold">
            Type of Action
        </span>
        <InputSelect
            :options="actionTypeOptions"
            default="Call Phone Number"
            :value="actionType"
            @input="updateActionType"
            class="bg-white rounded-lg"
        />
        </div>
        <div class="col-span-2 flex flex-col">
        <span class="font-semibold">
            Button Text
        </span>
        <input
            type="text"
            class="w-full h-10 block border rounded-lg pl-4"
            v-model="actionText"
            @change="handleAllChange"
            />
        </div>
        <div class="col-span-3 flex flex-col">
        <span class="font-semibold">
            {{ actionType === at.CALL_PHONE ? 'Country' : 'URL Type' }}
        </span>
        <InputSelect
            :options="actionType === at.CALL_PHONE ? actionCountryOptions : actionWebtypeOptions"
            :default="actionType === at.CALL_PHONE ? 'ID +62' : 'Static'"
            :value="actionCountryOrWebtype"
            @input="updateActionCountryOrWebtype"
            class="bg-white rounded-lg"
        />
        </div>
        <div class="col-span-3 flex flex-col">
        <span class="font-semibold">
            {{ actionType === at.CALL_PHONE ? 'Phone Number' : 'URL' }}
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
import { ref } from "vue";
import { actionType as at } from "../../consttants/ApplicationProgram.js";
import InputSelect from "../InputSelect.vue";

const props = defineProps({
    index: {
        type: Number,
        default: () => 0
    }
});

const emit = defineEmits(["updateAction"]);

const actionTypeOptions = [at.CALL_PHONE, at.VIEW_WEB];
const actionCountryOptions = ["HK +852", "ID +62"];
const actionWebtypeOptions = ["Static", "Dynamic"];

const actionType = ref(at.CALL_PHONE);
const actionValue = ref('');
const actionText = ref('');
const actionCountryOrWebtype = ref('');

const updateActionType = (value) => {
  actionType.value = value;
  handleAllChange();
}

const updateActionCountryOrWebtype = (value) => {
  actionCountryOrWebtype.value = value;
  handleAllChange();
}

const handleAllChange = () => {
    emit('updateAction', {
        index: props.index,
        type: actionType.value,
        label: actionText.value,
        countryOrWebtype: actionCountryOrWebtype.value,
        value: actionValue.value
    });
}
</script>
