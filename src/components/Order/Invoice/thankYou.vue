<script setup lang="ts">
import { computed } from "vue";

interface Props {
  dialog: boolean;
}
interface Emit {
  (e: "closeDialog", close: boolean): void;
}
const props = withDefaults(defineProps<Props>(), {
  dialog: false,
});
const emit = defineEmits<Emit>();

const value = computed({
  get() {
    return props.dialog;
  },
  set() {
    emit("closeDialog", false);
  },
});
</script>

<template>
  <q-dialog :model-value="value">
    <q-card class="text-center w-56">
      <q-card-section>
        <div class="text-h6">Thank you</div>
      </q-card-section>
      <q-card-section class="q-pt-none text-[#9A9AAF]">
        Your message has been sent kindly check your email
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
