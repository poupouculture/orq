<template>
  <div>
    <!-- Heading -->
    <!-- <div
      class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
    >
      <RouterLink
        :to="{ name: 'customergroups-internal-group' }"
        class="text-gray-400 gap-x-3"
      >
        <q-icon name="keyboard_backspace" class="text-gray-400" />
        Personal Groups
      </RouterLink>
      <span>/</span>
      <span>Add Personal Group</span>
    </div> -->
    <!-- Form -->
    <Form @submit="submitData" :loading="loading" />
  </div>
</template>

<script setup>
import { Notify } from "quasar";
import { addInternalGroup } from "src/api/InternalGroup";
import Form from "src/components/InternalGroup/Form.vue";
import { useRouter } from "vue-router";
import { customerGroupCreate, userCreate } from "src/utils/transform-object";
import { ref } from "vue";

const router = useRouter();
const loading = ref(false);

const submitData = async (value) => {
  loading.value = true;
  try {
    await addInternalGroup({
      ...value.form,
      tags: value.tags,
      users: {
        create: userCreate({
          id: "+",
          users: value.users.map((data) => data.id),
        }),
      },
      customer_groups: {
        create: customerGroupCreate({
          id: "+",
          customerGroups: value.customerGroups.map((data) => data.id),
        }),
      },
    });
    loading.value = false;
    Notify.create({
      message: "Personal Group successfully created!",
      type: "positive",
      color: "primary",
      position: "top",
    });
    router.push({ name: "personal-groups" });
  } catch (e) {
    Notify.create(e);
    loading.value = false;
  }
};
</script>
