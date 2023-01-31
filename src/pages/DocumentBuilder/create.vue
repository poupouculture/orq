<template>
  <div class="w-full flex" style="height: 1200px">
    <div class="w-9/12 bg-white">
      <Vue3DraggableResizable
        :initW="wLogo"
        :initH="hLogo"
        v-model:x="xLogo"
        v-model:y="yLogo"
        v-model:w="wLogo"
        v-model:h="hLogo"
        v-model:active="activeLogo"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
        class="text-center"
      >
        Upload your logo
        <div class="w-full border border-dashed mt-2 p-10">
          <span class="text-red-600"> Upload a file </span>
          or drag and drop JPG, PNG, GIF up to 5MB <br />
          Recommended size: 600 x 300 pixels
        </div>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wTitleAndRef"
        :initH="hTitleAndRef"
        v-model:x="xTitleAndRef"
        v-model:y="yTitleAndRef"
        v-model:w="wTitleAndRef"
        v-model:h="hTitleAndRef"
        v-model:active="activeTitleAndRef"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <h1 class="text-3xl">Invoice</h1>
        <input
          type="text"
          placeholder="Reference (optional)"
          class="w-full border rounded-lg mt-2 h-10 p-4"
        />
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wBillTo"
        :initH="hBillTo"
        v-model:x="xBillTo"
        v-model:y="yBillTo"
        v-model:w="wBillTo"
        v-model:h="hBillTo"
        v-model:active="activeBillTo"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <span class="font-semibold"> Bill to </span>
        <p>Required before continuing the next step</p>
        <button class="bg-primary text-white p-2 mt-2 rounded-lg">
          <q-icon name="person" class="text-xl" />
          <q-icon name="add" class="text-xs -ml-2" />
          Add a customer
        </button>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wSynqueTitle"
        :initH="hSynqueTitle"
        v-model:x="xSynqueTitle"
        v-model:y="ySynqueTitle"
        v-model:w="wSynqueTitle"
        v-model:h="hSynqueTitle"
        v-model:active="activeSynqueTitle"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <span class="font-semibold"> Synque Limited </span>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wTotalAmount"
        :initH="hTotalAmount"
        v-model:x="xTotalAmount"
        v-model:y="yTotalAmount"
        v-model:w="wTotalAmount"
        v-model:h="hTotalAmount"
        v-model:active="activeTotalAmount"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <span class="text-xl" style="font-weight: 100">HKD </span>
        <span class="text-xl font-semibold">0.00</span>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wInvoiceNo"
        :initH="hInvoiceNo"
        v-model:x="xInvoiceNo"
        v-model:y="yInvoiceNo"
        v-model:w="wInvoiceNo"
        v-model:h="hInvoiceNo"
        v-model:active="activeInvoiceNo"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <div class="w-full flex items-center">
          <div class="w-1/3 pr-2 text-right">Invoice no.</div>
          <div class="w-2/3">
            <input
              type="text"
              placeholder="Invoice Number"
              class="w-full border rounded-lg mt-2 h-10 p-4"
            />
          </div>
        </div>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wIssuedDate"
        :initH="hIssuedDate"
        v-model:x="xIssuedDate"
        v-model:y="yIssuedDate"
        v-model:w="wIssuedDate"
        v-model:h="hIssuedDate"
        v-model:active="activeIssuedDate"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <div class="w-full flex items-center">
          <div class="w-1/3 pr-2 text-right">Invoice Issued</div>
          <div class="w-2/3">
            <input
              type="date"
              placeholder="Invoice Issued"
              class="w-full border rounded-lg mt-2 h-10 p-4"
            />
          </div>
        </div>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wDueDate"
        :initH="hDueDate"
        v-model:x="xDueDate"
        v-model:y="yDueDate"
        v-model:w="wDueDate"
        v-model:h="hDueDate"
        v-model:active="activeDueDate"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <div class="w-full flex items-center">
          <div class="w-1/3 pr-2 text-right">Due date</div>
          <div class="w-2/3">
            <input
              type="date"
              placeholder="Due date"
              class="w-full border rounded-lg mt-2 h-10 p-4"
            />
          </div>
        </div>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wItems"
        :initH="hItems"
        v-model:x="xItems"
        v-model:y="yItems"
        v-model:w="wItems"
        v-model:h="hItems"
        v-model:active="activeItems"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <div class="w-full flex flex-col">
          <div class="w-full flex gap-3">
            <div class="w-5/12 flex flex-col">
              <div class="text-gray-500 font-semibold">ITEM</div>
              <input
                type="text"
                placeholder="Enter Item Name"
                class="w-full border rounded-lg mt-4 h-10 p-4"
              />
              <textarea
                rows="2"
                placeholder="Enter a description (optional)"
                class="w-full border rounded-lg mt-2 p-4"
              ></textarea>
            </div>
            <div class="w-3/12 flex flex-col">
              <div class="w-full text-right text-gray-500 font-semibold">
                QTY
              </div>
              <input
                type="number"
                placeholder="Enter the Qty"
                class="w-full border rounded-lg mt-4 h-10 p-4"
              />
              <button class="py-2 text-red-700 text-left">
                <q-icon name="add" class="text-xl" />
                Add Unit
              </button>
            </div>
            <div class="w-1/12 flex flex-col">
              <div class="w-full text-right text-gray-500 font-semibold">
                Rate
              </div>
              <input
                type="number"
                placeholder="Rate"
                class="w-full border rounded-lg mt-4 h-10 p-4"
              />
            </div>
            <div class="w-2/12 flex flex-col">
              <div class="w-full text-right text-gray-500 font-semibold">
                Total
              </div>
              <span class="text-right mt-4">HKD 0.00</span>
            </div>
          </div>
          <div class="w-full mt-4">
            <button class="border rounded-lg px-4 py-2">
              <q-icon name="add" class="text-xl" />
              Add Item
            </button>
          </div>
        </div>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wStamp"
        :initH="hStamp"
        v-model:x="xStamp"
        v-model:y="yStamp"
        v-model:w="wStamp"
        v-model:h="hStamp"
        v-model:active="activeStamp"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <div class="w-full flex">
          <button class="border rounded-lg px-4 py-2">
            <q-icon name="add" class="text-xl" />
            Add company stamp / chop
          </button>
        </div>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wPaymentInstructions"
        :initH="hPaymentInstructions"
        v-model:x="xPaymentInstructions"
        v-model:y="yPaymentInstructions"
        v-model:w="wPaymentInstructions"
        v-model:h="hPaymentInstructions"
        v-model:active="activePaymentInstructions"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <div class="w-full flex flex-col">
          <div>
            <span class="font-semibold"> Payment instructions </span>
            <span class="text-gray-500">(optional)</span>
          </div>
          <div>
            <textarea
              rows="2"
              placeholder="Add payment instructions"
              class="w-full border rounded-lg mt-2 p-4"
            ></textarea>
          </div>
        </div>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wNotes"
        :initH="hNotes"
        v-model:x="xNotes"
        v-model:y="yNotes"
        v-model:w="wNotes"
        v-model:h="hNotes"
        v-model:active="activeNotes"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <div class="w-full flex flex-col">
          <div>
            <span class="font-semibold"> Notes / terms </span>
            <span class="text-gray-500">(optional)</span>
          </div>
          <div>
            <textarea
              rows="2"
              placeholder="Add notes / terms"
              class="w-full border rounded-lg mt-2 p-4"
            ></textarea>
          </div>
        </div>
      </Vue3DraggableResizable>

      <Vue3DraggableResizable
        :initW="wAmountDue"
        :initH="hAmountDue"
        v-model:x="xAmountDue"
        v-model:y="yAmountDue"
        v-model:w="wAmountDue"
        v-model:h="hAmountDue"
        v-model:active="activeAmountDue"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        <div class="w-full flex flex-col">
          <div class="w-full flex border-b pb-2">
            <div class="w-2/3 text-right">Total</div>
            <div class="w-1/3 text-right">HKD 0.00</div>
          </div>
          <div class="w-full flex items-center border-b py-2">
            <div class="w-2/3 flex justify-end items-center">
              Amount
              <button class="border rounded-lg p-1 ml-2">HKD</button>
            </div>
            <div class="w-1/3 text-right">
              HKD
              <span class="font-semibold">0.00</span>
            </div>
          </div>
        </div>
      </Vue3DraggableResizable>
    </div>
    <div class="w-3/12 flex flex-col bg-gray-100 p-4">
      <h4 class="font-semibold">Customise Invoice</h4>
      <span class="mt-4 font-semibold">Invoice currency</span>
      <span class="text-xs">
        Select the currency for this invoice. Overrides your
        <b>default invoice currency</b> setting.
      </span>
      <InputSelect
        :options="currencies"
        :default="currency"
        :value="currency"
        @input="updateCurrency"
        class="bg-white mt-2"
      />
      <span class="mt-4 font-semibold">Accepted Payment Method</span>
      <div class="w-full flex gap-2">
        <div><q-icon name="fa-solid fa-toggle-off" /></div>
        <div>Credit Card</div>
      </div>
      <div>
        <div class="w-16 rounded-xl text-center py-1 border text-xs">
          Pending
        </div>
      </div>
      <span class="mt-4 font-semibold"> Who pays the transcation fee? </span>
      <span class="text-xs"> For credit card payment only. </span>
      <span class="mt-4 font-semibold">Other setting</span>
      <div class="w-full flex justify-between items-center mt-2">
        <div class="flex flex items-center gap-2">
          <div>
            <q-icon name="fa-solid fa-briefcase" />
          </div>
          <span class="">Update business info</span>
        </div>
        <div>
          <q-icon name="fa-solid fa-chevron-right " />
        </div>
      </div>
      <div class="w-full flex justify-between items-center mt-2">
        <div class="flex flex items-center gap-2">
          <div>
            <q-icon name="edit" />
          </div>
          <span class="">Invoice customisation</span>
        </div>
        <div>
          <q-icon name="fa-solid fa-chevron-right " />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Vue3DraggableResizable from "vue3-draggable-resizable";
import InputSelect from "../../components/InputSelect.vue";

export default defineComponent({
  components: { Vue3DraggableResizable, InputSelect },
  data() {
    return {
      xLogo: 50,
      yLogo: 100,
      wLogo: 300,
      hLogo: 200,
      activeLogo: false,
      xTitleAndRef: 50,
      yTitleAndRef: 320,
      hTitleAndRef: 100,
      wTitleAndRef: 300,
      activeTitleAndRef: false,
      xBillTo: 50,
      yBillTo: 430,
      hBillTo: 100,
      wBillTo: 300,
      activeBillTo: false,
      xSynqueTitle: 690,
      ySynqueTitle: 100,
      hSynqueTitle: 30,
      wSynqueTitle: 100,
      activeSynqueTitle: false,
      xTotalAmount: 697,
      yTotalAmount: 320,
      hTotalAmount: 30,
      wTotalAmount: 100,
      activeTotalAmount: false,
      xInvoiceNo: 490,
      yInvoiceNo: 360,
      hInvoiceNo: 50,
      wInvoiceNo: 300,
      activeInvoiceNo: false,
      xIssuedDate: 490,
      yIssuedDate: 420,
      hIssuedDate: 50,
      wIssuedDate: 300,
      activeIssuedDate: false,
      xDueDate: 490,
      yDueDate: 480,
      hDueDate: 50,
      wDueDate: 300,
      activeDueDate: false,
      xItems: 50,
      yItems: 560,
      hItems: 240,
      wItems: 760,
      activeItems: false,
      xStamp: 50,
      yStamp: 820,
      hStamp: 50,
      wStamp: 240,
      activeStamp: false,
      xPaymentInstructions: 50,
      yPaymentInstructions: 900,
      hPaymentInstructions: 120,
      wPaymentInstructions: 400,
      activePaymentInstructions: false,
      xNotes: 50,
      yNotes: 1030,
      hNotes: 120,
      wNotes: 400,
      activeNotes: false,
      xAmountDue: 540,
      yAmountDue: 820,
      hAmountDue: 80,
      wAmountDue: 240,
      activeAmountDue: false,
      currencies: ["Hong Kong Dollar"],
      currency: "Hong Kong Dollar",
    };
  },
  methods: {
    print(val) {
      console.log(val);
    },
    updateCurrency(val) {
      this.currency = val;
    },
  },
});
</script>
