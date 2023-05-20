<script setup>
const emit = defineEmits(["close"]);
const closeJumbotron = () => {
  emit("close");
};
</script>
<template>
  <div class="w-full flex flex-col bg-gray-200 rounded-lg p-4 mt-4">
    <div class="w-full flex justify-end">
      <q-icon
        name="close"
        class="text-lg cursor-pointer"
        @click="closeJumbotron"
      />
    </div>
    <div class="w-full flex">
      <div class="w-6/12 md:w-9/12 flex flex-col">
        <span class="text-xl"> Hi User, Welcome to ChaQ Dashboard! </span>
        <span class="text-sm text-gray-600 mt-4">
          Let's get started! Use the dashboard to access ChaQ powerful features.
          This is the overall view of the data model where you can see the
          progress being made
        </span>
      </div>
      <div class="w-6/12 md:w-3/12 flex justify-center">
        <img src="~/assets/images/jumbotron.svg" alt="" />
      </div>
    </div>
  </div>
</template>
