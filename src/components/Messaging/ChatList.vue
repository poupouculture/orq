<template>
  <q-drawer :modelValue="true" class="bg-grey-2" show-if-above bordered>
    <q-list>
      <q-item-label header>
        <q-input placeholder="Search Items..." outlined dense>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon name="reorder" @click="text = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </q-item-label>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-mt-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        no-caps
      >
        <q-tab name="ongoing" label="Ongoing 6" />
        <q-tab name="waiting" label="Waiting 1" />
        <q-tab name="closed" label="Closed 0" />
      </q-tabs>
      <q-separator size="2px" style="margin-top: -2px" inset />
      <q-tab-panels v-model="tab" animated class="q-mt-md transparent">
        <q-tab-panel name="ongoing"> test </q-tab-panel>
        <q-tab-panel name="waiting" class="q-gutter-y-sm">
          <div v-for="(chat, index) in chatList" :key="index">
            <ContactCard
              :active="index === activeChat"
              :name="chat?.customer_name ? chat.customer_name : 'Visitor'"
              :message="chat.last_message_text"
              :time="dateFormat(chat.last_message_date)"
              :totalUnread="0"
              class="contact-card"
              @click="selectChat(index)"
            />
          </div>
        </q-tab-panel>
        <q-tab-panel name="closed"> test</q-tab-panel>
      </q-tab-panels>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref } from "vue";
import { format } from "date-fns";
import ContactCard from "./ContactCard.vue";

defineProps({
  chatList: {
    type: Object,
    default: () => {},
  },
});

const activeChat = ref(0);
const tab = ref("waiting");

const dateFormat = (date) => {
  return format(new Date(date), "hh:mm aa");
};

const selectChat = (index) => {
  activeChat.value = index;
};
</script>

<style scoped>
.contact-card:hover {
  cursor: pointer;
}
</style>
