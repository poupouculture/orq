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
      ],
      notes: "",
      terms: "",
      customField: false,
      memo: true,
      footer: false,
    },
  }),
  getters: {
    getCompany: (state) => state.company,
    getCustomer: (state) => state.customer,
    getInvoice: (state) => {
      const dollarFormat = () => {
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        return formatter;
      };

      const obj = {
        ...state.invoice,
        items: state.invoice.items.map((item) => {
          return {
            ...item,
            rate: dollarFormat().format(item.rate),
            amount: dollarFormat().format(item.qty * item.rate),
          };
        }),
      };

      console.log(obj);

      return {
        ...state.invoice,
        items: state.invoice.items.map((item) => {
          return {
            ...item,
            rate: dollarFormat().format(item.rate),
            amount: dollarFormat().format(item.qty * item.rate),
          };
        }),
      };
    },
  },
});

export default useInvoiceRecord;
