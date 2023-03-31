import { defineStore } from "pinia";

const useInvoiceRecord = defineStore("invoiceRecord", {
  state: () => ({
    company: {
      companyName: "Apple Inc",
      address1: "Nyc 1",
      address2: "Nyc 2",
      country: "United State",
      phone: "Indonesia (+62)",
      zip: "12345",
      city: "NYC",
    },
    customer: {
      firstName: {
        value: "john",
        setDefault: true,
      },
      lastName: "Doe",
      email: "johndoe@mail.com",
      language: "English",
      country: "United State",
      city: "Nyc",
      zip: "1234",
      phone: "Indonesia (+62)",
      address1: "Ycn 1",
      address2: "Ycn 2",
    },
    invoice: {
      invoiceNumber: "INV-1322525",
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
          amount: {
            label: "",
            totalPrice: 0,
          },
        },
        {
          item: "hand Bag 2",
          qty: 250,
          rate: 5.0,
          amount: {
            label: "",
            totalPrice: 0,
          },
        },
      ],
      optional: {
        notes: "Please check your email",
        terms: "Over Due",
        customField: {
          active: false,
          fieldName: "new field",
          fieldValue: "Hello",
          setDefault: true,
          option: false,
        },
        memo: {
          active: false,
          memo: "this is memo",
          setDefault: false,
          option: false,
        },
        footer: {
          active: false,
          value: "this is memo",
          setDefault: false,
          option: false,
        },
      },
      form: [
        {
          description: "",
          qty: 0,
          rate: 0,
          amount: 0,
        },
      ],
      totalPrice: {
        label: "",
        value: 0,
      },
      tax: [
        {
          name: "GPT",
          value: 20,
        },
        // {
        //   name: "TAX",
        //   value: 40
        // }
      ],
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

      // const priceWithTax = ( price: number ) => {

      //   const totalTax = state.invoice.tax.reduce(
      //     (accumulator, currentValue) =>
      //       accumulator + currentValue.value,
      //     0
      //   );

      //   //TOTAL * ((100 + TAX PERCENTAGE) / 100)
      //   const priceAndTax = price * ((100 + totalTax) / 100)
      //   return {
      //     label: dollarFormat.format(priceAndTax) ,
      //     value:  priceAndTax
      //   }

      // }

      const formatItem: any[] = state.invoice.items.map((item) => {
        return {
          ...item,
          rate: dollarFormat.format(item.rate),
          amount: {
            label: dollarFormat.format(item.qty * item.rate),
            totalPrice: item.qty * item.rate,
          },
        };
      });

      state.invoice.items = formatItem;

      const totalPrice = state.invoice.items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.amount.totalPrice,
        0
      );

      // if ( state.invoice.tax.length > 0 ) {
      //   state.invoice.totalPrice = priceWithTax(totalPrice)
      // } else {
      //   state.invoice.totalPrice = {
      //     label: dollarFormat.format(totalPrice), // Dollar format
      //     value: totalPrice, // Number only
      //   };
      // }

      state.invoice.totalPrice = {
        label: dollarFormat.format(totalPrice), // Dollar format
        value: totalPrice, // Number only
      };

      return state.invoice;
    },
  },
  // actions: {
  //   taxProccess() {

  //   }
  // }
});

export default useInvoiceRecord;
