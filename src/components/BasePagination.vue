<template>
  <q-pagination
    v-model="pagination"
    @update:model-value="updateModel"
    :max="max"
    :max-pages="maxPages"
    direction-links
    active-design="outline"
    outline
    color="grey-7"
    active-color="primary"
    padding="6px 14px"
  />
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  maxPages: { type: [String, Number], required: true },
  max: { type: [String, Number], required: true },
  modelValue: { type: [String, Number] },
});
const emits = defineEmits(["updateModel", "update:modelValue"]);
const pagination = ref(props.modelValue);
const updateModel = (value) => {
  emits("updateModel", value);
  emits("update:modelValue", value);
};
</script>
<style lang="scss" scoped>
.q-pagination::v-deep {
  .q-btn {
    // set active button index
    &.text-primary {
      z-index: 10;
    }

    border-radius: 0;

    // border style for pagination content
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    // Border Style for active button
    &.text-primary.q-btn--outline:before {
      border: 1px solid $primary;
    }

    // border style for on active button
    &.q-btn--outline:before {
      @apply border border-gray-300;
    }
  }

  .q-pagination__content {
    // reset space for pagination content
    --q-pagination-gutter-child: 0;
    @apply -space-x-px;

    .q-pagination__middle {
      // remove border in pagination middle
      .q-btn {
        &:first-child,
        &:last-child {
          border-radius: 0;
        }
      }

      @apply -space-x-px;
    }
  }
}
</style>
