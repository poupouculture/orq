import {
  ICustomerGroupTransform,
  ICustomerTransform,
  IUserTransform,
} from "src/types/TransformObjectType";

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
