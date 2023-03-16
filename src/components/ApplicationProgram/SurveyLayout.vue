<template>
  <div class="main-container">
    <p class="header-text text-2xl">
      <router-link to="/application-programs/surveys">
        <span class="text-gray-400 cursor-pointer">
          <q-icon name="fa-solid fa-arrow-left" />
          Application program /
        </span>
      </router-link>
      Surveys
    </p>

    <div class="w-full flex bg-[#fdfdfd] rounded-lg">
      <div class="w-2/3 flex flex-col p-6 border-r">
        <div class="text-2xl mb-6">Collecting Customer Information</div>
        <div class="w-full flex flex-col border rounded-lg gap-3 p-4 shadow-md">
          <div
            class="w-full flex flex-col gap-2"
            v-for="(question, index) in questions"
            :key="index"
          >
            <div class="w-full flex justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 flex justify-center items-center bg-primary text-white rounded-full shadow-xl"
                >
                  {{ index + 1 }}
                </div>
                <div class="text-lg">
                  Question
                  <span class="text-sm text-gray-400">( Text )</span>
                </div>
              </div>
              <div class="flex items-center gap-4 text-gray-500">
                <q-icon name="fa-regular fa-face-smile" class="text-lg" />
                <q-icon name="fa-regular fa-copy" class="text-lg" />
                <q-icon name="fa-regular fa-edit" class="text-lg" />
                <q-icon
                  name="fa-solid fa-trash"
                  class="text-lg hover:cursor-pointer"
                  @click="deleteQuestion(index)"
                />
              </div>
            </div>
            <div class="w-full flex">
              <div class="w-full border rounded-lg mt-2">
                <input
                  type="text"
                  class="w-full h-9 block mb-4 pl-4"
                  v-model="questions[index].text"
                  placeholder="Type the question here"
                />
                <div
                  class="w-full flex justify-center py-3"
                  v-if="question.isEmoticon"
                >
                  <div class="w-1/3 flex flex-col gap-2">
                    <div class="w-full flex justify-between">
                      <img
                        src="../../assets/images/emoticon-angry.svg"
                        class="hover:cursor-pointer"
                        alt=""
                      />
                      <img
                        src="../../assets/images/emoticon-unhappy.svg"
                        class="hover:cursor-pointer"
                        alt=""
                      />
                      <img
                        src="../../assets/images/emoticon-flat.svg"
                        class="hover:cursor-pointer"
                        alt=""
                      />
                      <img
                        src="../../assets/images/emoticon-smile.svg"
                        class="hover:cursor-pointer"
                        alt=""
                      />
                      <img
                        src="../../assets/images/emoticon-love.svg"
                        class="hover:cursor-pointer"
                        alt=""
                      />
                    </div>
                    <div class="w-full flex justify-between">
                      <span class="text-xs">Not Satisfied</span>
                      <span class="text-xs">Very Satisfied</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex mt-6">
          <div
            class="flex items-center text-lg gap-2 hover:cursor-pointer"
            @click="addQuestion"
          >
            <div
              class="w-10 h-10 flex justify-center items-center bg-green-300 rounded-full shadow-xl"
            >
              <q-icon name="fa-solid fa-plus" />
            </div>
            Add Question
          </div>
        </div>
      </div>
      <div class="w-1/3 flex flex-col py-6">
        <div class="text-2xl text-center">Preview</div>
        <div class="w-full flex flex-col border rounded-xl shadow-xl py-3 my-6">
          <div
            class="w-full flex items-center justify-between px-3 border-b shadow-md"
          >
            <div class="flex gap-2 py-2">
              <div
                class="w-10 h-10 flex items-center justify-center rounded-full"
              >
                <img src="../../assets/images/bot-avatar.svg" alt="" />
              </div>
              <div class="flex flex-col">
                <div class="text-lg">Chatbot</div>
                <div class="text-sm text-green-400">
                  <q-icon name="fa-solid fa-circle" class="text-xs" />
                  Online
                </div>
              </div>
            </div>
            <div>
              <q-icon name="fa-solid fa-close" class="text-xl" />
            </div>
          </div>
          <div class="h-screen overflow-auto p-3">
            <ChatMessage
              v-for="item in messages"
              :key="item.id"
              :message="item"
            />
          </div>
        </div>
        <div class="w-full flex justify-center">
          <button class="px-4 py-2 bg-primary text-white rounded-md">
            Survey
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChatMessage from "../Messaging/ChatMessage.vue";

const questions = ref([
  {
    text: "What is your name?",
    isEmoticon: false,
  },
  {
    text: "Have you heard of our product/service before?",
    isEmoticon: false,
  },
  {
    text: "How satisfied were you with our product/service",
    isEmoticon: true,
  },
]);

const messages = ref([
  {
    id: 1,
    content: "Hi",
    direction: "outgoing",
    type: "text",
    date_created: 741231321,
  },
  {
    id: 1,
    content: "How I can help you?",
    direction: "outgoing",
    type: "text",
    date_created: 741231321,
  },
  {
    id: 1,
    content: "What is your name?",
    direction: "outgoing",
    type: "text",
    date_created: 741231321,
  },
  {
    id: 1,
    content: "Salim",
    direction: "incoming",
    type: "text",
    date_created: 741231321,
  },
  {
    id: 1,
    content: "Have you heard of our product/service before?",
    direction: "outgoing",
    type: "text",
    date_created: 741231321,
  },
  {
    id: 1,
    content: "Yes, I heard about you before",
    direction: "incoming",
    type: "text",
    date_created: 741231321,
  },
  {
    id: 1,
    content: "How satisfied were you with our product/service?",
    direction: "outgoing",
    type: "text",
    date_created: 741231321,
    isEmoticon: true,
  },
]);

const addQuestion = () => {
  questions.value.push("");
};

const deleteQuestion = (index) => {
  questions.value.splice(index, 1);
};
</script>
