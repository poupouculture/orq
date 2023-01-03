<template>
  <div
    class="row q-mt-md"
    :class="isMe ? `justify-end items-end` : `justify-start items-start`"
  >
    <div
      class="row bg-primary q-pa-sm"
      :class="
        isMe
          ? `bg-primary justify-end items-end isMe`
          : `bg-negative justify-start items-start isMeNotMe`
      "
    >
      <div
        class="text-body2"
        :class="isMe ? `text-white` : `text-secondary`"
        style="
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 14px;
        "
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: () => "",
  },
  isMe: {
    type: Boolean,
    default: () => true,
  },
});
</script>

<style scoped>
.isMe {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  width: fit-content;
}
.isMeNotMe {
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  width: fit-content;
}
</style>
