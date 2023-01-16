<template>
  <q-drawer
    side="right"
    show-if-above
    bordered
    :width="300"
    :breakpoint="500"
    class="bg-white q-pa-md"
  >
    <q-scroll-area style="height: 100%">
      <div class="row items-center">
        <q-avatar class="rounded-avatar">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-h6">Visitor</div>
          <div class="text-grey-5">livechat 01</div>
        </div>
      </div>
      <div class="q-mt-lg">
        <q-chat-message
          :text="['hey, how are you?']"
          bg-color="primary"
          text-color="white"
          sent
        />
        <q-chat-message :text="['doing fine, how r you?']" bg-color="grey-3" />
      </div>
    </q-scroll-area>
    <q-layout>
      <q-page-container>
        <q-page padding>
          <q-page-sticky position="bottom">
            <q-input
              v-model="message"
              dense
              borderless
              bg-color="grey-2"
              type="textarea"
              width="100%"
            />
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-drawer>
</template>

<script setup>
import { ref } from "vue";

const message = ref("");
</script>

<style scoped lang="scss">
.rounded-avatar {
  border-radius: 50% !important;
}
</style>
