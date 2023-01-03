<template>
  <div
    class="row q-mt-sm items-center q-pa-md"
    :class="isActive && `bg-primary`"
    style="border-radius: 10px"
  >
    <div class="col-2">
      <q-avatar size="36px">
        <img :src="avatarUrl" />
      </q-avatar>
    </div>
    <div class="col-9" style="margin-left: 12px">
      <div
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
        class="text-body1 text-weight-medium"
        :class="!isActive ? `text-secondary ` : `text-white `"
      >
        {{ name }}
      </div>
      <div
        class="text-body2"
        style="
          margin-top: -4px;
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
        :style="
          isActive
            ? {
                color: '#FFFFFF',
                opacity: 0.5,
              }
            : {
                color: '#9A9AAF',
                opacity: 1,
              }
        "
      >
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: () => "",
  },
  avatarUrl: {
    type: String,
    default: () => "",
  },
  time: {
    type: String,
    default: () => "",
  },
  isActive: {
    type: Boolean,
    default: () => true,
  },
});
</script>
