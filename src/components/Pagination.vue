<template>
  <div class="pagination h-12 flex no-warp justify-between items-center w-full">
    <p>Showing {{ current }} to {{ pageSize }} of {{ total }} results</p>

    <div class="h-8 leading-8 text-center flex no-warp">
      <div class="left-arrow w-8 h-full">
        <q-icon name="fa-solid fa-angle-left" />
      </div>

      <div class="items active w-9 h-full">{{ 1 }}</div>
      <div class="items w-9 h-full">{{ 2 }}</div>
      <div class="items w-9 h-full">{{ 3 }}</div>

      <div class="items w-9 h-full">...</div>

      <div class="items w-9 h-full">{{ 8 }}</div>
      <div class="items w-9 h-full">{{ 9 }}</div>
      <div class="items w-9 h-full">{{ 10 }}</div>

      <div class="right-arrow w-8 h-full">
        <q-icon name="fa-solid fa-angle-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  current /* current page */: Number,
  total /* total data */: Number,
  size /* number per page */: Number,
});

const pageSize = computed(() => parseInt(props.total / props.size) + 1);
</script>

<style lang="scss" scoped>
.left-arrow,
.right-arrow,
.items {
  border: 1px solid #ccc;
  cursor: pointer;
}

.left-arrow {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.right-arrow {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left: 0px;
}

.items {
  margin-left: -1px;

  &.active {
    position: relative;
    border-color: #4b44f6;
    color: #4b44f6;
    background-color: #f1f1fd;
  }
}
</style>
