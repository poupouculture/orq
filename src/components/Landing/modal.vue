<script setup>
import { computed } from "vue";

const props = defineProps({
  dialog: {
    type: Boolean,
  },
  declineText: {
    type: String,
    default() {
      return "Decline";
    },
  },
  acceptText: {
    type: String,
    default() {
      return "Accept";
    },
  },
});
const emits = defineEmits(["update:modelValue", "decline", "accept"]);

const value = computed({
  set: (val) => emits("update:modelValue", val),
  get: () => props.dialog,
});
</script>

<template>
  <q-dialog v-model="value">
    <q-card style="width: 1800px; max-width: 80vw">
      <q-card-section>
        <slot name="head" />
      </q-card-section>

      <q-separator />

      <q-card-section style="min-height: 50vh" class="">
        <slot />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          @click="emits('decline')"
          :label="props.declineText"
          color="primary"
        />
        <q-btn
          flat
          @click="emits('accept')"
          :label="props.acceptText"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
