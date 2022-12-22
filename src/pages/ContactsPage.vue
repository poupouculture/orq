<template>
  <div class="main-container">
    <MenuBar />
    <p class="header-text">Contact</p>
    <div class="filters-holder">
      <div class="inputholders">
        <q-select outlined v-model="model" :options="options" :options-dense="denseOpts" class="select-input" dense>
          <template v-slot:prepend>

          </template>
        </q-select>
        <div class="q-pa-md">
          <div class="q-gutter-y-md column" style="max-width: 300px">
            <q-input outlined v-model="ph" placeholder="Placeholder" hint="With placeholder" dense no-shadow />
          </div>
        </div>
        <div class="q-pa-md">
          <q-input filled v-model="date" mask="date" :rules="['date']" dense outlined>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-select outlined v-model="model" :options="options" :options-dense="denseOpts" class="select" dense>
          <template v-slot:prepend>

          </template>
        </q-select><q-select outlined v-model="model" :options="options" :options-dense="denseOpts" class="select"
          dense>
          <template v-slot:prepend>

          </template>
        </q-select>
      </div>

      <q-input v-model="ph" placeholder="Placeholder" hint="With placeholder" :dense="dense" outlined />

    </div>
    <ContactsTable />
  </div>
</template>

<script>

import { defineComponent, ref } from 'vue'
import ContactsTable from 'src/components/ContactsTable/ContactsTable.vue'
import MenuBar from 'src/components/MenuBar/MenuBar.vue'
import '../pages/Contacts.scss'
export default defineComponent({
  setup () {
    return {
      drawer: ref(true),
      menuList,
      model: ref(null),
      date: ref('2019/02/01'),

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],

      dense: ref(false),
      denseOpts: ref(false)
    }
  },

  name: 'DrawerBar',

  components: { ContactsTable, MenuBar }
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
