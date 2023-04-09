import { defineStore } from "pinia";
import { getCompanies } from "src/api/companies";

const dollarFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const useInvoiceRecord = defineStore("invoiceRecord", {
  state: () => ({
    allCompanies: [],
    selectedCustomers: [],
    company: {
      companyName: "",
      address1: "",
      address2: "",
      country: "",
      phone: "",
      zip: "",
      city: "",
      show: false,
    },
    customer: {
      firstName: {
        value: "",
        setDefault: false,
      },
      lastName: "",
      email: "",
      language: "English",
      country: "",
      city: "",
      zip: "",
      phone: "",
      address1: "",
      address2: "",
      show: false,
    },
    invoice: {
      invoiceNumber: "INV-1322525",
      dateIssue: null,
      dueDate: null,
      discount: [],
      discountOptions: [
        {
          name: "Discount",
          value: 20,
        },
      ],
      status: {
        value: "Draft",
        setDefault: false,
      },
      items: [],
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
      tax: [
        {
          name: "TAX",
          value: 40,
        },
      ],
      taxOptions: [
        // It gonnna be options
        {
          name: "GPT",
          value: 20,
        },
        {
          name: "TAX",
          value: 40,
        },
      ],
      totalPrice: {
        label: "",
        value: 0,
      },
    },
  }),
  getters: {
    getCompany: (state) => {
      return {
        ...state.company,
        companyName: state.company.name_english,
      };
    },
    getCustomer: (state) => state.customer,
    getSelectedCustomers: (state) => {
      return state.selectedCustomers.map((item) => {
        return {
          ...item,
          fullName: `${item.first_name} ${item.last_name}`,
        };
      });
    },
    getDiscount: (state) => {
      if (state.invoice.discount.length === 0) return 0;

      const totalPrice = state.invoice.items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.amount.totalPrice,
        0
      );

      const discountInformation = state.invoice.discount.map((item) => {
        return {
          ...item,
          discountName: item.name,
          percentage: item.value,
          discountPrice: {
            label: dollarFormat.format((totalPrice / 100) * item.value),
            value: (totalPrice / 100) * item.value,
          },
        };
      });

      return discountInformation;
    },
    getTax: (state) => {
      // var tax = (PRICE / 100) * TAX PRECENTAGE
      if (state.invoice.tax.length === 0) return 0;

      const totalPrice = state.invoice.items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.amount.totalPrice,
        0
      );

      const taxInformation = state.invoice.tax.map((item) => {
        return {
          ...item,
          taxName: item.name,
          percentage: item.value,
          taxPrice: {
            label: dollarFormat.format((totalPrice / 100) * item.value),
            value: (totalPrice / 100) * item.value,
          },
        };
      });

      return taxInformation;
    },
    getTotalPrice: (state) => {
      let taxPercentage = 0;

      let discountPercentage = 0;

      if (state.invoice.tax.length > 0) {
        taxPercentage = state.invoice.tax.reduce(
          (accumulator, currentValue) => accumulator + currentValue.value,
          0
        );
      }

      if (state.invoice.discount.length > 0) {
        discountPercentage = state.invoice.discount.reduce(
          (accumulator, currentValue) => accumulator + currentValue.value,
          0
        );
      }

      const totalPrice = state.invoice.items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.amount.totalPrice,
        0
      );

      const priceWithTax = (taxPercentage / 100) * totalPrice + totalPrice;

      const discountPrice = (discountPercentage / 100) * totalPrice;

      const subtotal = priceWithTax - discountPrice;

      return {
        label: dollarFormat.format(subtotal),
        value: subtotal,
      };
    },
    getCompanies: (state) => state.allCompanies,
    getInvoice: (state) => {
      const formatItem = state.invoice.items.map((item) => {
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

      state.invoice.totalPrice = {
        label: dollarFormat.format(totalPrice), // Dollar format
        value: totalPrice, // Number only
      };

      return state.invoice;
    },
  },
  actions: {
    addTax(tax) {
      const newTax = {
        name: tax.name,
        value: parseInt(tax.value),
      };

      this.$state.invoice.tax.push(newTax);
    },

    addDiscount(discount) {
      this.$state.invoice.discount.push({
        name: "Discount",
        value: discount,
      });
    },
    editDiscount(discount) {
      this.$state.invoice.discount[0].value = discount;
    },
    deleteDiscount() {
      this.$state.invoice.discount = [];
    },
    deleteTax(index) {
      this.$state.invoice.tax.splice(index, 1);
    },
    editTax(index, newTax) {
      this.$state.invoice.tax[index].name = newTax.name;
      this.$state.invoice.tax[index].value = newTax.value;
    },
    addItems() {
      this.$state.invoice.items.push({
        item: "Helo",
        qty: 250,
        rate: 5.0,
        amount: {
          label: "",
          totalPrice: 0,
        },
      });
    },
    deleteItems(index) {
      this.$state.invoice.items.splice(index, 1);
    },
    editItems(index, item) {
      this.$state.invoice.items[index].item = item.item;
      this.$state.invoice.items[index].qty = item.qty;
      this.$state.invoice.items[index].rate = item.rate;
      this.$state.invoice.items[index].amount.totalPrice =
        item.amount.totalPrice;
    },

    selectedCustomer(customer) {
      this.$state.customer = {
        ...customer,
        firstName: {
          value: customer.first_name,
          setDefault: false,
        },
        show: true,
      };
    },

    selectedCompany(company) {
      this.$state.company = company;
      this.$state.company.show = true;
      this.$state.selectedCustomers = company.customers.map(
        (item) => item.customers_id
      );
    },

    async init() {
      await getCompanies().then((res) => {
        const { data } = res.data;

        this.$state.allCompanies = data;
      });
    },
  },
});

export default useInvoiceRecord;
