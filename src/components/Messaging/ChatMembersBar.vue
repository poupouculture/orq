<template>
  <q-toolbar class="items-center pb-3">
    <div class="text-gray-400">Members</div>
    <div class="flex justify-between p-2 items-center">
      <div class="flex">
        <div
          class="w-10 h-10 flex justify-center mr-2 items-center rounded-full bg-gray-200"
          v-for="(member, index) of members.slice(0, 3)"
          :key="index"
        >
          {{ initialName(member?.name) }}
        </div>
        <div
          class="w-10 h-10 flex justify-center mr-2 items-center rounded-full bg-gray-300"
          v-if="members.length > 3"
        >
          {{ members.length - 3 }} +
        </div>
      </div>
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
  showChatOption: {
    type: Boolean,
    default: false,
  },
  selectedChat: {
    type: Object,
  },
});

const { members } = toRefs(props);

const initialName = (name: string) => {
  const firstName = name.split(" ")[0];
  let initial = firstName.charAt(0).toUpperCase();

  if (name.split(" ").length !== 1) {
    const lastName = name.split(" ")[1];
    initial += lastName.charAt(0).toUpperCase();
  }
  return initial;
};
</script>
