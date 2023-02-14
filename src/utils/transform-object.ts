import { difference } from "src/helpers";
import { ICustomer } from "src/types/CustomerTypes";
import {
  ICustomerGroupTransform,
  ICustomerTransform,
  IUserTransform,
} from "src/types/TransformObjectType";
interface Option {
  value: string | number;
  label: string;
}

export const transformCompaniesPayload = (
  customer: ICustomer,
  selectedOptions: Option[]
) => {
  let companiesData = [] as any;
  // When is update the data
  if (customer.id) {
    // Checking what's deleting from selected company before
    const deletedCompanies = difference(
      customer.companies.map((c: any) => c.companies_id.id),
      selectedOptions.map((c: any) => c.value)
    );
    // Checking what's inserting from selected company before
    const insertedCompanies = difference(
      selectedOptions.map((c: any) => c.value),
      customer.companies.map((c: any) => c.companies_id.id)
    );
    // this for payload to API enpoint.
    companiesData = {
      create:
        (insertedCompanies.length &&
          insertedCompanies.map((group) => ({
            customer_id: customer.id,
            companies_id: group,
          }))) ||
        [],
      delete:
        (deletedCompanies.length &&
          customer.companies
            .filter((company: any) =>
              deletedCompanies.includes(company.companies_id.id)
            )
            .map((data: any) => data.id)) ||
        [],
    };
    // when is create the data
  } else {
    // this is for create payload.
    companiesData = {
      create: selectedOptions.map((group: Option) => ({
        customer_id: "+",
        companies_id: group.value,
      })),
    };
  }
  return companiesData;
};

export const transformTagPayload = (
  customer: ICustomer,
  selectedOptions: Option[]
) => {
  let tagData = [] as any;
  // When is update the data
  if (customer.id) {
    // Checking what's deleting from selected tag before
    const deletedTags = difference(
      customer.tags.map((c: any) => c.tags_id.id),
      selectedOptions.map((c: any) => c.value)
    );
    // Checking what's inserting from selected tag before
    const insertedTags = difference(
      selectedOptions.map((c: any) => c.value),
      customer.tags.map((c: any) => c.tags_id.id)
    );
    // this for payload to API enpoint.
    tagData = {
      create:
        (insertedTags.length &&
          insertedTags.map((tag) => ({
            customer_id: customer.id,
            tags_id: tag,
          }))) ||
        [],
      delete:
        (deletedTags.length &&
          customer.tags
            .filter((cg: any) => deletedTags.includes(cg.tags_id.id))
            .map((data: any) => data.id)) ||
        [],
    };
    // when is create the data
  } else {
    // this is for create payload.
    tagData = {
      create: selectedOptions.map((data: Option) => ({
        customer_id: "+",
        tags_id: data.value,
      })),
    };
  }
  return tagData;
};

/*
reason: because the API endpoint of Directus when updating the customer
        and the response is "You dont have permission"
        it because mistaken of updating the relation data in customer. eq: tags, customer_groups, companies.
        that's why we use this function for checking which data customer groups is ADDING or DELETING
return: update and insert payload of directus
reference: https://docs.directus.io/reference/introduction.html#relational-data
*/
export const transforCustomerGroupPayload = (
  customer: ICustomer,
  selectedOptions: Option[]
) => {
  let customerGroupsData = [] as any;
  // When is update the data
  if (customer.id) {
    // Checking what's deleting from selected customer group before
    const deletedCustomerGroups = difference(
      customer.customer_groups.map((c: any) => c.customer_groups_id.id),
      selectedOptions.map((c: any) => c.value)
    );
    // Checking what's inserting from selected customer group before
    const insertedCustomerGroups = difference(
      selectedOptions.map((c: any) => c.value),
      customer.customer_groups.map((c: any) => c.customer_groups_id.id)
    );
    // this for payload to API enpoint.
    customerGroupsData = {
      create:
        (insertedCustomerGroups.length &&
          insertedCustomerGroups.map((group) => ({
            customer_id: customer.id,
            customer_groups_id: group,
          }))) ||
        [],
      delete:
        (deletedCustomerGroups.length &&
          customer.customer_groups
            .filter((cg: any) =>
              deletedCustomerGroups.includes(cg.customer_groups_id.id)
            )
            .map((data: any) => data.id)) ||
        [],
    };
    // when is create the data
  } else {
    // this is for create payload.
    customerGroupsData = {
      create: selectedOptions.map((group: Option) => ({
        customer_id: "+",
        customer_groups_id: group.value,
      })),
    };
  }
  return customerGroupsData;
};

export const customerGroupCreate = ({
  id = "+",
  customerGroups,
}: ICustomerGroupTransform) => {
  return customerGroups.map((customerGroup) => {
    return {
      user_groups_id: id,
      customer_groups_id: customerGroup,
    };
  });
};

export const customerCreate = ({ id = "+", customers }: ICustomerTransform) => {
  return customers.map((customer) => {
    return {
      customer_groups_id: id,
      customers_id: customer,
    };
  });
};

export const userCreate = ({ id = "+", users }: IUserTransform) => {
  return users.map((user) => {
    return {
      user_groups_id: id,
      directus_users_id: user,
    };
  });
};
