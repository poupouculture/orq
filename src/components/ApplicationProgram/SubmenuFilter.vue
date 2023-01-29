<template>
  <div>
    <div
      class="w-full p-3 flex justify-between rounded-md cursor-pointer"
      :class="{ 'bg-primary text-white shadow-md': activeMenu === index }"
      @click="setActiveMenu(index)"
      v-for="(menu, index) of formattedMenus"
      :key="index"
    >
      <span> {{ index }} </span>
      <div
        class="w-5 h-5 flex justify-center items-center text-xs bg-gray-200 text-gray-400 rounded-full"
      >
        {{ menu.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const activeMenu = ref("general");
const formattedMenus = ref([]);
const menuKeys = ref([]);
const childMenus = ref([]);

const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["changeChildMenu"]);

const setActiveMenu = (value) => {
  activeMenu.value = value;
  childMenus.value = formattedMenus.value[value];
  emit("changeChildMenu", childMenus.value);
};

const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

onMounted(() => {
  if (props?.menus?.length > 0) {
    formattedMenus.value = groupBy(props?.menus, "group_by");
    menuKeys.value = Object.keys(formattedMenus.value);
    setActiveMenu(menuKeys.value[0]);
  }
});
</script>
