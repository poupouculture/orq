import { defineStore } from "pinia";

const useInvoiceRecord = defineStore("invoiceRecord", {
  state: () => ({
    company: {
      companyName: "Apple Inc",
      address1: "",
      address2: "",
      country: "United State",
      phone: "",
      zip: "",
      city: "",
    },
    customer: {
      firstName: {
        value: "john doe",
        setDefault: true,
      },
      lastName: "",
      email: "",
      language: "English",
      country: "United State",
      city: "",
      zip: "",
      phone: "",
      address1: "",
      address2: "",
    },
    invoice: {
      invoiceNumber: "",
      status: {
        value: "Draft",
        setDefault: false,
      },
      dateIssue: null,
      dueDate: null,
      items: [
        {
          item: "hand Bag",
          qty: 25,
          rate: 2.0,
          amount: 0,
        },
        {
          item: "hand Bag 2",
          qty: 250,
          rate: 5.0,
          amount: 0,
        },
      ],
      optional: {
        customField: false,
        memo: true,
        footer: false,
      },
      form: [
        {
          description: "",
          qty: 0,
          rate: 0,
          amount: 0,
        },
      ],
      notes: "",
      terms: "",
    },
  }),
  getters: {
    getCompany: (state) => state.company,
    getCustomer: (state) => state.customer,
    getInvoice: (state) => {
      const dollarFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });

      const item = {
        ...state.invoice,
        items: state.invoice.items.map((item) => {
          return {
            ...item,
            rate: dollarFormat.format(item.rate),
            amount: {
              label: dollarFormat.format(item.qty * item.rate),
              totalPrice: item.qty * item.rate,
            },
          };
        }),
        totalPrice: {
          label: "",
          value: 0,
        },
      };

      const totalPrice = item.items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.amount.totalPrice,
        0
      );

      item.totalPrice = {
        label: dollarFormat.format(totalPrice),
        value: totalPrice,
      };

      return item;
    },
  },
});

export default useInvoiceRecord;
