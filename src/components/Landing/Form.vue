<script setup>
defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div
    class="w-full mx-7 my-5 grid gap-5 lg:grid-cols-2 bg-center bg-cover p-2 lg:p-6"
    :style="{ backgroundImage: `url(${content.image})` }"
  >
    <div
      :class="content.alignment === 'left' ? 'order-1' : 'order-2'"
      class="col-span-1 text-white"
    >
      <article v-html="content.content" class="prose text-white" />
    </div>

    <div
      :class="content.alignment === 'right' ? 'order-2' : 'order-1'"
      class="flex bg-white p-6 rounded-lg gap-5 col-span-1 flex-col w-full"
    >
      <p class="text-center mb-4 font-bold text-xl">
        {{ content.name }}
      </p>

      <div
        v-for="(form, index) in content.raw.form"
        :key="index"
        class="grid grid-cols-6"
      >
        <div class="col-span-6 lg:col-span-2">
          <p class="label-style mb-2">
            {{ form.label }}
            <span v-if="form.required" class="text-red-600">*</span>
          </p>
        </div>

        <div class="col-span-6 lg:col-span-4">
          <q-input
            v-model="form.value"
            :type="form.type"
            outlined
            lazy-rules
            dense
          />
        </div>
      </div>

      <div class="flex justify-end">
        <q-btn color="primary" label="Submit" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
