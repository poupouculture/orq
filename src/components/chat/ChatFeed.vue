<template>
  <div
    class="bg-positive q-px-md relative-position"
    style="
      border-left: 2px solid #e2e2e9;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
    "
  >
    <div class="row q-mt-md items-center">
      <div class="col-1 q-mr-md">
        <q-avatar size="36px">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
      </div>
      <div class="col-10">
        <div
          class="text-h6 text-secondary"
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 16px;
          "
        >
          Ricky Alex
        </div>
        <div
          class="text-body2 text-accent"
          style="
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 12px;
            margin-top: -5px;
          "
        >
          livechat
        </div>
      </div>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column">
      <!-- Chat Colum Me -->
      <ChatMessageDisplay message="hello" :is-me="true" />
      <!-- Chat COlum Other User -->
      <ChatMessageDisplay
        message="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        :is-me="false"
      />
      <!-- Chat Colum Me -->
      <ChatMessageDisplay message="hello" :is-me="true" />
      <!-- Chat COlum Other User -->
      <ChatMessageDisplay
        message="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        :is-me="false"
      />
    </div>

    <div style="position: fixed; bottom: 20px; left: 0; width: 100%">
      <!-- textinput for write message -->
      <div class="q-pa-md" style="width: 100%">
        <textarea
          class="q-pa-md bg-negative no-border"
          style="
            border-radius: 15px;
            width: 100%;
            font-family: 'Archivo', sans-serif;
            font-weight: 500;
            font-size: 14px;
          "
          name=""
          id=""
          cols="30"
          rows="4"
          placeholder="Enter reply information"
          v-modal="message"
        ></textarea>
      </div>
      <div class="row justify-between items-center" style="width: 100%">
        <div class="col">
          <q-toggle v-model="checkBox" />
        </div>
        <div class="row">
          <div class="row items-center">
            <label class="q-mr-sm cursor-pointer">
              <q-icon
                name="fa-solid fa-microphone"
                style="color: gray"
                size="xs"
              />
            </label>
            <label class="cursor-pointer">
              <q-icon name="fa-solid fa-image" style="color: gray" size="xs" />
              <input
                type="file"
                name="upload-image"
                accept="image/*"
                style="width: 0px; height: 0px"
                multiple
              />
            </label>
            <label class="q-ml-sm cursor-pointer">
              <q-icon
                name="fa-regular fa-face-smile"
                style="color: gray"
                size="xs"
              />
            </label>
            <label class="q-ml-sm cursor-pointer">
              <q-icon
                name="fa-solid fa-paperclip"
                style="color: gray"
                size="xs"
              />
              <input
                type="file"
                name="upload-image"
                style="width: 0px; height: 0px"
                multiple
              />
            </label>
          </div>
          <button
            class="q-px-md q-py-sm bg-primary text-white no-border no-outline cursor-pointer q-ml-md"
            style="
              border-radius: 10px;
              font-family: 'Archivo', sans-serif;
              font-weight: 500;
              font-size: 14px;
            "
          >
            Send out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChatMessageDisplay from "./ChatMessageDisplay.vue";
const message = ref("");
const checkBox = ref(null);
</script>
