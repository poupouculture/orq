<template>
  <div class="main-container">
    <p class="header-text">
      <span class="text-gray-400">
        <q-icon name="fa-solid fa-arrow-left" />
        Application program /
      </span>
       Message Templates
    </p>
    <div class="w-full flex bg-[#fdfdfd] rounded-lg">
      <div class="w-2/3 flex flex-col p-6 border-r">
        <div class="label flex flex-col">
          <p class="text-xl">
            Languages
          </p>
          <p class="text-gray-400">
            select your message language
          </p>
        </div>

        <div class="w-2/12 mt-2 mb-4">
          <InputSelect
            :options="languageOptions"
            default="English"
            :value="language"
            @input="updateLanguage"
          />
        </div>

        <div class="label flex flex-col">
          <p class="text-xl">
            Header
          </p>
          <p class="text-gray-400">
            Add a title or choose which type of media you’ll use for this Header.
          </p>
        </div>

        <div class="flex mt-2 mb-4 gap-4">
          <div class="w-2/12">
            <InputSelect
              :options="headerOptions"
              :default="null"
              :value="header"
              @input="updateHeader"
            />
          </div>
          <input
            type="text"
            class="w-9/12 block border rounded-lg pl-4"
            v-if="header === 'Text'"
            v-model="headerMessage"
            />
        </div>

        <MediaChooser @updateMedia="updateMedia" v-if="header === 'Media'"/>

        <div class="label flex flex-col">
          <p class="text-xl">
            Body
          </p>
          <p class="text-gray-400">
            Enter the text for your message in the language you’ve selected.
          </p>
        </div>

        <div class="mt-2 mb-4">
          <textarea
            type="text"
            class="w-full block border rounded-lg p-4"
            rows="4"
            v-model="bodyMessage"
          ></textarea>
          <span class="text-gray-400">
            Characters: {{ bodyMessage.length }}/1024
          </span>
        </div>

        <div class="label flex flex-col">
          <p class="text-xl">
            Footer
          </p>
          <p class="text-gray-400">
            Add a short line of text to the button of you message template.
          </p>
        </div>

        <div class="mt-2 mb-4">
          <input
            type="text"
            class="w-full h-10 block border rounded-lg pl-4"
            v-model="footerMessage"
            />
        </div>

        <div class="label flex flex-col">
          <p class="text-xl">
            Button
          </p>
          <p class="text-gray-400">
            Create buttons that let customers respond to your message or take action
          </p>
        </div>

        <div class="w-3/12 mt-2 mb-4">
          <InputSelect
            :options="actionCategoryOptions"
            default="None"
            :value="actionCategory"
            @input="updateActionCategory"
          />
        </div>

        <div v-if="actionCategory === 'Call To Action'">
          <CallToAction @updateAction="updateAction" :index="0"/>

          <CallToAction @updateAction="updateAction" :index="1" class="mt-4"/>
        </div>

        <div class="w-6/12 flex flex-col gap-2" v-if="actionCategory === 'Quick Reply'">
          <ReplyAction
            :index="index"
            v-for="(replyText, index) of replies"
            :key="index"
            @updateReply="updateReply"
            @deleteReply="deleteReply"
            />

          <button
            class="w-9/12 flex border py-2 px-4 text-gray-500 items-center"
            @click="addReply">
            <q-icon name="fa fa-plus" class="mr-2"></q-icon>
            Add Another Button
          </button>
        </div>

        <div class="row justify-between mt-4">
          <button class="py-2 px-6 rounded text-primary border-2 border-dashed border-primary">
            Return
          </button>
          <button class="py-2 px-6 rounded bg-primary text-white">
            Save
          </button>
        </div>
      </div>
      <div class="w-1/3 p-6 flex flex-col">
        <span class="text-xl">Preview</span>
        <Preview
          :header="header"
          :headerMessage="headerMessage"
          :media="media"
          :bodyMessage="bodyMessage"
          :footerMessage="footerMessage"
          :actionCategory="actionCategory"
          :actions="actions"
          :replies="replies"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InputSelect from "../../components/InputSelect.vue";
import MediaChooser from "../../components/ApplicationProgram/MediaChooser.vue";
import CallToAction from "../../components/ApplicationProgram/CallToAction.vue";
import ReplyAction from "../../components/ApplicationProgram/ReplyAction.vue";
import Preview from "../../components/ApplicationProgram/Preview.vue";

const languageOptions = ["English", "Chineese"];
const language = ref('English');
const updateLanguage = value => {
  language.value = value;
}

const headerOptions = ["Text", "Media"];
const header = ref(null);
const updateHeader = value => {
  header.value = value;
}
const headerMessage = ref('');

const media = ref(null);
const updateMedia = value => {
  media.value = value;
}

const bodyMessage = ref('');

const footerMessage = ref('');

const actionCategoryOptions = ["None", "Call To Action", "Quick Reply"];
const actionCategory = ref("None");
const updateActionCategory = value => {
  actionCategory.value = value;
}

const actions = ref([
  {
    type: '',
    label: '',
    countryOrWebtype: '',
    value: ''
  },
  {
    type: '',
    label: '',
    countryOrWebtype: '',
    value: ''
  }
]);

const updateAction = value => {
  actions.value[value.index] = value;
}

const replies = ref(['', '']);

const addReply = () => {
  replies.value.push('');
}

const deleteReply = index => {
  replies.value = replies.value.filter((item, idx) => idx !== index);
}

const updateReply = value => {
  replies.value[value.index] = value.value;
}
</script>

<style scoped src="./style.scss" />
