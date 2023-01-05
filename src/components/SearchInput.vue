<template>
  <q-input
    placeholder="Search"
    bg-color="dark"
    outlined
    dense
    class="search-field"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="teal-1" />
    </template>
  </q-input>
</template>

<style scoped>
::v-deep .q-field__native,
.q-field__prefix,
.q-field__suffix,
.q-field__input {
  color: #fff;
}
</style>
