<template>
  <div v-if="getSelectedChat.id" class="row justify-end q-gutter-sm pb-2">
    <q-btn
      outline
      color="primary"
      label="Reassign"
      icon-right="expand_more"
      no-caps
      v-if="userRole === Role.CS_MANAGER"
    >
      <q-menu
        class="q-ma-lg"
        anchor="bottom left"
        self="top left"
        :offset="[0, 5]"
        style="width: 300px"
        fit
      >
        <q-list separator>
          <q-item
            v-for="(manager, index) in managers"
            :key="index"
            clickable
            v-close-popup
            @click="assignUser(manager)"
          >
            <q-item-section>
              <div class="row items-center">
                <q-avatar size="md">
                  <!-- <img src="../../assets/images/profileavatar.png" /> -->
                </q-avatar>
                <div class="q-ml-md">
                  <div class="text-weight-bold">
                    {{ manager.first_name }} {{ manager.last_name }}
                  </div>
                  <div class="text-weight-light">
                    {{ manager.role_name }}
                  </div>
                </div>
              </div>
            </q-item-section>
            <q-separator />
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn
      :loading="closeConversationLoading"
      v-if="userRole === Role.CS_MANAGER"
      color="primary"
      label="Close Conversation"
      no-caps
      @click="closeConversation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import useMessagingStore from "src/stores/modules/messaging";
import { getChatUsers, assignUser as assignUserHelper } from "src/api/user";
import { closeChat } from "src/api/messaging";
import useUserInfoStore from "src/stores/modules/userInfo";
import { Dialog, Loading, Notify } from "quasar";
// import { ChatGroup, IChat } from "src/types/MessagingTypes";
import { ChatTypes } from "src/constants/ChatKeyword";

const enum Role {
  CS = "CS",
  CS_MANAGER = "CS-Manager",
}

interface Manager {
  user_id: string;
  first_name: string;
  last_name: string;
  role_name: string;
}

const messagingStore = useMessagingStore();
const userInfo = useUserInfoStore();
const userRole: Ref<string> = ref("");
const managers: Ref<Array<Manager>> = ref([]);
const { getSelectedChat } = storeToRefs(messagingStore);

onMounted(async () => {
  const { data } = await getChatUsers();
  managers.value = data;

  userRole.value = userInfo.getUserRoleName;
});

const assignUser = async (manager: Manager) => {
  const chatId = getSelectedChat.value.id;
  const userId = manager.user_id;
  try {
    Loading.show();
    await assignUserHelper(chatId, userId);
    Notify.create({
      message: `Successful assigned to ${manager.first_name} ${manager.last_name}`,
      position: "top",
      type: "positive",
      color: "blue-9",
    });
    Loading.hide();
  } catch (err: any) {
    Notify.create({
      message: err.response.data.message,
      position: "top",
      type: "negative",
    });
    Loading.hide();
  }
};

const closeConversationLoading = ref(false);
const closeConversation = async () => {
  Dialog.create({
    title: "Are you sure close this conversation?",
    message: "This action cannot be undone",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const chatId = getSelectedChat.value.id;
    try {
      closeConversationLoading.value = true;
      await closeChat(chatId);
      Notify.create({
        message: "Conversation closed",
        type: "positive",
        position: "top",
        color: "primary",
      });
      closeConversationLoading.value = false;
      messagingStore.setSelectedTab(ChatTypes.CLOSED);
    } catch (error: any) {
      closeConversationLoading.value = false;
      // if the status: invalid chat id (no associated member)
      // It means chat is not available / deleted
      Notify.create({
        message: error.response.data,
        type: "negative",
        position: "top",
      });
    }
  });
};
</script>

<style scoped>
.dropdown-img {
  margin-left: 10px;
  width: 10px;
  height: 6.5px;
  cursor: pointer;
}

.no-hover-btn:active,
.no-hover-btn:focus,
.no-hover-btn:hover {
  background-color: transparent !important;
  color: transparent;
}
</style>
