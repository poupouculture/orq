<template>
  <div class="login h-screen flex no-warp select-none">
    <div
      class="hidden md:!flex md:flex-col gap-28 bg-[#d5e2ff] h-screen px-7 pt-11 w-1/3"
    >
      <div class="flex items-center">
        <img class="w-[80px] mr-3" :src="logo" alt="logo" />
        <p class="font-[800] font-inter text-3xl">ChaQ</p>
      </div>
      <div class="flex justify-center">
        <img :src="loginIllustration" alt="" />
      </div>
    </div>

    <div class="flex-1 flex no-wrap bg-white">
      <section
        class="login-from flex flex-col justify-center w-full sm:w-96 max-w-sm mx-auto px-4 sm:px-0"
      >
        <h1
          class="title text-[#111827] font-[800] font-inter text-center text-3xl mb-10"
        >
          Welcome Back
        </h1>

        <q-form @submit="submit">
          <label for="account" class="text-xs">Account</label>
          <q-input
            id="account"
            class="mb-3"
            dense
            label="Input Your Email"
            type="Email"
            debounce="500"
            v-model.trim="login.email"
            outlined
          />

          <label for="password" class="text-xs">Password</label>
          <q-input
            id="password"
            class="mb-5"
            dense
            label="Input Your Password"
            :type="hidePassword ? 'Password' : 'text'"
            debounce="500"
            v-model.trim="login.password"
            outlined
          >
            <template v-slot:append>
              <q-icon
                :name="hidePassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="hidePassword = !hidePassword"
              />
            </template>
          </q-input>

          <!-- <div class="control flex no-wrap items-center justify-between">
            <div>
              <q-checkbox v-model="remember" label="Remember Me" />
            </div>

            <a href="#">Forgot your password?</a>
          </div>

          <div class="py-4 flex items-center gap-1">
            <p class="text-sm">No Account ?</p>
            <RouterLink to="/" class="text-primary"> Create one! </RouterLink>
          </div> -->

          <q-btn
            class="w-full h-9 font-normal rounded-md text-white bg-blue-700"
            :loading="loading"
            type="submit"
          >
            Sign in
          </q-btn>
        </q-form>

        <!-- <div class="flex flex-col items-center justify-center mt-10">
          <span class="text-gray-400 text-xl"> or </span>

          <div class="mt-5">
            <LoginFb />
          </div>
        </div> -->

        <footer class="mt-5">
          <p class="mt-6 text-gray-400 text-sm">
            By logging, in, you agree to {{ `${orq}'s` }}
            <!-- <a href="https://synque.io/terms-condition.html" target="_blank">
              Terms of Use
            </a> -->
            <a :href="`${orqTerms}`" target="_blank"> Terms of Use </a>
          </p>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useUserInfoStore from "stores/modules/userInfo";
import logo from "assets/images/logo.svg";
import loginIllustration from "assets/images/login_illustration.svg";
// import LoginFb from "./LoginFb.vue";

const userInfo = useUserInfoStore();

const login = ref({ email: "", password: "" });
const loading = ref(false);
const hidePassword = ref(true);
const orq = process.env.ORQ ? process.env.ORQ : "Synque";
const orqTerms = process.env.ORQ
  ? "/terms"
  : "https://synque.io/terms-condition.html";

const submit = () => {
  if (login.value.email && login.value.password) {
    loading.value = true;
    userInfo.login(login.value).finally(() => {
      loading.value = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.login-from {
  :deep {
    .q-btn {
      text-transform: none;
    }
  }
}

a:link {
  color: #4f46e5;
}

a:visited {
  color: rgb(0, 0, 250);
}
</style>
