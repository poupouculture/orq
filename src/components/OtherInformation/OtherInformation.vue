<template>
  <div class="main-hold">
    <img src="../../assets/images/otherinfomain.png" />
    <p class="bottom-textmain">There are currently no custom fields</p>
    <p class="bottom-textsub">
      Administrators can go to the system administration and add custom fields
      to help companies expand their information.
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import "./OtherInformation.scss";

const drawer = ref(true);
const firstname = ref("");
const lastname = ref("");
const ID = ref("");
const customercode = ref("");
const gender = ref();
const options = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];
const genderdata = ["Male", "Female", "Others"];
const tags = ref("");
</script>

<style lang="sass" scoped>
.row > div
  padding: 5px 10px
.row + .row
  margin-top: 1rem
</style>
