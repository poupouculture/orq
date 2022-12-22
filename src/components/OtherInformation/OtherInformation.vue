<template>
  <div class="main-hold">
    <img src="../../assets/images/otherinfomain.png" />
    <p class="bottom-textmain">There are currently no custom fields</p>
    <p class="bottom-textsub">Administrators can go to the system administration and add custom fields to help companies
      expand their information.</p>
  </div>
</template>

<script>

import { defineComponent, ref } from 'vue'
import './OtherInformation.scss'
export default defineComponent({
  setup () {
    return {
      drawer: ref(true),
      firstname: ref(''),
      lastname: ref(''),
      ID: ref(''),
      customercode: ref(''),
      gender: ref(),

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
      genderdata: ['Male', 'Female', 'Others'],

      tags: ref('')
    }
  },
  data () {
    return {
      text: '',
      date: ''
    }
  },
  name: 'OtherInformation',

  components: {}
})

</script>
<style lang="sass" scoped>
.row > div
  padding: 5px 10px
.row + .row
  margin-top: 1rem

</style>
