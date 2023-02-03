<template>
  <!-- Timeline -->
  <q-timeline color="grey-4">
    <q-timeline-entry
      icon="arrow_back"
      color="cyan-1"
      class="py-2"
      v-for="(item, i) in items"
      :key="i"
    >
      <slot :item="item" :i="i"></slot>
    </q-timeline-entry>
  </q-timeline>
</template>
<script setup>
defineProps({
  items: { type: Array, default: () => [] },
});
</script>
<style lang="scss" scoped>
.bg-timeline-content {
  background-color: #f2f3f7;
}
.q-timeline:deep {
  .q-timeline__dot {
    &::before {
      box-shadow: 0px 4px 20px rgba(75, 68, 246, 0.3);
      background: #d8e4f8;
    }
    &::after {
      color: #e2e2e9;
      width: 1px;
    }
    .q-icon {
      color: #4b44f6;
    }
  }
}
</style>
