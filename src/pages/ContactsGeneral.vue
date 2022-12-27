<template>
  <div class="main-container">
    <MenuBar />
    <div class="header-row">
      <img src="../assets/images/Backarrow.png" class="back-img" />
      <p class="header-text">Contact</p>
      <p class="header-text">/</p>
      <p class="header-blacktext">Chester Buchanan</p>
    </div>
    <div class="header-row">
      <q-btn
        outline
        style="color: #4b44f6"
        label="Transaction Log"
        class="header-button"
      />
      <q-btn
        style="background: #4b44f6; color: white"
        label="Merge"
        class="header-button"
      />
    </div>
    <div class="form-holder">
      <ContactsForm />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import "./ContactsGeneral.scss";
import MenuBar from "src/components/MenuBar/MenuBar.vue";
import ContactsForm from "src/components/ContactsForm/ContactsForm.vue";
export default defineComponent({
  name: "ContactsGeneral",
  components: { MenuBar, ContactsForm },
});
</script>
