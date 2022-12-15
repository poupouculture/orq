<template>
  <q-table :selected-rows-label="getSelectedString" selection="multiple" class="statement-table" :rows="currencyData"
    :hide-header="grid" :columns="currencyColumns" row-key="__index" :grid="grid" :filter="filter"
    v-model:pagination="pagination" :rows-per-page-options="[6]" @focusin="activateNavigation"
    @focusout="deactivateNavigation" @keydown="onKey" tabindex="0" :loading="loading" table-class="my-custom"
    v-model:selected="selected">

    <q-tr :props="props">
      <q-th v-for="col in props.cols" :key="col.name" :props="props">
        {{ col.label }}
      </q-th>
    </q-tr>

    <template #body-cell-IncurredMonth="props">
      <q-td :props="props">
        <div class="firstrowholder">
          <div><q-avatar size="36px" color="red" text-color="white" icon="directions" />
          </div>
          <div class="subrow">
            <p class="headingtext">Chester Buchanan</p>
            <p class="subheadingtext">2022-8-10</p>

          </div>
        </div>
        <p>
        </p>

      </q-td>

    </template>
    <template>
      <div class="absolute-bottom-right">
        <q-pagination v-model="current" max="5" direction-links push color="teal" active-design="push"
          active-color="orange" />
      </div>
    </template>
  </q-table>
  <q-dialog v-model="show_dialog">
    <q-card style="width: 400px; max-width: 75vw; border-radius: 15px">
      <q-card-section>
        <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
        <div class="editholder">
          <div class="Editheading">Edit</div>
        </div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section class="q-mt-xs">
        <q-form class="q-gutter-md">

        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import '../ContactsTable/ContactsTable.scss'

const defaultItem = {
  IncurredMonth: '',
  InvoiceDate: '',
  InvoiceNo: '',
  CsCode: '',
  CoCodeOther: '',
  NoofChit: '',
  Invoice: ''
}
const statuses = ['Active', 'Inactive']
const currencyColumns = [

  {
    name: 'IncurredMonth',
    align: 'left',
    label: 'Abstract',
    field: 'IncurredMonth',
    sortable: true,

    classes: 'text-black'
  },
  {
    name: 'InvoiceDate',
    align: 'center',
    label: 'Id field',
    field: 'InvoiceDate',
    sortable: true,
    classes: 'text-black'
  },
  {
    name: 'InvoiceNo',
    align: 'left',
    label: 'Customer Code',
    field: 'InvoiceNo',
    sortable: true,
    classes: 'text-black'
  },
  {
    name: 'CsCode',
    align: 'center',
    label: 'Label',
    field: 'CsCode',
    classes: 'text-black'
  },

  {
    name: 'Invoice',
    align: 'center',
    label: 'Operation',
    field: 'Invoice',
    classes: 'text-blue'
  }
]
const currencies = [
  {

    IncurredMonth: {
      data: 'ss'
    },
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },

  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  },
  {
    IncurredMonth: '2022 SEP',
    InvoiceDate: '2022-10-10',
    InvoiceNo: 'F00110',

    CsCode: 'CODE12',
    CoCodeOther: 'ABC130',
    NoofChit: '120',
    Invoice: 'Edit',

    status: 'Active'
  }
]
export default {
  name: 'ContactsTable',
  props: {
    msg: String
  },

  setup () {
    const selected = ref([])

    const fd = reactive({
      shape: ref('Enable'),
      grid: false,
      selected: [],
      statusOpts: statuses,
      inFs: false,
      model: ref(null),
      options: ['Active', 'Inactive'],
      noti: () => { },
      show_dialog: false,
      editedIndex: -1,
      editedItem: defaultItem,
      filter: '',
      currencyColumns,
      currencyData: currencies,
      pagination: {
        page: 1
      },
      page: 1,
      totalRecord: 0,
      pageCount: 1
    })

    // function editRow (props) {
    //   fd.noti()
    //   // do something
    //   fd.noti = q$.notify({
    //     type: 'info',
    //     textColor: 'grey-10',
    //     multiLine: true,
    //     message: `I'll edit row data => ${JSON.stringify(props.row)
    //       .split(',')
    //       .join(', ')}`,
    //     timeout: 2000
    //   })
    // }

    // function deleteRow (props) {
    //   fd.noti()
    //   // do something
    //   fd.noti = q$.notify({
    //     type: 'negative',
    //     multiline: true,
    //     message: `I'll delete row data => ${JSON.stringify(props.row)
    //       .split(',')
    //       .join(', ')}`,
    //     timeout: 2000
    //   })
    // }

    function addRow () {
      if (fd.editedIndex > -1) {
        Object.assign(fd.currencyData[fd.editedIndex], fd.editedItem)
      } else {
        fd.currencyData.push(fd.editedItem)
      }
      fd.close()
    }

    function deleteItem (item) {
      const index = fd.currencyData.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        fd.currencyData.splice(index, 1)
    }

    function editItem (item) {
      fd.editedIndex = fd.currencyData.findIndex(
        (v, i) => v.__index === item.__index
      )
      fd.editedItem = Object.assign({}, item)
      fd.show_dialog = true
    }

    function editModal (item) { }

    function close () {
      fd.show_dialog = false
      setTimeout(() => {
        fd.editedItem = defaultItem
        fd.editedIndex = -1
      }, 300)
    }

    function setFs (props) {
      props.toggleFullscreen()
      fd.inFs = props.inFullscreen
    }

    // function updateRow () {
    //   fd.currencyData.splice(fd.editedIndex, 1, fd.editedItem)
    //   q$.notify({
    //     type: 'positive',
    //     message: `Item '${fd.editedItem.name}' updated.`,
    //     timeout: 500
    //   })
    // }
    onMounted(() => {
      // add indices
      fd.currencyData = fd.currencyData.map((v, i) => ({ ...v, __index: i }))
    })

    return {
      ...toRefs(fd),
      addRow,
      deleteItem,
      editItem,
      close,
      setFs,
      editModal,
      selected,
      current: ref(3)

    }
  }
}
</script>

<style scoped>

</style>
