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
              outlined
              autofocus
              :debounce="400"
              :loading="searchLoading"
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
              outlined
              autofocus
              :debounce="400"
              :loading="searchLoading"
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
// import { required } from "src/utils/validation-rules";
import { Role } from "src/constants/Role";
import { User } from "src/types/MessagingTypes";

const messagingStore = useMessagingStore();
const userInfo = useUserInfoStore();

const query: Ref<string> = ref("");
const queryAddUser: Ref<string> = ref("");
const userRole: Ref<string> = ref("");
const usersData: Ref<Array<User>> = ref([]);
const users: Ref<Array<User>> = ref([]);
const usersAdd: Ref<Array<User>> = ref([]);
const searchLoading: Ref<boolean> = ref(false);
const { getSelectedChat, allUsers, getUsers } = storeToRefs(messagingStore);

const searchUser = (type?: string | number | null) => {
  searchLoading.value = true;
  setTimeout(() => {
    if (type !== "add-user") {
      users.value = usersData.value.filter((obj) => {
        const name = `${obj.first_name} ${obj.last_name}`.split(" ");
        return name.some((val) =>
          val.toLowerCase().includes(query.value.toLowerCase())
        );
      });
    } else {
      usersAdd.value = usersData.value.filter((obj) => {
        const name = `${obj.first_name} ${obj.last_name}`.split(" ");
        return name.some((val) =>
          val.toLowerCase().includes(queryAddUser.value.toLowerCase())
        );
      });
    }
    searchLoading.value = false;
  }, 300);
};

// const getDirectionComponent = () => {
//   if (window.innerWidth < 500) {
//     return "flex-col";
//   }
//   return "";
// };
const sortData = (data: User[]) => {
  data.forEach((data: User) => {
    data.full_name = data.first_name + data.last_name;
  });
  return data
    .filter((item: User) => item.role_name !== Role.CS_MANAGER)
    .sort((a: User, b: User) => {
      return a.full_name.localeCompare(b.full_name);
    });
};
watch(allUsers, (val) => {
  const data = sortData(val);
  users.value = data;
  usersData.value = data;
  usersAdd.value = data;
  console.log("val", val);
});

onMounted(async () => {
  const data = sortData(allUsers.value);
  users.value = data;
  usersData.value = data;
  usersAdd.value = data;
  userRole.value = userInfo.getUserRoleName;
});

const assignUser = async (user: User, addMember: boolean = false) => {
  const chatId = getSelectedChat.value.id;
  const userId = user.user_id;

  try {
    // const currentMembers = JSON.parse(getSelectedChat.value.members);
    // console.log(currentMembers);
    const checkCurrentMember = getUsers.value.find(
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
    await assignUserAPI(chatId, userId, addMember);
    // update message members
    messagingStore.setMessageMembers(user);
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
