<template>
  <q-dialog :modelValue="modelValue" @hide="hide">
    <q-card style="min-width: 85%; min-height: 85%" class="q-pa-lg">
      <q-card-section>
        <div class="text-h6">Choose Template</div>
        <div class="text-h7">All Templates</div>

        <div class="q-mt-lg" style="max-width: 250px">
          <q-input
            placeholder="Search by template name"
            outlined
            dense
            type="search"
            max-width="250px"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none column items-center q-mt-lg">
        <div class="text-primary text-weight-bold">No Bookmarked templates</div>
      </q-card-section>

      <q-card-actions align="right"> </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["hide"]);

const hide = () => {
  emit("hide");
};
</script>
