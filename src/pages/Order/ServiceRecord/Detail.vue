<template>
  <div class="pt-4">
    <!-- Heading -->
    <div
      class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
    >
      <RouterLink
        :to="{ name: 'order.service-record' }"
        class="text-gray-400 gap-x-3 items-center flex"
      >
        <q-icon name="keyboard_backspace" class="text-gray-400" />
        <span>Service Record</span>
      </RouterLink>
      <span>/</span>
      <span>#{{ item.reference_number }}</span>
    </div>
    <div class="px-8 py-4 bg-white rounded-2xl">
      <ServiceRecordList />
    </div>
  </div>
</template>
<script setup>
import ServiceRecordList from "src/components/ServiceReference/ServiceRecordList.vue";
import useServiceRecordStore from "src/stores/modules/serviceRecord";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Loading } from "quasar";

const serviceRecordStore = useServiceRecordStore();
const item = computed(() => serviceRecordStore.getItem);
const route = useRoute();

onMounted(async () => {
  Loading.show();
  await serviceRecordStore.getServiceReference(route.params.id);
  await serviceRecordStore.getServiceRecords(route.params.id);
  Loading.hide();
});
</script>
