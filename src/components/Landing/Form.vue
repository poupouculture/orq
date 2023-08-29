<script setup>
import { contactUs } from "src/api/landingpage";
import { required, validateEmail } from "src/utils/validation-rules";
import { computed, ref } from "vue";
import { Notify, useQuasar } from "quasar";

const props = defineProps({
  content: {
    type: Object,
  },
});
const emits = defineEmits(["submit"]);
const dialog = ref();

const $q = useQuasar();

const form = ref();
const childrenExists = computed(
  () =>
    props.content.children.length > 0 &&
    typeof props.content.children[0] !== "number"
);

const containerStyle = computed(() => {
  return props.content?.raw && props.content?.raw.style
    ? props.content?.raw.style
    : {
        margin: "20px",
      };
});

const buttonStyle = computed(() => {
  return props.content?.raw && props.content?.raw.buttonStyle
    ? props.content?.raw.buttonStyle
    : {
        color: "white",
        backgroundColor: "#4b44f6",
      };
});

const style = computed(() => {
  return props.content?.raw && props.content?.raw.style
    ? props.content?.raw.style
    : {
        color: "black",
        backgroundColor: "white",
        padding: "15px",
      };
});

const buttonText = computed(() => {
  return props.content?.raw && props.content?.raw.button
    ? props.content?.raw.button
    : "Submit";
});

const submit = async (fromEmit) => {
  const valid = await form.value.validate();
  if (valid) {
    if (fromEmit === false) {
      if (childrenExists.value) {
        dialog.value = true;
        return;
      }
    }
    emits("submit");
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
      await contactUs(allForm).then(() => {
        props.content.raw.form.forEach((item) => {
          if (item.type === "checkbox") {
            item.value = [];
            item.error = false;
          } else {
            item.value = null;
            item.error = false;
          }
        });

        form.value.resetValidation();

        Notify.create({
          message: "Form successfully submitted",
          position: "top",
          type: "positive",
          color: "primary",
        });
        dialog.value = false;
      });
    } catch (error) {}
  }
};

const displayedContent = computed(() => {
  return $q.platform.is.mobile
    ? props.content.content_mobile ?? props.content.content
    : props.content.content;
});
</script>

<template>
  <div
    class="w-full grid gap-5 lg:grid-cols-2 bg-center bg-cover lg:p-6 formContainer"
    :style="{ backgroundImage: `url(${content.image})`, ...containerStyle }"
  >
    <!-- Content -->
    <div
      :class="
        content.alignment === 'left' && !$q.platform.is.mobile ? 'order-1' : ''
      "
      class="col-span-1 text-white"
    >
      <article v-html="displayedContent" class="prose text-white" />
    </div>
    <!-- FORM -->
    <div
      :class="content.alignment === 'right' ? 'order-2' : ''"
      class="flex rounded-lg gap-5 col-span-1 flex-col w-full formSecondLayer"
      :style="style"
    >
      <p
        class="text-center mb-4 font-bold text-xl"
        :style="{ color: content.raw.color }"
      >
        {{ content.name }}
      </p>

      <q-form ref="form" @submit.prevent.stop="submit(false)">
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
              v-model="form.value"
              @update:model-value="form.error = false"
              :type="form.type"
              outlined
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
              v-model="form.value"
              :type="form.type"
              outlined
              lazy-rules
              class="mb-4 formInput"
              dense
            />

            <q-input
              v-else
              v-model="form.value"
              :type="form.type"
              outlined
              @update:model-value="form.error = false"
              :error="form.error"
              :error-message="form.errorMessage"
              lazy-rules
              dense
              :rules="[(val) => required(val)]"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <q-btn
            @click="submit(false)"
            :style="buttonStyle"
            :label="buttonText"
          />
        </div>
      </q-form>
    </div>
    <q-dialog v-if="childrenExists" v-model="dialog">
      <q-card style="max-width: 90vw">
        <Form
          :content="content.children[0]"
          class="mx-0 my-0"
          @submit="submit(true)"
        />
      </q-card>
    </q-dialog>
  </div>
</template>
<style scoped lang="scss">
@media (max-width: $breakpoint-xs-max) {
  :deep(article p#poupou_form_text) {
    padding-left: 0 !important;
  }

  .formContainer {
    padding: 10px !important;

    .formSecondLayer {
      padding: 30px !important;
    }
  }
}

@media (max-width: $breakpoint-md-max) {
  .formSecondLayer {
    padding: 30px !important;
  }
}
</style>
