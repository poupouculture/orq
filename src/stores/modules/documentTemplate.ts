import { defineStore } from "pinia";

import {
  activateDocumentTemplate,
  addDocumentTemplate,
  getActivedDocument,
  getDocumentTemplate,
  getDocumentTemplates,
  updateDocumentTemplate,
} from "src/api/documentTemplate";
import { Loading, Notify } from "quasar";
import {
  DocumentLabels,
  DocumentTemplate,
  DocumentTemplateParams,
  DocumentTypes,
  DocumentTypesCollection,
  IDocumentTemplate,
} from "src/types/DocumentBuilder";

import InvoiceIcon from "src/assets/icons/invoice-icon.svg";
import SalesIcon from "src/assets/icons/sales-icon.svg";
import PurchaseIcon from "src/assets/icons/purchase-icon.svg";

const useDocumentTemplateStore = defineStore("documentTemplate", {
  state: () =>
    ({
      activedDocuments: [
        {
          name: DocumentTypes.INVOICE,
          title: DocumentLabels.INVOICE,
          icon: InvoiceIcon,
          active: "",
        },
        {
          name: DocumentTypes.SALES_ORDER,
          title: DocumentLabels.SALES_ORDER,
          icon: SalesIcon,
          active: "",
        },
        {
          name: DocumentTypes.PURCHASE_ORDER,
          title: DocumentLabels.PURCHASE_ORDER,
          icon: PurchaseIcon,
          active: "",
        },
      ],
      documentTemplates: [],
      documentTemplate: null,
      meta: {
        total_count: 0,
        filter_count: 0,
      },
    } as IDocumentTemplate),

  getters: {},
  actions: {
    async getActivedDocuments() {
      try {
        DocumentTypesCollection.forEach(async (documentType) => {
          const {
            data: { data },
            status,
          } = await getActivedDocument(documentType);
          if (status !== 200) {
            Notify.create({
              message: "Something Wrong",
              type: "negative",
              position: "top",
            });
          } else {
            if (data.length > 0) {
              const index = this.activedDocuments.findIndex(
                (ad) => ad.name === documentType
              );

              this.activedDocuments[index].active = data[0].id;
            }
          }
        });
      } catch (error) {
        Notify.create({
          message: "Something Wrong",
          type: "negative",
          position: "top",
        });
      }
    },
    async getAllDocumentTemplates(params: DocumentTemplateParams) {
      try {
        const data = await getDocumentTemplates(params);
        if (data.data?.errors) {
          Notify.create({
            message: "Failed: " + data.data.errors[0].message,
            type: "negative",
          });
          return null;
        }

        this.documentTemplates = data.data.data;
        this.meta = data.data.meta;

        return data;
      } catch (err: any) {
        Notify.create({
          message: `Error: ${
            err.response.data?.errors[0]?.message || "Fail to saved"
          }`,
          position: "top",
          type: "negative",
        });
        return null;
      }
    },
    async getDocumentTemplateById(id: string) {
      try {
        const data = await getDocumentTemplate(id);
        if (data.data?.errors) {
          Notify.create({
            message: "Failed: " + data.data.errors[0].message,
            type: "negative",
          });
          return null;
        }

        this.documentTemplate = data.data.data;
        return data;
      } catch (err: any) {
        Notify.create({
          message: `Error: ${
            err.response.data?.errors[0]?.message || "Fail to saved"
          }`,
          position: "top",
          type: "negative",
        });
        return null;
      }
    },
    async addDocumentTemplate(payload: DocumentTemplate) {
      Loading.show();
      try {
        const data = await addDocumentTemplate(payload);
        if (data.data?.errors) {
          Notify.create({
            message: "Failed: " + data.data.errors[0].message,
            type: "negative",
          });
          return null;
        } else {
          Notify.create({
            message: "Document Template has been saved",
            color: "primary",
            type: "positive",
            position: "top",
          });
        }
        Loading.hide();
        return data;
      } catch (err: any) {
        Notify.create({
          message: `Error: ${
            err.response.data?.errors[0]?.message || "Fail to saved"
          }`,
          position: "top",
          type: "negative",
        });
        Loading.hide();
        return null;
      }
    },
    async updateDocumentTemplate(
      id: string,
      payload: DocumentTemplate,
      isArchiving: boolean = false
    ) {
      Loading.show();
      try {
        const data = await updateDocumentTemplate(id, payload);
        if (data.data?.errors) {
          Notify.create({
            message: "Failed: " + data.data.errors[0].message,
            type: "negative",
          });
          return null;
        } else {
          if (isArchiving) {
            Notify.create({
              message: `Selected Template has been archived`,
              position: "top",
              type: "positive",
              color: "blue-9",
            });
          } else {
            Notify.create({
              message: "Document Template has been updated",
              color: "primary",
              type: "positive",
              position: "top",
            });
          }
        }
        Loading.hide();
        return data;
      } catch (err: any) {
        Notify.create({
          message: `Error: ${
            err.response.data?.errors[0]?.message || "Fail to saved"
          }`,
          position: "top",
          type: "negative",
        });
        Loading.hide();
        return null;
      }
    },
    async activateDocumentTemplate(id: string, type: string) {
      Loading.show();
      try {
        const data = await activateDocumentTemplate(id, type);
        if (data.data?.errors) {
          Notify.create({
            message: "Failed: " + data.data.errors[0].message,
            type: "negative",
          });
          return null;
        } else {
          Notify.create({
            message: "Document Template has been activated",
            color: "primary",
            type: "positive",
            position: "top",
          });
        }
        Loading.hide();
        return data;
      } catch (err: any) {
        Notify.create({
          message: `Error: ${
            err.response.data?.errors[0]?.message || "Fail to saved"
          }`,
          position: "top",
          type: "negative",
        });
        Loading.hide();
        return null;
      }
    },
  },
});

export default useDocumentTemplateStore;
