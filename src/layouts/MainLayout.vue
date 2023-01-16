<template>
  <q-layout view="hHh LpR fFf">
    <!-- hHh Lpr fFf -->
    <q-drawer width="250" show-if-above side="left" bordered>
      <!-- drawer content -->
      <div class="q-pa-md" style="background-color: #f5f5f5; height: 100%">
        <div
          class="bg-white cursor-pointer"
          style="border-radius: 50px; height: 40px"
        >
          <InputSelect :isBorder="true" :options="['Waiting', 'Processing']" />
        </div>
        <div
          class="bg-white q-mt-sm q-pa-sm q-pl-md row justify-between items-center cursor-pointer"
          style="border-radius: 50px"
        >
          <div
            class="text-body2 text-secondary"
            style="
              font-family: 'Archivo', sans-serif;
              font-weight: 500;
              font-size: 14px;
            "
          >
            Processing
          </div>
          <div
            style="
              width: 25px;
              height: 25px;
              border-radius: 50px;
              background-color: orange;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <div class="text-body2 text-white">3</div>
          </div>
        </div>
        <SingleUser
          name="Randy Savage"
          avatar-url="https://cdn.quasar.dev/img/avatar.png"
          time="00:34"
          :is-active="true"
        />
        <SingleUser
          name="Randy Savage"
          avatar-url="https://cdn.quasar.dev/img/avatar.png"
          time="00:34"
          :is-active="false"
        />
        <SingleUser
          name="Randy Savage"
          avatar-url="https://cdn.quasar.dev/img/avatar.png"
          time="00:34"
          :is-active="false"
        />
      </div>
    </q-drawer>

    <q-drawer width="350" show-if-above side="right" bordered>
      <!-- drawer content -->
      <ChatFeed />
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
      <div class="window-height q-pa-lg">
        <div
          style="border-top-left-radius: 30px; border-bottom-left-radius: 30px"
        >
          <div class="q-mb-md row items-end justify-end" style="gap: 10px">
            <button
              class="q-px-md q-py-sm bg-transparent cursor-pointer text-secondary no-outline"
              style="
                border: 2px solid #4b44f6;
                border-radius: 10px;
                font-family: 'Archivo', sans-serif;
                font-weight: 500;
                font-size: 14px;
              "
            >
              Redesign
            </button>
            <button
              class="bg-primary cursor-pointer text-white no-border no-outline shadow-1"
              style="
                border-radius: 10px;
                padding: 10px 20px;
                font-family: 'Archivo', sans-serif;
                font-weight: 500;
                font-size: 14px;
              "
            >
              Finshed
            </button>
          </div>
          <div
            class="text-h4 text-secondary"
            style="
              font-family: 'Archivo', sans-serif;
              font-size: 18px;
              font-weight: 500;
            "
          >
            LiveagentCustomer
          </div>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="start"
            narrow-indicator
            style="
              margin-top: 8px;
              margin-left: -15px;
              border-bottom: 1px solid #e2e2e9;
            "
          >
            <q-tab
              style="
                font-family: 'Archivo', sans-serif;
                font-weight: 500;
                text-transform: capitalize;
                font-size: 14px;
              "
              name="client"
              label="Client"
            />
            <q-tab
              style="
                font-family: 'Archivo', sans-serif;
                font-weight: 500;
                text-transform: capitalize;
                font-size: 14px;
              "
              name="services"
              label="Service Detail"
            />
            <q-tab
              style="
                font-family: 'Archivo', sans-serif;
                font-weight: 500;
                text-transform: capitalize;
                font-size: 14px;
              "
              name="recoards"
              label="Service Records"
            />
          </q-tabs>

          <q-tab-panels style="margin-left: -15px" v-model="tab" animated>
            <q-tab-panel name="client">
              <Client />
            </q-tab-panel>

            <q-tab-panel name="services">
              <div class="text-h6">Alarms</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="recoards">
              <div class="text-h6">Movies</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ChatFeed from "src/components/chat/ChatFeed.vue";
import InputSelect from "src/components/InputSelect.vue";
import SingleUser from "src/components/SingleUser.vue";
import Client from "src/components/tabs/Client.vue";
import { ref } from "vue";
const tab = ref("client");
</script>
