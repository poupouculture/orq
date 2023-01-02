<template>
  <div class="menu-holder">
    <img src="../../assets/images/pluscomp.png" class="plus-img" />
    <img src="../../assets/images/messages.png" class="message-img" /><img
      src="../../assets/images/notification.png"
      class="notification-img"
    />
    <q-btn unelevated class="avatar-dropdown row items-center">
      <img src="../../assets/images/profileavatar.png" class="profile-img" />
      <img src="../../assets/images/dropdownreal.png" class="dropdown-img" />
      <q-menu>
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section>Personal Information</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup @click="logout">
            <q-item-section>Sign Out</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import "./MenuBar.scss";
import { useRouter } from "vue-router";
import { LocalStorage } from "quasar";
import useUserInfoStore from "stores/modules/userInfo";

const router = useRouter();
const userInfo = useUserInfoStore();

const logout = () => {
  LocalStorage.remove("userinfo");
  userInfo.setUserProfile(null);
  userInfo.setUserInfo({
    access_token: "",
    expires: null,
    refresh_token: "",
  });
  router.push("/login");
};
</script>
