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
          <p class="text-xl">Name</p>
          <p class="text-gray-400">Type your template name</p>
        </div>

        <input
          type="text"
          class="w-full h-9 block border rounded-lg mt-2 mb-4 pl-4"
          v-model="name"
        />

        <div class="label flex flex-col">
          <p class="text-xl">Languages</p>
          <p class="text-gray-400">Select your message language</p>
        </div>

        <div class="w-2/12 mt-2 mb-4">
          <InputSelect
            :options="languageOptions"
            :default="language"
            :value="language"
            @input="updateLanguage"
            v-if="!loading"
          />
        </div>

        <div class="label flex flex-col">
          <p class="text-xl">Header</p>
          <p class="text-gray-400">
            Add a title or choose which type of media you’ll use for this
            Header.
          </p>
        </div>

        <div class="flex mt-2 mb-4 gap-4">
          <div class="w-2/12">
            <InputSelect
              :options="headerOptions"
              :default="header"
              :value="header"
              @input="updateHeader"
              v-if="!loading"
            />
          </div>
          <input
            type="text"
            class="w-9/12 block border rounded-lg pl-4"
            v-if="header === 'Text'"
            v-model="headerMessage"
          />
        </div>

        <MediaChooser @updateMedia="updateMedia" v-if="header === 'Media'" />

        <div class="label flex flex-col">
          <p class="text-xl">Body</p>
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
          <p class="text-xl">Footer</p>
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
          <p class="text-xl">Button</p>
          <p class="text-gray-400">
            Create buttons that let customers respond to your message or take
            action
          </p>
        </div>

        <div class="w-3/12 mt-2 mb-4">
          <InputSelect
            :options="actionCategoryOptions"
            :default="actionCategory"
            :value="actionCategory"
            @input="updateActionCategory"
            v-if="!loading"
          />
        </div>

        <div v-if="actionCategory === ac.CALL_TO_ACTION">
          <CallToAction
            @updateAction="updateAction"
            :index="0"
            :action="actions[0]"
            v-if="!loading"
          />

          <CallToAction
            @updateAction="updateAction"
            :index="1"
            :action="actions[1]"
            class="mt-4"
            v-if="!loading"
          />
        </div>

        <div
          class="w-6/12 flex flex-col gap-2"
          v-if="actionCategory === ac.QUICK_REPLY && !loading"
        >
          <ReplyAction
            :index="index"
            v-for="(replyText, index) of replies"
            :key="index"
            :replyText="replyText"
            @updateReply="updateReply"
            @deleteReply="deleteReply"
          />

          <button
            class="w-9/12 flex border py-2 px-4 text-gray-500 items-center"
            @click="addReply"
          >
            <q-icon name="fa fa-plus" class="mr-2"></q-icon>
            Add Another Button
          </button>
        </div>

        <div class="row justify-between mt-4">
          <router-link
            :to="`/application-programs/message-templates`"
            style="text-decoration: none; color: inherit"
          >
            <p
              class="py-2 px-6 rounded text-primary border-2 border-dashed border-primary"
            >
              Return
            </p>
          </router-link>
          <button
            class="py-2 px-6 rounded bg-primary text-white"
            @click="submitGeneralInformation"
          >
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
          :replies="replies"
          v-if="!loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import InputSelect from "../../components/InputSelect.vue";
import MediaChooser from "../../components/ApplicationProgram/MediaChooser.vue";
import CallToAction from "../../components/ApplicationProgram/CallToAction.vue";
import ReplyAction from "../../components/ApplicationProgram/ReplyAction.vue";
import Preview from "../../components/ApplicationProgram/Preview.vue";
import useUserInfoStore from "stores/modules/userInfo";
import {
  actionCategory as ac,
  actionType as at,
  formattedActionType as fat,
} from "../../constants/messageTemplate.js";

const userInfo = useUserInfoStore();
const emit = defineEmits(["submitGeneralInformation"]);

const props = defineProps({
  applicationProgram: {
    type: Object,
    required: false,
  },
});

const name = ref(null);
const languageOptions = ["English", "Chineese"];
const headerOptions = ["Text", "Media"];
const actionCategoryOptions = [ac.NONE, ac.CALL_TO_ACTION, ac.QUICK_REPLY];
const actions = ref(Array(2).fill(null));

const language = ref("English");
const header = ref(null);
const headerMessage = ref("");
const media = ref(null);
const bodyMessage = ref("");
const footerMessage = ref("");
const actionCategory = ref("None");
const replies = ref(["", ""]);
const status = ref("Draft");
const delivered = ref(0);
const read = ref(0);
const replied = ref(0);
const loading = ref(true);

onMounted(() => {
  if (props?.applicationProgram) {
    const tempData = props.applicationProgram.data.data;
    const headerComponent = tempData?.components?.find(
      (c) => c.type === "HEADER"
    );
    const bodyComponent = tempData?.components?.find((c) => c.type === "BODY");
    const footerComponent = tempData?.components?.find(
      (c) => c.type === "FOOTER"
    );
    const buttonsComponent = tempData?.components?.find(
      (c) => c.type === "BUTTONS"
    );

    name.value = tempData.name;
    language.value =
      tempData.language === "en_US" ? "English" : tempData.language;

    header.value = headerComponent?.format;
    if (header.value.toUpperCase() === "TEXT") {
      headerMessage.value = headerComponent?.text;
    } else {
      media.value = headerComponent?.text;
    }

    bodyMessage.value =
      bodyComponent?.text === undefined ? "" : bodyComponent?.text;
    footerMessage.value = footerComponent?.text;

    updateActionCategory(buttonsComponent?.value?.category);

    if (
      actionCategory.value !== ac.NONE &&
      actionCategory.value !== undefined
    ) {
      const buttons = buttonsComponent?.buttons;

      if (buttons !== undefined && buttons !== "") {
        if (actionCategory.value === ac.CALL_TO_ACTION) {
          actions.value =
            buttons === null
              ? Array(2).fill(null)
              : buttons.map(function (btn) {
                  const formatted = {};
                  if (btn.type === fat.CALL_PHONE) {
                    formatted.type = at.CALL_PHONE;
                    if (formatted.phone_number?.indexOf(" ")) {
                      formatted.value = btn.phone_number;
                    } else {
                      const arrPhone = formatted.phone_number?.spllit(" ");
                      formatted.countryOrWebtype = arrPhone[0];
                      formatted.value = arrPhone[1];
                    }
                  } else {
                    formatted.type = at.VIEW_WEB;
                    formatted.countryOrWebtype = "Static";
                    formatted.value = btn.url;
                  }
                  formatted.label = btn.text;

                  return formatted;
                });
        } else {
          replies.value =
            buttons === null ? [] : buttons?.map((btn) => btn.text);
        }
      }
    }

    status.value = tempData.status;
    delivered.value = tempData.messages_sent;
    read.value = tempData.messages_opened;
    replied.value = tempData.top_block_reason;
  }

  loading.value = false;
});

const updateLanguage = (value) => {
  language.value = value;
};

const updateHeader = (value) => {
  header.value = value;
};

const updateMedia = (value) => {
  media.value = value;
};

const updateActionCategory = (value) => {
  actionCategory.value = value;
};

const updateAction = (value) => {
  actions.value[value.index] = value;
};

const addReply = () => {
  replies.value.push("");
};

const deleteReply = (index) => {
  replies.value = replies.value.filter((item, idx) => idx !== index);
};

const updateReply = (value) => {
  replies.value[value.index] = value.value;
};

const submitGeneralInformation = () => {
  let buttonValues = "";
  if (actionCategory.value !== ac.NONE) {
    if (actionCategory.value === ac.CALL_TO_ACTION) {
      console.log(actions.value);
      buttonValues = actions.value?.map(function (btn) {
        const formatted = {};
        if (btn.type === at.CALL_PHONE) {
          formatted.type = fat.CALL_PHONE;
          formatted.phone_number = btn.countryOrWebtype + " " + btn.value;
        } else {
          formatted.type = fat.VIEW_WEB;
          formatted.url = btn.value;
        }
        formatted.text = btn.label;
        return formatted;
      });
    } else {
      buttonValues = replies.value?.map(function (text) {
        return { type: "REPLY", text };
      });
    }
  }

  emit("submitGeneralInformation", {
    name: name.value,
    language: language.value,
    status: status.value,
    components: [
      {
        type: "HEADER",
        format: header.value.toUpperCase(),
        text: header.value === "Text" ? headerMessage.value : media.value,
      },
      {
        type: "BODY",
        text: bodyMessage.value,
      },
      {
        type: "FOOTER",
        text: footerMessage.value,
      },
      {
        type: "BUTTONS",
        value: {
          category: actionCategory.value,
          buttons: buttonValues,
        },
      },
    ],
    messages_sent: delivered.value,
    messages_opened: read.value,
    top_block_reason: replied.value,
    created_by: userInfo.userProfile.id,
  });
};
</script>
