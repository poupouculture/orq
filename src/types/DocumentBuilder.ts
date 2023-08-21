export const enum DocumentTypes {
  INVOICE = "invoice",
  SALES_ORDER = "sales_order",
  PURCHASE_ORDER = "purchase_order",
}

export const enum DocumentLabels {
  INVOICE = "Invoice",
  SALES_ORDER = "Sales Order",
  PURCHASE_ORDER = "Purchase Order",
}

export const DocumentTypesCollection = [
  DocumentTypes.INVOICE,
  DocumentTypes.SALES_ORDER,
  DocumentTypes.PURCHASE_ORDER,
];

export const DocumentLabelsCollection = [
  DocumentLabels.INVOICE,
  DocumentLabels.SALES_ORDER,
  DocumentLabels.PURCHASE_ORDER,
];

export interface DocumentTemplateParams {
  type: string;
  limit: number;
  page: number;
  search: string;
}

export interface ActivedDocument {
  name: string;
  title: string;
  icon: string;
  active: string;
}

export interface DocumentTemplate {
  name: string;
  invoice_currency?: string;
  type: string;
  payment_methods?: string;
  fee_issued_to?: string;
  components: [];
}

export interface IDocumentTemplate {
  activedDocuments: ActivedDocument[];
  documentTemplates: DocumentTemplate[];
  documentTemplate: DocumentTemplate;
  meta: {
    total_count: number;
    filter_count: number;
  };
}
