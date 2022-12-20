<template>
  <div class="login h-full flex no-warp select-none">
    <div class="background h-screen px-7 pt-11 w-1/3">
      <p class="flex no-wrap text-2xl items-center leading-none"><img class="w-12 mr-3" :src="logo" alt="logo">WABA</p>
    </div>

    <div class="flex-1 flex no-wrap bg-white">
      <section class="login-from mt-16 w-96 mx-auto">
        <h1 class="title text-center text-2xl font-semibold mb-10">Welcome To WABA</h1>

        <q-form @submit="submit">
          <label for="account" class="text-xs">Account</label>
          <q-input
            id="account" class="mb-3" dense type="Email" debounce="500" v-model.trim="login.email" outlined />

          <label for="password" class="text-xs">Password</label>
          <q-input
            id="password" class="mb-3" dense type="Password" debounce="500" v-model.trim="login.password" outlined />

          <div class="control flex no-wrap items-center justify-between mb-4">
            <label class="flex no-wrap items-center text-sm">
              <input class="mr-1 border-gray-300" type="checkbox" v-model="isChecked">
              <span class="mt-px">Remember me</span>
            </label>

            <a href="#">Forgot your password?</a>
          </div>

          <q-btn
            class="w-full h-9 font-normal rounded-md text-white bg-blue-700"
            :loading="loading" type="submit">Sign in</q-btn>
        </q-form>

        <footer class="mt-5">
          <div class="flex no-wrap justify-between items-center">
            <div class="border-b w-32 border-gray-300"></div>
            <span class="text-gray-500">Or continue with</span>
            <div class="border-b w-32 border-gray-300"></div>
          </div>

          <div class="mt-5 other-login flex no-wrap justify-between">
            <q-btn class="w-28 rounded-md text-gray-400" icon="fa-brands fa-facebook" outline />
            <q-btn class="w-28 rounded-md text-gray-400" icon="fa-brands fa-twitter" outline />
            <q-btn class="w-28 rounded-md text-gray-400" icon="fa-brands fa-github" outline />
          </div>

          <p class="mt-6 text-gray-400 text-sm">
            By logging, in, you agree to FIRST LINE's <a href="#">Terms af Service with privacy policy</a>
          </p>
        </footer>
      </section>
      <Message v-model="isShow" :message="message" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage'
}
</script>

<script setup>
import { ref } from 'vue'
import Message from 'src/components/Message.vue'
import useUserInfoStore from 'stores/modules/userInfo'
import logo from 'assets/images/logo.png'

const isChecked = ref(false),
  login = ref({ email: '', password: '' }),
  loading = ref(false),
  isShow = ref(false),
  message = ref(''),
  userInfo = useUserInfoStore()

const submit = e => {
  if (login.value.email && login.value.password) {
    loading.value = true
    userInfo.login(login.value)
      .catch(err => {
        isShow.value = true
        message.value = String(err)
      })
      .finally(() => {
        loading.value = false
      })
  }
}

</script>

<style lang="scss" scoped>
.background {
  background-color: #D5E2FF;
}
.login-from {

  :deep {
    .q-btn {
      text-transform: none;
    }

  }
}

a:link {
  color: #4F46E5;
}

a:visited {
  color: rgb(0, 0, 250);
}
</style>
