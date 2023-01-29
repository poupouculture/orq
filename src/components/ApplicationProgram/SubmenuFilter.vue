<template>
  <div>
    <div
      class="w-full p-3 flex justify-between rounded-md cursor-pointer"
      :class="{ 'bg-primary text-white shadow-md': activeMenu === menu.id }"
      @click="setActiveMenu(menu.id)"
      v-for="(menu, index) of props.menus"
      :key="index"
    >
      <span> {{ menu.name }} </span>
      <div
        class="w-5 h-5 flex justify-center items-center text-xs bg-gray-200 text-gray-400 rounded-full"
      >
        10
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const activeMenu = ref("general");

const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
});

const setActiveMenu = (value) => {
  activeMenu.value = value;
};

onMounted(() => {
  if (props?.menus?.length > 0) {
    setActiveMenu(props.menus[0].id);
  }
});
</script>
