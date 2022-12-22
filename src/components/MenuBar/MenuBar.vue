<template>
  <div class="menu-holder">
    <img src="../../assets/images/pluscomp.png" class="plus-img" />
    <img src="../../assets/images/messages.png" class="message-img" /><img src="../../assets/images/notification.png"
      class="notification-img" /><img src="../../assets/images/profileavatar.png" class="profile-img" /><img
      src="../../assets/images/dropdownreal.png" class="dropdown-img" />
  </div>
</template>

<script>

import { defineComponent, ref } from 'vue'
import './MenuBar.scss'
export default defineComponent({
  setup () {
    return {
      drawer: ref(true),
      menuList
    }
  },

  name: 'MenuBar',

  components: {}
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
