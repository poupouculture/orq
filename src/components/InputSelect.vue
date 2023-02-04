<!-- eslint-disable vue/require-prop-type-constructor -->
<!-- eslint-disable no-tabs -->
<!-- eslint-disable vue/require-v-for-key -->
<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
  <div
    :style="isBorder && { height: `10px` }"
    class="custom-select"
    :class="icon ? `custom-select-icon` : `custom-select`"
    :tabindex="tabindex"
  >
    <div
      style="
        font-family: 'Archivo', sans-serif;
        font-weight: 500;
        font-size: 14px;
      "
      class="selected"
      :class="{ open: open }"
      @click="open = !open"
      :style="
        isBorder
          ? {
              border: 'none',
              opacity: isBorder && isColorGray && 0.3,
            }
          : isColorGray && {
              opacity: 0.3,
            }
      "
    >
      {{ selected }}
      <q-icon
        name="fa-solid fa-chevron-down"
        style="color: gray; margin-right: 10px"
      />
    </div>
    <div
      class="items"
      :class="{ selectHide: !open }"
      style="top: 40px; max-height: 200px !important; overflow: scroll"
    >
      <div class="w-full h-14 flex justify-center items-center">
        <input
          type="text"
          class="w-full h-10 -ml-3 px-2 rounded-md"
          placeholder="Search"
          v-model="search"
          @input="filterOptions"
        />
      </div>
      <div
        v-for="(option, i) of filteredOptions"
        :key="i"
        @click="
          selected = option;
          open = false;
          $emit('input', option);
          updateValue(option);
        "
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
      >
        {{ option }}
      </div>
    </div>
    <div
      v-if="icon"
      style="
        width: 40px;
        height: 40px;
        background-color: #f2f3f7;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-left: -4px;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <img :src="icon" style="width: 15px; object-fit: contain" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  default: {
    type: String,
    default: "",
  },
  tabindex: {
    type: Number,
    default: 0,
  },
  value: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  isBorder: {
    type: Boolean,
    default: false,
  },
  isColorGray: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:value", "input"]);

const _selected = props.default
  ? props.default
  : props.options.length > 0
  ? props.options[0]
  : null;
const selected = ref(_selected);
const open = ref(false);
const search = ref("");
const filteredOptions = ref([]);

onMounted(() => {
  emit("input", selected.value);
  filteredOptions.value = props.options;
});

const updateValue = (value) => {
  emit("update:value", value);
};

const filterOptions = () => {
  if (search.value !== "") {
    filteredOptions.value = props.options.filter((o) =>
      o.toLowerCase().includes(search.value.toLowerCase())
    );
  }
};
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 40px;
  line-height: 40px;
}

.custom-select-icon {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 40px;
  line-height: 40px;
  display: flex;
}

.selected {
  background-color: transparent;
  border-radius: 6px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  width: 100%;
  color: #2e2e3a;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  overflow: hidden;
}

.custom-select .selected.open {
  border: 1px solid #4b44f6;
  border-radius: 6px 6px 0px 0px;
}

.custom-select .items {
  color: black;
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  border-right: 1px solid #4b44f6;
  border-left: 1px solid #4b44f6;
  border-bottom: 1px solid #4b44f6;
  position: absolute;
  background-color: white;
  left: 0;
  right: 0;
  z-index: 1;
}

.custom-select .items div {
  color: black;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
}

.selectHide {
  display: none;
}
</style>
