<template>
  <div v-if="getSelectedChat.id" class="flex justify-start gap-3 pb-3">
    <q-btn
      outline
      color="primary"
      label="Add User"
      icon-right="expand_more"
      no-caps
      v-if="userRole === Role.CS_MANAGER"
    >
      <q-menu
        class="q-ma-lg"
        anchor="bottom left"
        self="top left"
        :offset="[0, 5]"
        style="width: 250px"
        fit
      >
        <q-list separator>
          <q-item-section class="px-4 pt-3">
            <q-input
              v-model="queryAddUser"
              :rules="[(val) => required(val)]"
              outlined
              :debounce="400"
              @update:model-value="searchUser('add-user')"
              lazy-rules
              dense
              placeholder="Search user ..."
            />
          </q-item-section>
          <q-item v-if="!usersAdd.length">
            <q-item-section>No user found.</q-item-section>
          </q-item>
          <template v-else>
            <q-item
              v-for="(user, index) in usersAdd"
              :key="index"
              clickable
              v-close-popup
              @click="assignUser(user, true)"
            >
              <q-item-section>
                <div class="flex flex-nowrap items-center">
                  <q-avatar size="md">
                    <img src="../../assets/images/profileavatar.png" />
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-weight-bold break-all">
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                    <div class="text-weight-light">
                      {{ user.role_name }}
                    </div>
                  </div>
                </div>
              </q-item-section>
              <q-separator />
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn>
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
        style="width: 250px"
        fit
      >
        <q-list separator>
          <q-item-section class="px-4 pt-3">
            <q-input
              v-model="query"
              :rules="[(val) => required(val)]"
              outlined
              :debounce="400"
              @update:model-value="searchUser"
              lazy-rules
              dense
              placeholder="Search user ..."
            />
          </q-item-section>
          <q-item v-if="!users.length">
            <q-item-section>No user found.</q-item-section>
          </q-item>
          <template v-else>
            <q-item
              v-for="(user, index) in users"
              :key="index"
              clickable
              v-close-popup
              @click="assignUser(user)"
            >
              <q-item-section>
                <div class="flex flex-nowrap items-center">
                  <q-avatar size="md">
                    <img src="../../assets/images/profileavatar.png" />
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-weight-bold break-all ellipsis-2-lines">
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                    <div class="text-weight-light">
                      {{ user.role_name }}
                    </div>
                  </div>
                </div>
              </q-item-section>
              <q-separator />
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn
      :loading="closeConversationLoading"
      color="primary"
      label="Close Conversation"
      no-caps
      @click="closeConversation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import useMessagingStore from "src/stores/modules/messaging";
import useUserInfoStore from "src/stores/modules/userInfo";
import { assignUser as assignUserAPI } from "src/api/user";
import { closeChat } from "src/api/messaging";
import { Dialog, Loading, Notify } from "quasar";
// import { ChatGroup, IChat } from "src/types/MessagingTypes";
// import { ChatTypes } from "src/constants/ChatKeyword";
import { required } from "src/utils/validation-rules";

const enum Role {
  CS = "CS",
  CS_MANAGER = "CS-Manager",
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role_name: string;
}

const messagingStore = useMessagingStore();
const userInfo = useUserInfoStore();

const query: Ref<string> = ref("");
const queryAddUser: Ref<string> = ref("");
const userRole: Ref<string> = ref("");
const usersData: Ref<Array<User>> = ref([]);
const users: Ref<Array<User>> = ref([]);
const usersAdd: Ref<Array<User>> = ref([]);
const { getSelectedChat, getUsers } = storeToRefs(messagingStore);

const searchUser = (type?: string) => {
  if (type !== "add-user") {
    users.value = usersData.value.filter((obj) => {
      const name = `${obj.first_name} ${obj.last_name}`.split(" ");
      return name.some((val) => val.includes(query.value));
    });
  } else {
    usersAdd.value = usersData.value.filter((obj) => {
      const name = `${obj.first_name} ${obj.last_name}`.split(" ");
      return name.some((val) => val.includes(queryAddUser.value));
    });
  }
};

// const getDirectionComponent = () => {
//   if (window.innerWidth < 500) {
//     return "flex-col";
//   }
//   return "";
// };
const sortData = (data: any) => {
  data.forEach((data: any) => {
    data.full_name = data.first_name + data.last_name;
  });
  return data.sort((a: any, b: any) => {
    return a.full_name.localeCompare(b.full_name);
  });
};
watch(getUsers, (val) => {
  const data = sortData(val);
  users.value = data;
  usersData.value = data;
  usersAdd.value = data;
  console.log("val", val);
});

onMounted(async () => {
  const data = sortData(getUsers.value);
  users.value = data;
  usersData.value = data;
  usersAdd.value = data;
  userRole.value = userInfo.getUserRoleName;
});

const assignUser = async (user: User, addMember: boolean = false) => {
  const chatId = getSelectedChat.value.id;
  const userId = user.id;

  try {
    const currentMembers = JSON.parse(getSelectedChat.value.members);
    console.log(currentMembers);
    const checkCurrentMember = currentMembers.find(
      (member: any) => member.id === userId
    );
    if (checkCurrentMember) {
      Notify.create({
        message: "User already exist",
        position: "top",
        type: "negative",
      });
      return;
    }
  } catch (error) {
    console.log("cannot get members");
  }

  try {
    Loading.show();
    const { data } = await assignUserAPI(chatId, userId, addMember);
    const members = data.map((item: any) => ({
      id: item.id,
      name: `${item.first_name} ${item.last_name}`,
    }));
    // update message members
    messagingStore.setMessageMembers(JSON.stringify(members));
    Notify.create({
      message: `Successful assigned to ${user.first_name} ${user.last_name}`,
      position: "top",
      type: "positive",
      color: "primary",
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
    message: "To start again, find the chat and press Take it",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const chatId = getSelectedChat.value.id;
    try {
      Loading.show();
      closeConversationLoading.value = true;
      closeChat(chatId);
      // Notify.create({
      //   message: "Conversation closed",
      //   type: "positive",
      //   position: "top",
      //   color: "primary",
      // });
      closeConversationLoading.value = false;
      // ???rido
      // messagingStore.setSelectedTab(ChatTypes.CLOSED);

      Loading.hide();
    } catch (error: any) {
      closeConversationLoading.value = false;
      // if the status: invalid chat id (no associated member)
      // It means chat is not available / deleted
      Loading.hide();
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
