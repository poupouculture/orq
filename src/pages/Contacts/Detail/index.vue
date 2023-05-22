<template>
  <div class="main-container">
    <MenuBar />
    <div class="header-row">
      <img src="../../../assets/images/Backarrow.png" class="back-img" />
      <p class="header-text">Contact</p>
      <p class="header-text">/</p>
      <p class="header-blacktext">{{ data.firstName }} {{ data.lastName }}</p>
    </div>
    <div class="header-row">
      <q-btn
        outline
        style="color: #4b44f6"
        label="Transaction Log"
        class="header-button"
      />
      <!-- <q-btn
        style="background: #4b44f6; color: white"
        label="Merge"
        class="header-button"
      /> -->
    </div>
    <div class="form-holder">
      <ContactsForm :customer="data" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import "./style.scss";
import MenuBar from "src/components/MenuBar/MenuBar.vue";
import ContactsForm from "src/components/ContactsForm/ContactsForm.vue";
import { useRoute } from "vue-router";
import useCustomerStore from "src/stores/modules/customer";

const route = useRoute();
const customerStore = useCustomerStore();
const data = reactive({
  firstName: "",
  lastName: "",
});

onMounted(() => {
  const id = route.params.id;
  customerStore.fetchCustomer(id);
});
</script>
