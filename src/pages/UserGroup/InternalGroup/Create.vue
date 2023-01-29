<template>
  <!-- Heading -->
  <div
    class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
  >
    <RouterLink
      :to="{ name: 'customergroups-internal-group' }"
      class="text-gray-400 gap-x-3"
    >
      <q-icon name="keyboard_backspace" class="text-gray-400" />
      Internal Groups</RouterLink
    >
    <span>/</span>
    <span>Add Internal Group</span>
  </div>
  <!-- Form -->
  <Form @submit="submitData" />
</template>

<script setup>
import { Notify } from "quasar";
import { addInternalGroup } from "src/api/InternalGroup";
import Form from "src/components/InternalGroup/Form.vue";
import { useRouter } from "vue-router";
import { customerGroupCreate, userCreate } from "src/utils/transform-object";

const router = useRouter();
const submitData = async (value) => {
  try {
    await addInternalGroup({
      ...value.form,
      users: {
        create: userCreate({
          id: "+",
          users: value.users,
        }),
      },
      customer_groups: {
        create: customerGroupCreate({
          id: "+",
          customerGroups: value.customerGroups,
        }),
      },
    });
    Notify.create("Internal Group successfully created!");
    router.replace({ name: "customergroups-internal-group" });
  } catch (e) {
    Notify.create(e);
  }
};
</script>
