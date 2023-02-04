<template>
  <q-card
    class="q-px-md q-py-sm contact-card"
    :class="{ active: active, inactive: !active }"
  >
    <div class="row items-center justify-between">
      <div class="col-8">
        <div class="row items-center">
          <q-avatar class="rounded-avatar">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div class="col-7 q-ml-md">
            <div
              class="text-h6"
              :class="{ 'text-white': active, 'text-dark': !active }"
            >
              {{ name }}
            </div>
            <div class="text-grey-5">{{ message }}</div>
          </div>
        </div>
      </div>
      <div class="col-4 self-start q-py-xs">
        <div class="column items-end">
          <div class="text-grey-5">{{ time }}</div>
          <q-avatar
            v-if="totalUnread"
            size="sm"
            color="accent"
            text-color="white"
          >
            <div class="text-white">{{ totalUnread }}</div>
          </q-avatar>
        </div>
      </div>
    </div></q-card
  >
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
.active {
  background: $primary;
}
.inactive {
  background: none;
  box-shadow: none;
}
</style>
