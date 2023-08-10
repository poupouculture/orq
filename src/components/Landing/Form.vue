<script setup>
defineProps({
  content: {
    type: Object,
  },
});

const alignmentClass = (classValue) => {
  if (classValue === "center") {
    return "justify-center";
  } else if (classValue === "left") {
    return "justify-start";
  } else if (classValue === "right") {
    return "justify-end";
  }
};
</script>

<template>
  <div :class="alignmentClass(content.alignment)" class="w-full mx-7 my-5 flex">
    <div class="flex gap-5 flex-col w-full lg:w-[700px]">
      <p class="text-center mb-4 font-bold text-xl">
        {{ content.name }}
      </p>

      <div
        v-for="(form, index) in content.raw.form"
        :key="index"
        class="grid grid-cols-6"
      >
        <div class="col-span-2">
          <p class="label-style mb-2">
            {{ form.label }} <span class="text-red-600">*</span>
          </p>
        </div>

        <div class="col-span-4">
          <q-input
            v-model="form.value"
            :type="form.type"
            outlined
            lazy-rules
            dense
          ></q-input>
        </div>
      </div>

      <div class="flex justify-end">
        <q-btn color="primary" label="Submit" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
