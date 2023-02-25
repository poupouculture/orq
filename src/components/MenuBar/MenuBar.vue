<template>
  <div class="menu-holder">
    <q-icon
      name="menu"
      class="mr-auto text-[#9A9AAF] cursor-pointer md:hidden"
      @click="toggleDrawer()"
      size="sm"
    />
    <div class="flex gap-5 px-4">
      <img class="w-5 h-5 cursor-pointer" src="~assets/images/pluscomp.png" />
      <img class="w-5 h-5 cursor-pointer" src="~assets/images/messages.png" />
      <img
        class="w-[18px] h-5 cursor-pointer"
        src="~assets/images/notification.png"
      />
    </div>

    <q-btn unelevated :ripple="false" class="row items-center avatar-btn">
      <q-avatar size="md">
        <img src="~assets/images/profileavatar.png" />
      </q-avatar>
      <img src="~assets/images/dropdownreal.png" class="dropdown-img" />
      <q-menu class="q-ma-lg" style="width: 400px">
        <div class="column">
          <div class="row q-pa-md items-center">
            <div class="q-mr-md">
              <q-avatar size="md">
                <img src="~assets/images/profileavatar.png" />
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
                <q-item-section avatar>
                  <q-icon name="assignment" />
                </q-item-section>
                <q-item-section>Personal Information</q-item-section>
              </q-item>
              <q-item
                to="/privacy"
                active-class="primary"
                clickable
                v-close-popup
              >
                <q-item-section avatar>
                  <q-icon name="assignment" />
                </q-item-section>
                <q-item-section>Privacy</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="business" />
                </q-item-section>
                <q-item-section>About WABA</q-item-section>
              </q-item>
              <!-- <q-item clickable v-close-popup>
                <q-item-section>
                  <span>
                    <q-icon name="assignment" class="q-mr-sm" /> Personal
                    Information
                  </span>
                  </q-item-section
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
              </q-item> -->
              <q-separator />

              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" class="q-mr-sm" />
                </q-item-section>
                <q-item-section>Sign Out</q-item-section>
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

// Computed
const user = computed(() => userInfo.getUserProfile);
const drawer = computed({
  set: (value) => emits("update:modelValue", value),
  get: () => props.modelValue,
});

// Methods
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
