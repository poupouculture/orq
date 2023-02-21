<template>
  <div
    :class="{ 'bg-primary': active }"
    class="flex w-full contact-card q-pa-sm"
  >
    <q-avatar class="rounded-avatar q-mr-sm">
      <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
    </q-avatar>
    <q-item-section>
      <q-item-label :class="{ 'text-white': active }" class="text-h6 truncate">
        {{ name }}
      </q-item-label>
      <q-item-label caption lines="1" :class="{ 'text-white': active }">
        {{ message }}
      </q-item-label>
    </q-item-section>
    <q-item-section side top class="justify-between q-pb-sm">
      <q-item-label caption :class="{ 'text-white': active }">
        {{ time }}
      </q-item-label>
      <q-badge v-show="totalUnread" rounded color="red" :label="totalUnread" />
    </q-item-section>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  time: {
    type: String,
    default: "",
  },
  totalUnread: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped lang="scss">
.rounded-avatar {
  border-radius: 50% !important;
}
.contact-card {
  border-radius: 10px;
}
</style>
