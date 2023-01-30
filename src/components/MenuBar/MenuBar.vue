<template>
  <div class="menu-holder">
    <q-icon
      name="menu"
      class="mr-auto text-[#9A9AAF] cursor-pointer md:hidden"
      @click="toggleDrawer()"
      size="sm"
    />
    <img src="../../assets/images/pluscomp.png" class="plus-img" />
    <img src="../../assets/images/messages.png" class="message-img" /><img
      src="../../assets/images/notification.png"
      class="notification-img"
    />
    <q-btn unelevated class="row items-center avatar-btn">
      <q-avatar size="md">
        <img src="../../assets/images/profileavatar.png" />
      </q-avatar>
      <img src="../../assets/images/dropdownreal.png" class="dropdown-img" />
      <q-menu class="q-ma-lg" style="width: 400px">
        <div class="column">
          <div class="row q-pa-md items-center">
            <div class="q-mr-md">
              <q-avatar size="md">
                <img src="../../assets/images/profileavatar.png" />
              </q-avatar>
            </div>
            <div>
              <div class="text-h6">
                {{ user?.first_name }} {{ user?.last_name }}
              </div>
              <div class="text-h7">
                {{ user?.role.name }}
              </div>
            </div>
          </div>
          <q-separator />
          <div>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section
                  ><span
                    ><q-icon name="assignment" class="q-mr-sm" /> Personal
                    Information</span
                  ></q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section
                  ><span
                    ><q-icon name="assignment" class="q-mr-sm" /> Privacy</span
                  ></q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section
                  ><span
                    ><q-icon name="business" class="q-mr-sm" /> About WABA</span
                  ></q-item-section
                >
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section
                  ><span
                    ><q-icon name="logout" class="q-mr-sm" @click="logout" />
                    Sign Out</span
                  ></q-item-section
                >
              </q-item>
            </q-list>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import "./MenuBar.scss";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { LocalStorage } from "quasar";
import useUserInfoStore from "stores/modules/userInfo";

const props = defineProps({
  modelValue: Boolean,
});
const emits = defineEmits(["update:modelValue"]);
const router = useRouter();
const userInfo = useUserInfoStore();
const user = computed(() => userInfo.getUserProfile);
const drawer = computed({
  set: (value) => emits("update:modelValue", value),
  get: () => props.modelValue,
});
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

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
