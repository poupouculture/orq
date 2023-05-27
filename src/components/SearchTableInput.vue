<template>
  <q-input
    placeholder="Search"
    outlined
    dense
    v-model="search"
    :debounce="500"
    @keypress.enter="searchHandlerOnEnter()"
    @update:model-value="searchHandler($event)"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
    <template v-slot:append>
      <slot name="filter_sort" />
      <q-circular-progress
        v-if="props.loading"
        indeterminate
        rounded
        size="18px"
        color="gray-1"
      />
      <q-icon
        v-else-if="search || searchTrigged"
        name="close"
        class="text-gray-400 cursor-pointer"
        @click="resetSearch"
      />
    </template>
    <slot />
  </q-input>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["search", "reset"]);
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
    default: () => false,
  },
  searchOnEnter: {
    type: Boolean,
    default: () => false,
  },
});
const search = ref("");
const searchTrigged = ref(false);
const searchHandler = () => {
  searchTrigged.value = true;
  if (!props.searchOnEnter) {
    emit("search", search.value);
  }
};
const searchHandlerOnEnter = () => {
  searchTrigged.value = true;
  emit("search", search.value);
};

const resetSearch = () => {
  search.value = "";
  searchTrigged.value = false;
  emit("reset");
};
</script>
