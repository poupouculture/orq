<template>
  <q-dialog :modelValue="modelValue" @hide="hide" persistent>
    <q-card style="min-width: 55%" class="q-pa-lg flex">
      <div class="w-full flex flex-col">
        <div class="w-full flex justify-end">
          <q-icon name="close" class="cursor-pointer" @click="hide" />
        </div>
        <div class="w-full my-2">
          <div class="text-lg">File Preview</div>
          <div
            class="text-center flex justify-center flex-col items-center my-4"
          >
            <q-icon
              name="file_present"
              size="4rem"
              class="text-gray-600"
            ></q-icon>
            <span class="text-gray-700 mt-2">{{ file[0]?.name }}</span>
          </div>
          <textarea
            type="text"
            class="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/30 focus:border-primary"
            placeholder="Type your caption here..."
            v-model="caption"
          ></textarea>
        </div>
      </div>

      <div class="w-full flex justify-end gap-2 px-4 mt-4">
        <button class="btn-dotted" @click="hide">Close</button>
        <button
          class="px-4 py-2 bg-primary text-white rounded-md"
          @click="send"
        >
          Send
        </button>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emits = defineEmits(["hide", "send"]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  file: {
    type: Array,
    default: () => [],
  },
});
const caption = ref("");
const send = () => {
  emits("send", {
    files: props.file,
    caption: caption.value,
  });
  caption.value = "";
};
const hide = () => {
  emits("hide");
};
</script>
