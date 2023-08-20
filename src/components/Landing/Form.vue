<script setup>
import { contactUs } from "src/api/landingpage";
import { required, validateEmail } from "src/utils/validation-rules";

const props = defineProps({
  content: {
    type: Object,
  },
});

const submit = async () => {
  const allForm = {
    app: props.content.app,
  };

  await props.content.raw.form.forEach((form) => {
    if (form.value && form.required) {
      if (form.label === "Email") {
        if (!validateEmail(form.value)) {
          form.error = true;
          form.errorMessage = `The ${form.label} Must be a valid email.`;
        } else {
          allForm[form.field] = form.value;
        }
      } else {
        allForm[form.field] = form.value;
      }
    } else if (!form.value && form.required) {
      form.error = true;
      form.errorMessage = `The ${form.label} is required`;
    } else {
      allForm[form.field] = form.value;
    }
  });

  try {
    await contactUs(allForm);
  } catch (error) {}
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
              class="formInput"
              v-if="form.type === 'email'"
              :model-value="form.value"
              :type="form.type"
              outlined
              :ref="form.type"
              :error="form.error"
              :error-message="form.errorMessage"
              lazy-rules
              dense
              :rules="[
                (val) => required(val),
                (val) => validateEmail(val) || 'Must be a valid email.',
              ]"
            />

            <template v-else-if="form.type === 'checkbox'">
              <q-checkbox
                v-for="(checkbox, index) in form.options"
                :val="checkbox.label"
                :key="index"
                :label="checkbox.label"
                v-model="form.value"
                color="primary"
              />
            </template>

            <q-input
              v-else-if="!form.required"
              :model-value="form.value"
              :type="form.type"
              :ref="form.type"
              outlined
              :error="form.error"
              :error-message="form.errorMessage"
              lazy-rules
              class="mb-4"
              dense
            />

            <q-input
              v-else
              v-model="form.value"
              :type="form.type"
              :ref="form.type"
              outlined
              :error="form.error"
              :error-message="form.errorMessage"
              lazy-rules
              dense
              :rules="[(val) => required(val)]"
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
