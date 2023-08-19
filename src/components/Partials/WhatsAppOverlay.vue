<script setup lang="ts">
defineProps<{
  data: any;
}>();
</script>
<template>
  <div class="fixed bottom-5 right-7 z-[99999999]">
    <a :href="`https://wa.me/${data.raw.number}`" target="_blank">
      <img src="../../assets/icons/whatsapp.svg" class="w-20 h-20" />
    </a>
  </div>
</template>
