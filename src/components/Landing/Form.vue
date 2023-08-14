<script setup>
import { Notify } from "quasar";
const props = defineProps({
  content: {
    type: Object,
  },
});

const validateEmail = (email) => {
  return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
};

const submit = () => {
  const allForm = {};
  props.content.raw.form.forEach((form) => {
    if (form.value && form.required) {
      if (form.label === "Email") {
        if (!validateEmail(form.value)) {
          Notify.create({
            message: `The ${form.label} Must be a valid email.`,
            position: "top",
            type: "negative",
          });
        } else {
          allForm[form.type] = form.value;
          console.log("Else email proccess here");
        }
      } else {
        allForm[form.type] = form.value;
      }
    } else if (!form.value && form.required) {
      Notify.create({
        message: `The ${form.label} is required`,
        position: "top",
        type: "negative",
      });
    }
  });

  console.log(allForm);
};
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
      <p
        class="text-center mb-4 font-bold text-xl"
        :style="{ color: content.raw.color }"
      >
        {{ content.name }}
      </p>

      <form @submit.prevent.stop="submit">
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
              v-if="form.type === 'email'"
              v-model="form.value"
              :type="form.type"
              outlined
              :ref="form.type"
              lazy-rules
              dense
              :rules="[
                (val) => !!val || 'Field is required',
                (val) => validateEmail(val) || 'Must be a valid email.',
              ]"
            />

            <q-input
              v-else
              v-model="form.value"
              :type="form.type"
              :ref="form.type"
              outlined
              lazy-rules
              dense
              :rules="[(val) => !!val || 'Field is required']"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <q-btn @click="submit" color="primary" :label="content.raw.button" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
