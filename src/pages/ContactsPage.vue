<template>
  <DrawerVue />
</template>

<script>

import { defineComponent, ref } from 'vue'
import DrawerVue from 'src/components/SideDrawer/Drawer.vue'
export default defineComponent({
  setup () {
    return {
      drawer: ref(true),
      menuList
    }
  },

  name: 'DrawerBar',

  components: { DrawerVue }
})
const menuList = [
  {
    icon: 'receipt',
    label: 'receipt',
    separator: false
  },

  {
    icon: 'receipt',
    label: 'receipt',
    separator: false
  },
  {
    icon: 'receipt',
    label: 'receipt',
    separator: false
  },
  {
    icon: 'receipt',
    label: 'receipt',
    separator: false
  },
  {
    icon: 'receipt',
    label: 'receipt',
    separator: false
  }
]

</script>
