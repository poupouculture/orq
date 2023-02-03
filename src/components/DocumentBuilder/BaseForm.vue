<template>
  <div class="w-full flex" style="height: 1200px">
    <div class="w-9/12 bg-white">
      <Vue3DraggableResizable
        :initW="logo.w"
        :initH="logo.h"
        v-model:x="logo.x"
        v-model:y="logo.y"
        v-model:w="logo.w"
        v-model:h="logo.h"
        v-model:active="logo.active"
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
        :initW="TitleAndRef.w"
        :initH="TitleAndRef.h"
        v-model:x="TitleAndRef.x"
        v-model:y="TitleAndRef.y"
        v-model:w="TitleAndRef.w"
        v-model:h="TitleAndRef.h"
        v-model:active="TitleAndRef.active"
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
        :initW="BillTo.w"
        :initH="BillTo.h"
        v-model:x="BillTo.x"
        v-model:y="BillTo.y"
        v-model:w="BillTo.w"
        v-model:h="BillTo.h"
        v-model:active="BillTo.active"
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
        :initW="SynqueTitle.w"
        :initH="SynqueTitle.h"
        v-model:x="SynqueTitle.x"
        v-model:y="SynqueTitle.y"
        v-model:w="SynqueTitle.w"
        v-model:h="SynqueTitle.h"
        v-model:active="SynqueTitle.active"
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
        :initW="TotalAmount.w"
        :initH="TotalAmount.h"
        v-model:x="TotalAmount.x"
        v-model:y="TotalAmount.y"
        v-model:w="TotalAmount.w"
        v-model:h="TotalAmount.h"
        v-model:active="TotalAmount.active"
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
        :initW="InvoiceNo.w"
        :initH="InvoiceNo.h"
        v-model:x="InvoiceNo.x"
        v-model:y="InvoiceNo.y"
        v-model:w="InvoiceNo.w"
        v-model:h="InvoiceNo.h"
        v-model:active="InvoiceNo.active"
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
        :initW="IssuedDate.w"
        :initH="IssuedDate.h"
        v-model:x="IssuedDate.x"
        v-model:y="IssuedDate.y"
        v-model:w="IssuedDate.w"
        v-model:h="IssuedDate.h"
        v-model:active="IssuedDate.active"
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
        :initW="DueDate.w"
        :initH="DueDate.h"
        v-model:x="DueDate.x"
        v-model:y="DueDate.y"
        v-model:w="DueDate.w"
        v-model:h="DueDate.h"
        v-model:active="DueDate.active"
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
        :initW="Items.w"
        :initH="Items.h"
        v-model:x="Items.x"
        v-model:y="Items.y"
        v-model:w="Items.w"
        v-model:h="Items.h"
        v-model:active="Items.active"
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
        :initW="Stamp.w"
        :initH="Stamp.h"
        v-model:x="Stamp.x"
        v-model:y="Stamp.y"
        v-model:w="Stamp.w"
        v-model:h="Stamp.h"
        v-model:active="Stamp.active"
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
        :initW="PaymentInstructions.w"
        :initH="PaymentInstructions.h"
        v-model:x="PaymentInstructions.x"
        v-model:y="PaymentInstructions.y"
        v-model:w="PaymentInstructions.w"
        v-model:h="PaymentInstructions.h"
        v-model:active="PaymentInstructions.active"
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
        :initW="Notes.w"
        :initH="Notes.h"
        v-model:x="Notes.x"
        v-model:y="Notes.y"
        v-model:w="Notes.w"
        v-model:h="Notes.h"
        v-model:active="Notes.active"
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
        :initW="AmountDue.w"
        :initH="AmountDue.h"
        v-model:x="AmountDue.x"
        v-model:y="AmountDue.y"
        v-model:w="AmountDue.w"
        v-model:h="AmountDue.h"
        v-model:active="AmountDue.active"
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
      <div class="w-full flex justify-end gap-2">
        <button
          class="px-6 py-2 bg-gray-300 font-semibold rounded-md"
          @click="submit"
        >
          Save
        </button>
        <button class="px-6 py-2 bg-primary text-white rounded-md">
          Download
        </button>
      </div>
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
        <div class="hover: cursor-pointer" @click="toggleAcceptMethod">
          <q-icon name="fa-solid fa-toggle-on" v-if="acceptedMethod" />
          <q-icon name="fa-solid fa-toggle-off" v-else />
        </div>
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
import {
  components as comp,
  ISSUED_TO as it,
} from "../../constants/documentTemplate.js";

export default defineComponent({
  components: { Vue3DraggableResizable, InputSelect },
  props: {
    documentTemplate: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      logo: {
        x: 50,
        y: 100,
        w: 300,
        h: 200,
        active: false,
      },
      TitleAndRef: {
        x: 50,
        y: 320,
        h: 100,
        w: 300,
        active: false,
      },
      BillTo: {
        x: 50,
        y: 430,
        h: 100,
        w: 300,
        active: false,
      },
      SynqueTitle: {
        x: 690,
        y: 100,
        h: 30,
        w: 100,
        active: false,
      },
      TotalAmount: {
        x: 697,
        y: 320,
        h: 30,
        w: 100,
        active: false,
      },
      InvoiceNo: {
        x: 490,
        y: 360,
        h: 50,
        w: 300,
        active: false,
      },
      IssuedDate: {
        x: 490,
        y: 420,
        h: 50,
        w: 300,
        active: false,
      },
      DueDate: {
        x: 490,
        y: 480,
        h: 50,
        w: 300,
        active: false,
      },
      Items: {
        x: 50,
        y: 560,
        h: 240,
        w: 760,
        active: false,
      },
      Stamp: {
        x: 50,
        y: 820,
        h: 50,
        w: 240,
        active: false,
      },
      PaymentInstructions: {
        x: 50,
        y: 900,
        h: 120,
        w: 400,
        active: false,
      },
      Notes: {
        x: 50,
        y: 1030,
        h: 120,
        w: 400,
        active: false,
      },
      AmountDue: {
        x: 540,
        y: 820,
        h: 80,
        w: 240,
        active: false,
      },
      currencies: ["Hong Kong Dollar"],
      currency: "Hong Kong Dollar",
      acceptedMethod: false,
    };
  },
  mounted() {
    if (this.documentTemplate) {
      const tempData = this.documentTemplate.data.data;

      const logoComponent = tempData?.components?.find(
        (c) => c.type === comp.LOGO
      );
      const TitleAndRefComponent = tempData?.find((c) => c.type === comp.TITLE);
      const BillToComponent = tempData?.find((c) => c.type === comp.BILL_TO);
      const SynqueTitleComponent = tempData?.find(
        (c) => c.type === comp.SYNQUE
      );
      const TotalAmountComponent = tempData?.find(
        (c) => c.type === comp.TOTAL_AMOUNT
      );
      const InvoiceNoComponent = tempData?.find(
        (c) => c.type === comp.INVOICE_NUMBER
      );
      const IssuedDateComponent = tempData?.find(
        (c) => c.type === comp.ISSUED_DATE
      );
      const DueDateComponent = tempData?.find((c) => c.type === comp.DUE_DATE);
      const ItemsComponent = tempData?.find((c) => c.type === comp.ITEMS);
      const StampComponent = tempData?.find((c) => c.type === comp.STAMP);
      const PaymentInstructionsComponent = tempData?.find(
        (c) => c.type === comp.PAYMENT_INSTRUCTIONS
      );
      const NotesComponent = tempData?.find((c) => c.type === comp.NOTES);
      const AmountDueComponent = tempData?.find(
        (c) => c.type === comp.AMOUNT_DUE
      );

      this.logo = [...logoComponent];
      this.TitleAndRef = [...TitleAndRefComponent];
      this.BillTo = [...BillToComponent];
      this.SynqueTitle = [...SynqueTitleComponent];
      this.TotalAmount = [...TotalAmountComponent];
      this.InvoiceNo = [...InvoiceNoComponent];
      this.IssuedDate = [...IssuedDateComponent];
      this.DueDate = [...DueDateComponent];
      this.Items = [...ItemsComponent];
      this.Stamp = [...StampComponent];
      this.PaymentInstructions = [...PaymentInstructionsComponent];
      this.Notes = [...NotesComponent];
      this.AmountDue = [...AmountDueComponent];

      this.invoice_currency = tempData.invoice_currency;
      this.acceptedMethod = !(
        tempData.payment_methods === null || tempData.payment_methods === []
      );
    }
  },
  methods: {
    print(val) {
      console.log(val);
    },
    updateCurrency(val) {
      this.currency = val;
    },
    toggleAcceptMethod() {
      this.acceptedMethod = !this.acceptedMethod;
    },
    submit() {
      this.$emit("submit", {
        invoice_currency: this.currency,
        payment_methods: this.acceptedMethod ? { type: "Credit Card" } : null,
        fee_issued_to: it.CUSTOMER,
        components: [
          {
            type: comp.LOGO,
            ...this.logo,
          },
          {
            type: comp.TITLE,
            ...this.TitleAndRef,
          },
          {
            type: comp.BILL_TO,
            ...this.BillTo,
          },
          {
            type: comp.SYNQUE,
            ...this.SynqueTitle,
          },
          {
            type: comp.TOTAL_AMOUNT,
            ...this.TotalAmount,
          },
          {
            type: comp.INVOICE_NUMBER,
            ...this.InvoiceNo,
          },
          {
            type: comp.ISSUED_DATE,
            ...this.IssuedDate,
          },
          {
            type: comp.DUE_DATE,
            ...this.DueDate,
          },
          {
            type: comp.ITEMS,
            ...this.Items,
          },
          {
            type: comp.STAMP,
            ...this.Stamp,
          },
          {
            type: comp.PAYMENT_INSTRUCTIONS,
            ...this.PaymentInstructions,
          },
          {
            type: comp.NOTES,
            ...this.Notes,
          },
          {
            type: comp.AMOUNT_DUE,
            ...this.AmountDue,
          },
        ],
      });
    },
  },
  emits: ["submit"],
});
</script>
