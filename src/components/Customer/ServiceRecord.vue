<template>
  <ServiceRecordList class="px-2 pt-2" :response="responseCode" />
</template>
<script setup>
import { api } from "src/boot/axios";
import useCustomerStore from "src/stores/modules/customer";
import useServiceRecordStore from "src/stores/modules/serviceRecord";
import { onMounted, computed, ref, watch } from "vue";
import ServiceRecordList from "src/components/ServiceReference/ServiceRecordList.vue";

const responseCode = ref(200);
const serviceRecordStore = useServiceRecordStore();
const customerStore = useCustomerStore();
const customer = computed(() => customerStore.getCustomer);

watch(customer, () => {
  getData();
});
const getData = async () => {
  if (customer.value.id) {
    serviceRecordStore.setServiceRecord(null);
    const { data } = await api.get("/items/service_references", {
      params: {
        "filter[customer][_eq]": customer.value.id,
      },
    });
    if (data.data.length) {
      responseCode.value = 200;
      await serviceRecordStore.getServiceRecords(data.data[0].id);
    } else {
      responseCode.value = 404;
      serviceRecordStore.setServiceRecord([]);
    }
  }
};
onMounted(async () => {
  getData();
});
</script>
<style scoped>
.bg-timeline-content {
  background-color: #f2f3f7;
}
</style>
