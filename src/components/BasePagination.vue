<template>
  <q-pagination v-model="pagination" max="10" :max-pages="7" direction-links active-design="outline" outline
    color="grey-7" active-color="primary" padding="6px 14px" />
</template>
<script setup>
import { ref } from 'vue';
const pagination = ref(1)
</script>
<style lang="scss" scoped>
.q-pagination::v-deep {
  .q-btn {
    &.text-primary {
      z-index: 10;
    }
    border-radius: 0;
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    // Border Style
    &.text-primary.q-btn--outline:before {
      border: 1px solid $primary;
    }
    &.q-btn--outline:before {
      @apply border border-gray-300;
    }
  }

  .q-pagination__content {
    --q-pagination-gutter-child: 0;
    @apply -space-x-px;

    .q-pagination__middle {
      .q-btn {
        &:first-child, &:last-child {
          border-radius: 0;
        }
      }

      @apply -space-x-px
    }
  }
}
</style>
