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
      <p class="text-h6 text-grey">No Chat Availables</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { storeToRefs } from "pinia";
import { ChatTypes } from "src/constants/ChatKeyword";
import ContactCard from "./ContactCard.vue";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import useContactStore from "src/stores/modules/contact";
import { IChat } from "src/types/MessagingTypes";

const props = defineProps({
  type: { type: String, default: ChatTypes.PENDING },
  filterText: { type: String, default: "" },
});

const messagingStore = useMessagingStore();
const customerStore = useCustomerStore();
const { getContactById } = useContactStore();
const leftDrawerOpen: any = inject("leftDrawerOpen");

const { chatsList } = storeToRefs(messagingStore);
const list = computed(() =>
  chatsList.value.filter((chat) => {
    console.log("chat:", chat);

    const chatName = chat?.customers_id
      ? chat?.customer_company_name_en?.toLowerCase()
      : "visitor".toLowerCase();

    return (
      chat.status === props.type &&
      (chatName?.includes(props.filterText) ||
        chat.name.includes(props.filterText))
    );
  })
);

const selectChat = (chat: IChat) => {
  if (window.innerWidth <= 1024) {
    leftDrawerOpen.value = false;
  }
  getContactById(chat.contacts_id);
  customerStore.$reset();
  messagingStore.onSelectChat(chat.id);
  messagingStore.fetchContactNumber(chat.contacts_id);
  if (chat.customers_id) {
    customerStore.fetchCustomer(chat.customers_id);
  }
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
