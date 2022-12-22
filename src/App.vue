<template>
  <DrawerLayout />
</template>

<script>
// eslint-disable-next-line import/default
import { defineComponent } from 'vue'
import DrawerLayout from './layouts/DrawerLayout.vue'
// import '../index.css'
export default defineComponent({
  name: 'App',
  components: { DrawerLayout }
})
</script>
