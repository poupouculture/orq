<template>
  <div class="input-form my-4 py-5 h-20 flex no-warp justify-between relative">
    <div class="flex space-x-2">
      <q-input
        label="Fuzzy search"
        class="w-52 rounded-sm"
        outlined
        v-model="text"
        type="search"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-input
        label="Create Time"
        label-color="black"
        class="w-52 rounded-sm"
        outlined
        v-model="text"
        type="search"
      >
        <template v-slot:append>
          <q-icon name="event" />
        </template>
      </q-input>

      <q-select
        class="w-52 rounded-sm"
        outlined
        v-model="selected[0]"
        :options="options[0]"
      >
      </q-select>

      <q-select
        class="w-52 rounded-sm"
        outlined
        v-model="selected[1]"
        :options="options[1]"
      >
      </q-select>

      <q-select
        class="w-52 rounded-sm"
        outlined
        v-model="selected[2]"
        :options="options[2]"
      >
      </q-select>
    </div>

    <q-btn
      color="primary"
      style="border-radius: 4px"
      icon="fa-solid fa-plus"
      label="Add"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const text = ref(""),
  options = ref([["Status"], ["Staff"], ["Customer"]]),
  selected = ref([["Status"], ["Staff"], ["Customer"]]);
</script>

<style lang="scss" scoped>
.input-form {
  :deep {
    .q-field__control,
    .q-field__marginal {
      height: 44px;
      min-height: 44px;
    }

    .q-field__native {
      min-height: 44px;
      color: black;
    }

    .q-field__label {
      top: 12px;
    }

    .q-icon {
      font-size: 1.2rem;
      font-weight: 400;
    }
    .q-btn {
      text-transform: none;
    }
  }
}
</style>
