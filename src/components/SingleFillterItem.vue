<template>
  <div
    class="q-px-md cursor-pointer"
    :class="isActive ? `isActive` : `isActiveNotActive`"
  >
    <div
      class="text-body1 text-secondary"
      :class="
        isActive
          ? `text-primary text-weight-bold`
          : `text-secondary text-weight-regular`
      "
    >
      {{ name }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: () => "",
  },
  isActive: {
    type: Boolean,
    default: () => true,
  },
});
</script>

<style scoped>
.isActive {
  width: fit-content;
  height: fit-content;
  border: 2px solid #4b44f6;
  border-radius: 50px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.isActiveNotActive {
  width: fit-content;
  height: fit-content;
  border: 2px solid #e2e2e9;
  border-radius: 50px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
