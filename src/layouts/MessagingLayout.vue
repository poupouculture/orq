<template>
  <div style="background: white">
    <q-layout view="lHh Lpr lFf">
      <Drawer />
      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
      <ChatMessages />
    </q-layout>
  </div>
</template>

<script setup>
import Drawer from "src/components/Messaging/ContactList.vue";
import ChatMessages from "src/components/Messaging/ChatMessages.vue";
</script>
