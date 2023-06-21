<template>
  <div>
    <TransitionGroup name="fade">
      <q-item
        v-for="item in list"
        :key="item.id"
        class="cursor-pointer q-px-none"
        @click.passive="() => selectChat(item)"
      >
        <ContactCard :data="item" />
      </q-item>
    </TransitionGroup>
    <div
      v-show="!list.length"
      class="flex justify-center items-center gap-2 flex-col"
    >
      <q-icon size="4rem" name="inbox" color="grey" />
      <p class="text-h6 text-grey">No Chats Available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { storeToRefs } from "pinia";
import { ChatTypes } from "src/constants/ChatKeyword";
import { getContactByChatId } from "src/api/messaging";
import ContactCard from "./ContactCard.vue";
import useMessagingStore from "src/stores/modules/messaging";
import { cancelGetCustomerRequest } from "src/api/customers";
import useCustomerStore from "src/stores/modules/customer";
import useContactStore from "src/stores/modules/contact";
import { IChat } from "src/types/MessagingTypes";

const props = defineProps({
  type: { type: String, default: ChatTypes.PENDING },
  filterText: { type: String, default: "" },
});
const customerStore = useCustomerStore();
const { getContactById } = useContactStore();
const contactStore = useContactStore();
const { getCurrentCustomerId } = storeToRefs(contactStore);
const leftDrawerOpen: any = inject("leftDrawerOpen");

const messagingStore = useMessagingStore();
const { chatsList } = storeToRefs(messagingStore);
const list = computed(() =>
  chatsList.value.filter((chat) => {
    const customerName = chat?.customers_id
      ? chat?.customer_company_name_en?.toLowerCase()
      : "visitor".toLowerCase();
    const contactFirstName = chat?.contact_first_name?.toLocaleLowerCase();
    return (
      chat.status === props.type &&
      (customerName?.includes(props.filterText) ||
        chat.name?.includes(props.filterText) ||
        contactFirstName?.includes(props.filterText))
      // || chat.members?.includes(props.filterText))
    );
  })
);

const selectChat = async (chat: IChat) => {
  // Handle multiple request
  cancelGetCustomerRequest();
  if (window.innerWidth <= 1024) {
    leftDrawerOpen.value = false;
  }

  messagingStore.onSelectChat(chat.id);
  console.log("SELECT CHAT");
  console.log(chat);
  if (!chat.contacts_id) {
    console.log(" fnc: selectChat- no contact_id");
    const contact = await getContactByChatId(chat.id);
    chat.contacts_id = contact.contacts_id;
  }
  // const contact = await messagingStore.fetchContactNumber(chat.contacts_id); // redundant call.
  customerStore.$reset();
  contactStore.$reset();
  let contact = null;
  if (chat.customers_id) {
    const customer = await customerStore.fetchCustomer(chat.customers_id);
    contact = customer.contacts[0].contacts_id;
    useContactStore().setContact(contact);
    console.log("getCurrentCustomerId:...", getCurrentCustomerId.value);
    contactStore.setCurrentCustomerId(customer.id);
  } else {
    customerStore.setCustomer(null);
    contact = await getContactById(chat);
    console.log("  GET contact:....", contact);
  }
  // contactStore.setContact(contact);
  messagingStore.setContactNumber(contact.number);
};
</script>

<style lang="scss" scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
.fade-leave-active {
  position: absolute;
}
</style>
