<template>
  <div>
    <!-- Heading -->
    <div
      class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
    >
      <RouterLink
        :to="{ name: 'internal-group' }"
        class="text-gray-400 gap-x-3"
      >
        <q-icon name="keyboard_backspace" class="text-gray-400" />
        Internal Groups
      </RouterLink>
      <span>/</span>
      <span>Edit Internal Group</span>
    </div>
    <!-- Form -->
    <Form
      v-if="!formLoading"
      :id="route.params.id"
      @submit="submit"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { updateInternalGroup } from "src/api/InternalGroup";
import { Loading, Notify } from "quasar";
import Form from "src/components/InternalGroup/Form.vue";
import useInternalGroupStore from "src/stores/modules/internalGroup";

const router = useRouter();
const route = useRoute();
const internalGroupStore = useInternalGroupStore();
const data = computed(() => internalGroupStore.item);
const loading = ref(false);
const formLoading = ref(false);

const submit = async (value) => {
  loading.value = true;
  try {
    await updateInternalGroup({
      ...value.form,
      id: route.params.id,
      users: value.users,
      tags: value.tags,
      customer_groups: value.customerGroups,
    });
    Notify.create({
      message: "Internal Group successfully updated!",
      type: "positive",
      color: "primary",
      position: "top",
    });
    router.push({ name: "internal-group" });
  } catch (error) {
    Notify.create(error);
  }
  loading.value = true;
};
onMounted(async () => {
  Loading.show();
  formLoading.value = true;
  await internalGroupStore.get(route.params.id);
  formLoading.value = false;
  Loading.hide();
  if (data.value.type === "personal") {
    Notify.create({
      message: "You can not edit personal group",
      position: "top",
      type: "negative",
    });
    router.replace("/internal-group");
  }
});
</script>
