<template>
  <q-dialog :modelValue="modelValue" @hide="hide">
    <q-card
      style="min-width: 55%"
      class="q-pa-lg flex"
      :class="selectedImage === null ? 'flex-col' : ''"
    >
      <div class="w-full flex flex-col">
        <div class="w-full flex justify-end">
          <q-icon name="close" class="cursor-pointer" @click="hide" />
        </div>
        <div class="w-full">
          <q-card-section>
            <div class="text-h6">Image Message</div>
            <div class="text-h7">Choose Image</div>
          </q-card-section>

          <div class="w-full flex justify-center items-center">
            <img id="image-preview" v-show="selectedImage !== null" />
          </div>

          <button
            class="w-full mx-auto border border-dashed py-36 text-center text-2xl text-gray-400 rounded-md"
            @click="uplader?.pickFiles"
            v-if="selectedImage === null"
          >
            <q-uploader
              ref="uplader"
              accept=".gif, .jpg, .jpeg, .png, image/*"
              class="hidden invisible"
              :filter="imageSizeFilter"
              @added="preview"
            />
            <q-icon name="image" />
            Click here to choose image
          </button>

          <textarea
            type="text"
            class="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/30 focus:border-primary"
            placeholder="Type your caption here..."
            @keydown="inputHandler"
            v-model="caption"
            v-if="selectedImage !== null"
          ></textarea>
        </div>
      </div>

      <div class="w-full flex justify-end gap-2 px-4 mt-4">
        <button class="btn-dotted" @click="hide">Close</button>
        <button
          :disabled="disabled"
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
import { Notify } from "quasar";
import { onMounted, onUpdated, ref } from "vue";

const emit = defineEmits(["hide", "send"]);

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const uplader: any = ref(null);
const selectedImage: any = ref(null);
const localFileList = ref([]);
const caption = ref("");
const disabled = ref<boolean>(true);

const imageSizeFilter = (files: readonly any[] | FileList) => {
  const filterFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size <= 1024 * 1024 * 5) {
      filterFiles.push(file);
    }
  }
  if (!filterFiles.length) {
    Notify.create({
      message: "Image cannot exceed 5M",
      type: "negative",
      color: "purple",
      position: "top",
    });
  }

  return filterFiles;
};

const inputHandler = (e: any) => {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
    send();
  }
};

const preview = (fileList: any) => {
  localFileList.value = fileList;
  selectedImage.value = fileList[0];
  const imageTag = document.getElementById("image-preview");
  const reader = new FileReader();

  reader.readAsDataURL(selectedImage.value);
  reader.addEventListener("load", function () {
    imageTag.src = reader.result;

    disabled.value = false;
  });
};

const hide = () => {
  emit("hide");
  caption.value = "";
};

const send = () => {
  emit("send", localFileList.value, caption.value);
  emit("hide");
  caption.value = "";
};

onMounted(() => {
  selectedImage.value = null;

  disabled.value = true;
});

onUpdated(() => {
  selectedImage.value = null;
  disabled.value = true;
});

defineExpose({
  preview,
});
</script>
