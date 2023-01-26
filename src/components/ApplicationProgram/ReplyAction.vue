<template>
  <div class="w-full flex">
    <div class="w-10/12">
      <input
        type="text"
        class="w-full h-10 block border rounded-lg pl-4"
        v-model="replyText"
        @change="changeValue"
      />
    </div>
    <div class="w-2/12 flex items-center justify-center text-2xl text-gray-400">
      <q-icon name="fa-solid fa-close" @click="deleteReply" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  index: {
    type: Number,
    default: () => 0,
  },
  replyText: {
    type: String,
    default: () => "",
  },
});

const emit = defineEmits(["updateReply", "deleteReply"]);

const replyText = ref("");

const changeValue = () => {
  emit("updateReply", {
    index: props.index,
    value: replyText.value,
  });
};

const deleteReply = () => {
  emit("deleteReply", props.index);
};

onMounted(() => {
  replyText.value = props.replyText;
});
</script>
