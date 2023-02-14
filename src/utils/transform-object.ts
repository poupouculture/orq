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
/*
reason: because the API endpoint of Directus when updating the customer
        and the response is "You dont have permission"
        it because mistaken of updating the relation data in customer. eq: tags, customer_groups, companies.
        that's why we use this function for checking which data customer groups is ADDING or DELETING
return: update and insert payload of directus
reference: https://docs.directus.io/reference/introduction.html#relational-data
*/
export const transforCustomerGroupPayload = (
  oldValue: ICustomer,
  newValue: Option[]
) => {
  let customerGroupsData = [] as any;
  // When is update the data
  if (oldValue.id) {
    // Checking what's deleting from selected customer group before
    const deletedCustomerGroup = difference(
      oldValue.customer_groups.map((c: any) => c.customer_groups_id.id),
      newValue.map((c: any) => c.value)
    );
    // Checking what's inserting from selected customer group before
    const insertedCustomerGroup = difference(
      newValue.map((c: any) => c.value),
      oldValue.customer_groups.map((c: any) => c.customer_groups_id.id)
    );
    // this for payload to API enpoint.
    customerGroupsData = {
      create:
        (insertedCustomerGroup.length &&
          insertedCustomerGroup.map((group) => ({
            customer_id: oldValue.id,
            customer_groups_id: group,
          }))) ||
        [],
      delete:
        (deletedCustomerGroup.length &&
          oldValue.customer_groups
            .filter((cg: any) =>
              deletedCustomerGroup.includes(cg.customer_groups_id.id)
            )
            .map((data: any) => data.id)) ||
        [],
    };
    // when is create the data
  } else {
    // this is for create payload.
    customerGroupsData = {
      create: newValue.map((group: Option) => ({
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
