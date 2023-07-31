<template>
  <footer class="w-full fixed bottom-0 q-pa-sm bg-white z-10">
    <div class="w-full flex justify-center items-center">
      <q-btn
        round
        flat
        color="grey"
        icon="home"
        size="md"
        class="px-2"
        @click="router.push('/')"
      />
      <!-- <q-btn round flat color="grey" icon="add_box" size="md" class="px-2" />
      <q-btn
        round
        flat
        color="grey"
        icon="chat_bubble"
        size="md"
        class="px-2"
      />
      <q-btn
        round
        flat
        color="grey"
        icon="notifications"
        size="md"
        class="px-2"
      /> -->
      <div
        class="flex items-center space-x-1.5 cursor-pointer"
        @click="toggleInfo()"
      >
        <div class="flex justify-center">
          <div
            :style="{ backgroundImage: `url(${profileImg})` }"
            class="rounded-full w-8 h-8 bg-right-top bg-cover bg-no-repeat"
          />
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="text-gray-400 transition transform duration-300"
          :class="{ 'rotate-180': showInfo }"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M6 9l6 6l6 -6"></path>
        </svg>
      </div>
    </div>
  </footer>
  <!-- User Info -->
  <Transition
    enter-active-class="duration-200 ease-out"
    enter-from-class="transform opacity-0 translate-y-96"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0 translate-y-96"
  >
    <div class="fixed inset-0 bg-white p-3" v-if="showInfo">
      <header
        class="flex items-center space-x-2 text-gray-500 cursor-pointer"
        @click="toggleInfo()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M5 12l14 0"></path>
          <path d="M5 12l4 4"></path>
          <path d="M5 12l4 -4"></path>
        </svg>
        <span>Back to Chat</span>
      </header>

      <div class="w-full flex justify-center">
        <div
          :style="{ backgroundImage: `url(${profileImg})` }"
          class="h-40 w-40 bg-right-top bg-cover bg-no-repeat rounded-full"
        />
      </div>

      <div class="mt-6">
        <div class="text-sm text-gray-500">Name</div>
        <div class="text-base text-gray-700">
          {{ getUserProfile.first_name }} {{ getUserProfile.last_name }}
        </div>
        <div class="text-sm text-gray-500">{{ getUserProfile.email }}</div>
      </div>
      <div class="mt-6">
        <div class="text-sm text-gray-500">Status</div>
        <div class="text-lg text-gray-700">
          {{ isOnline ? "Offline" : "Online" }}
        </div>
      </div>
      <div class="mt-6">
        <div class="text-sm text-gray-500">Current Bot Status</div>
        <div
          class="text-lg text-gray-700"
          v-text="!isOnline ? 'Profile bot' : 'Office hours bot'"
        />
      </div>
      <div class="mt-6">
        <div class="text-sm text-gray-500">Office</div>
        <div class="text-lg text-gray-700">
          <span>Office Hours</span
          ><q-toggle
            v-model="isOfficeHours"
            @update:model-value="switchOfficeHours"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import useUserInfoStore from "src/stores/modules/userInfo";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import profileImg from "src/assets/images/profileImg.jpeg";
import useMessagingStore from "src/stores/modules/messaging";

const router = useRouter();
const userStore = useUserInfoStore();
const messagingStore = useMessagingStore();
const showInfo = ref(false);
const { getUserProfile } = storeToRefs(userStore);
const { isOfficeHours } = storeToRefs(messagingStore);

const toggleInfo = () => {
  showInfo.value = !showInfo.value;
};

const isOnline = computed(() => !messagingStore.isOfficeHours);

const switchOfficeHours = async (value) => {
  await messagingStore.officeHours_set(value);
};
</script>
