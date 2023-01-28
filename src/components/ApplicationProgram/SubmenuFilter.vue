<template>
  <div>
    <div
      class="w-full p-3 flex justify-between rounded-md cursor-pointer"
      :class="{ 'bg-primary text-white shadow-md': activeMenu === 'general' }"
      @click="setActiveMenu('general')"
    >
      <span> General </span>
      <div
        class="w-5 h-5 flex justify-center items-center text-xs bg-gray-200 text-gray-400 rounded-full"
      >
        10
      </div>
    </div>
    <div
      class="w-full p-3 flex justify-between rounded-md cursor-pointer"
      :class="{ 'bg-primary text-white shadow-md': activeMenu === 'chatbot' }"
      @click="setActiveMenu('chatbot')"
    >
      <span> Chatbot </span>
      <div
        class="w-5 h-5 flex justify-center items-center text-xs bg-gray-200 text-gray-400 rounded-full"
      >
        4
      </div>
    </div>
    <div
      class="w-full p-3 flex justify-between rounded-md cursor-pointer"
      :class="{
        'bg-primary text-white shadow-md': activeMenu === 'control_center',
      }"
      @click="setActiveMenu('control_center')"
    >
      <span> Control Center </span>
      <div
        class="w-5 h-5 flex justify-center items-center text-xs bg-gray-200 text-gray-400 rounded-full"
      >
        4
      </div>
    </div>
    <div
      class="w-full p-3 flex justify-between rounded-md cursor-pointer"
      :class="{ 'bg-primary text-white shadow-md': activeMenu === 'contact' }"
      @click="setActiveMenu('contact')"
    >
      <span> Contact </span>
      <div
        class="w-5 h-5 flex justify-center items-center text-xs bg-gray-200 text-gray-400 rounded-full"
      >
        4
      </div>
    </div>
    <div
      class="w-full p-3 flex justify-between rounded-md cursor-pointer"
      :class="{ 'bg-primary text-white shadow-md': activeMenu === 'channel' }"
      @click="setActiveMenu('channel')"
    >
      <span> Channel </span>
      <div
        class="w-5 h-5 flex justify-center items-center text-xs bg-gray-200 text-gray-400 rounded-full"
      >
        4
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const activeMenu = ref("general");

const setActiveMenu = (value) => {
  activeMenu.value = value;
};
</script>
