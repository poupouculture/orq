<template>
<div class="Remark-main">
<p class="remark-heading">Description</p>
<q-input
      v-model="text"
      type="textarea"
      class="inp-cls"
      outlined
      auto-focus =false
      color = "white"
    /></div>
</template>

<script>

import { defineComponent } from 'vue'
import './Remark.scss'
export default defineComponent({
  setup () {
    return {

    }
  },
  data () {
    return {

    }
  },
  name: 'RemarkTab',

  components: {}
})

</script>
<style lang="sass" scoped>

</style>
