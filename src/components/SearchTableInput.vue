<template>
  <q-input
    placeholder="Search"
    outlined
    dense
    v-model="search"
    :debounce="500"
    @update:model-value="searchHandler"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
    <template v-slot:append>
      <q-circular-progress
        v-if="props.loading"
        indeterminate
        rounded
        size="18px"
        color="gray-1"
      />
      <q-icon
        v-else-if="search"
        name="close"
        class="text-gray-400 cursor-pointer"
        @click="resetSearch"
      />
    </template>
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
});
const search = ref("");

const searchHandler = () => {
  emit("search", search.value);
};

const resetSearch = () => {
  search.value = "";
  emit("reset");
};
</script>
