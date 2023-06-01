<template>
  <q-form>
    <div class="main-container">
      <p class="header-text text-2xl">
        <router-link
          :to="`/application-programs/${
            props.formType === 'bots'
              ? 'chatbots'
              : props.formType === 'customer-service'
              ? 'customer-services'
              : 'message-templates'
          }`"
          style="text-decoration: none; color: inherit"
        >
          <span class="text-gray-400 cursor-pointer">
            <q-icon name="fa-solid fa-arrow-left" />
            Application programs /
          </span>
        </router-link>
        {{
          props.formType === "bots"
            ? "Chatbots"
            : props.formType === "customer-service"
            ? "Customer Service"
            : "Message Templates"
        }}
      </p>
      <div class="w-full flex bg-[#fdfdfd] rounded-lg">
        <div class="w-2/3 flex flex-col p-6 border-r">
          <div class="label flex flex-col">
            <p class="text-xl">Name</p>
            <p class="text-gray-400">Type your template name</p>
          </div>

          <input
            type="text"
            class="w-full h-9 block border rounded-lg mt-2 pl-4"
            :class="{
              'mb-2': isShowDuplicateName,
              'mb-4': !isShowDuplicateName,
            }"
            v-model="name"
            @keypress="checkName"
            @change="checkDuplication"
          />

          <div class="w-full text-red-400 mb-4" v-if="isShowDuplicateName">
            Name is not valid because it's already used
          </div>

          <div class="label flex flex-col">
            <p class="text-xl">Category</p>
          </div>

          <div class="w-full md:4/12 lg:w-3/12 mt-2 mb-4">
            <InputSelect
              :options="categories"
              :default="selectedCategory"
              :value="selectedCategory"
              @input="updateSelectedCategory"
              v-if="!loading"
            />
          </div>

          <div class="label flex flex-col">
            <p class="text-xl">Is Email</p>
            <p class="text-gray-400">Is this email template</p>
          </div>

          <div class="w-full md:w-4/12 lg:w-3/12 mt-2 mb-4">
            <InputSelect
              :options="isEmailOptions"
              :default="isEmail"
              :value="isEmail"
              @input="updateIsEmail"
              v-if="!loading"
            />
          </div>

          <div class="label flex flex-col">
            <p class="text-xl">Is Email</p>
            <p class="text-gray-400">Is this email template</p>
          </div>

          <div class="w-full md:w-4/12 lg:w-3/12 mt-2 mb-4">
            <InputSelect
              :options="isEmailOptions"
              :default="isEmail"
              :value="isEmail"
              @input="updateIsEmail"
              v-if="!loading"
            />
          </div>

          <div class="label flex flex-col">
            <p class="text-xl">Languages</p>
            <p class="text-gray-400">Select your message language</p>
          </div>

          <div class="w-full md:w-8/12 lg:w-6/12 mt-2 mb-4">
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
            <div class="w-full md:w-4/12 lg:w-3/12">
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
              class="w-8/12 block border rounded-lg pl-4"
              v-if="header === 'TEXT'"
              v-model="headerMessage"
            />
          </div>

          <MediaChooser
            @updateMedia="updateMedia"
            :media="media"
            v-if="header === 'MEDIA'"
          />

          <div class="label flex flex-col">
            <p class="text-xl">Body</p>
            <p class="text-gray-400">
              Enter the text for your message in the language you’ve selected.
            </p>
          </div>

          <div
            class="mt-2"
            :class="{
              'mb-2': customVariables.length > 0,
              'mb-4': customVariables.length < 1,
            }"
          >
            <textarea
              type="text"
              class="w-full block border rounded-lg p-4"
              rows="4"
              v-model="bodyMessage"
              @change="bodyMessageChange"
            ></textarea>
            <span class="text-gray-400">
              Characters: {{ bodyMessage.length }}/1024
            </span>
          </div>

          <div
            class="w-full flex flex-col mb-2"
            v-if="customVariables.length > 0"
          >
            <div class="text-gray-400">Example:</div>
            <div
              class="w-full"
              v-for="(example, index) of customVariables"
              :key="index"
            >
              <input
                type="text"
                class="w-full h-10 block border rounded-lg pl-4 mb-2"
                v-model="customVariables[index]"
                :placeholder="`example for variable {{${index + 1}}}`"
              />
            </div>
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
            <p class="text-xl">Approved</p>
            <p class="text-gray-400">Is this template approved</p>
          </div>

          <div class="mt-2 mb-4">
            <input
              type="text"
              class="w-full md:w-4/12 lg:w-3/12 h-10 block border rounded-lg pl-4"
              :value="isApproved"
              disabled
            />
          </div>

          <div class="label flex flex-col">
            <p class="text-xl">Button</p>
            <p class="text-gray-400">
              Create buttons that let customers respond to your message or take
              action
            </p>
          </div>

          <div class="w-full md:4/12 lg:w-3/12 mt-2 mb-4">
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
            <div
              class="row q-gutter-xl btn-cls cursor-pointer"
              @click="showReturnDialog = true"
            >
              <p
                class="py-2 px-6 rounded text-primary border-2 border-dashed border-primary"
              >
                Return
              </p>
            </div>
            <button
              class="py-2 px-6 rounded bg-primary text-white"
              @click="submitGeneralInformation"
              v-if="!isShowDuplicateName"
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
  </q-form>
  <ReturnDialog
    v-model="showReturnDialog"
    @cancel="showReturnDialog = false"
    @submit="discardChanges()"
  />
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
import { codes, names } from "../../constants/languages.js";
import {
  checkDuplicationTemplate,
  checkDuplicateWaba,
} from "src/api/messageTemplate";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import { useRouter } from "vue-router";

const userInfo = useUserInfoStore();
const emit = defineEmits(["submitGeneralInformation"]);

const props = defineProps({
  applicationProgram: {
    type: Object,
    required: false,
  },
  formType: {
    type: String,
    required: false,
    default: () => "message",
  },
});

const name = ref(null);
const languageCodes = codes;
const languageOptions = names;
const isEmailOptions = ["Yes", "No"];
const headerOptions = ["TEXT", "MEDIA"];
const actionCategoryOptions = [ac.NONE, ac.CALL_TO_ACTION, ac.QUICK_REPLY];
const categories = [
  "Marketing",
  "Transactional",
  "Issue Resolution",
  "Utility",
];
const actions = ref(Array(2).fill(null));
const isShowDuplicateName = ref(false);
const showReturnDialog = ref(false);
const router = useRouter();

const isEmail = ref("No");
const language = ref("English (United States)");
const header = ref(null);
const headerMessage = ref("");
const media = ref(null);
const bodyMessage = ref("");
const customVariables = ref([]);
const footerMessage = ref("");
const isApproved = ref("No");
const actionCategory = ref("None");
const selectedCategory = ref("None");
const replies = ref(["", ""]);
const status = ref("Draft");
const delivered = ref(0);
const read = ref(0);
const replied = ref(0);
const loading = ref(true);

onMounted(async () => {
  if (props?.applicationProgram) {
    const tempData = props.applicationProgram.data.data;
    console.log(tempData);
    if (tempData?.json?.components) {
      tempData.components = tempData?.json?.components;
    }

    selectedCategory.value =
      tempData?.category.charAt(0).toUpperCase() +
      tempData?.category.slice(1).toLowerCase();

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
    isEmail.value = tempData.is_email_template ? "Yes" : "No";
    language.value = languageCodes.includes(tempData.language)
      ? languageOptions[languageCodes.indexOf(tempData.language)]
      : tempData.language;

    const medias = ["VIDEO", "IMAGE", "DOCUMENT"];
    if (medias.includes(headerComponent?.format)) {
      updateHeader("MEDIA");
      media.value = headerComponent?.format;
    } else {
      updateHeader("TEXT");
      headerMessage.value = headerComponent?.text;
    }

    bodyMessage.value =
      bodyComponent?.text === undefined ? "" : bodyComponent?.text;

    bodyMessageChange();

    if (bodyComponent?.example?.body_text) {
      customVariables.value = bodyComponent?.example?.body_text[0];
    }

    footerMessage.value = footerComponent?.text;
    isApproved.value = tempData.is_approved ? "Yes" : "No";

    if (buttonsComponent?.buttons) {
      const firstButton = buttonsComponent.buttons[0];

      updateActionCategory(
        firstButton.type === fat.CALL_PHONE || firstButton.type === fat.VIEW_WEB
          ? ac.CALL_TO_ACTION
          : ac.QUICK_REPLY
      );
    } else {
      updateActionCategory("None");
    }

    if (
      actionCategory.value !== ac.NONE &&
      actionCategory.value !== undefined
    ) {
      const buttons = buttonsComponent;

      if (buttons !== undefined && buttons !== "") {
        if (actionCategory.value === ac.CALL_TO_ACTION) {
          if (buttons === null) {
            actions.value = Array(2).fill(null);
          } else {
            actions.value = buttons?.buttons?.map((btn) => {
              const formatted = {};
              if (btn.type === fat.CALL_PHONE) {
                formatted.type = at.CALL_PHONE;
                if (btn.phone_number?.indexOf(" ")) {
                  const arrPhone = btn.phone_number.split(" ");
                  formatted.country = arrPhone[0];
                  formatted.value = arrPhone[1];
                } else {
                  formatted.value = btn.phone_number;
                }
              } else {
                formatted.type = at.VIEW_WEB;
                formatted.country = "Static";
                formatted.value = btn.url;
              }
              formatted.label = btn.text;

              return formatted;
            });
          }
        } else {
          console.log(buttons.buttons);
          console.log(typeof buttons === "object");

          replies.value =
            buttons === null
              ? []
              : typeof buttons === "object"
              ? buttons.buttons?.map((btn) => btn.text)
              : buttons?.map((btn) => btn.text);
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

const discardChanges = async () => {
  showReturnDialog.value = false;
  const routeDetail =
    props.formType === "bots"
      ? "chatbots"
      : props.formType === "customer-service"
      ? "customer-services"
      : "message-templates";
  await router.replace("/application-programs/" + routeDetail);
  location.reload();
};

const updateIsEmail = (value) => {
  isEmail.value = value;
};

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

const updateSelectedCategory = (value) => {
  selectedCategory.value = value;
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

const checkName = (event) => {
  const keyCode = event.keyCode;
  if (
    (keyCode === 32 ||
      keyCode === 96 ||
      (keyCode >= 33 && keyCode <= 47) ||
      (keyCode >= 58 && keyCode <= 94)) &
    (props.formType !== "bots" && props.formType !== "customer-service")
  ) {
    event.preventDefault();
    return false;
  }
};

const checkDuplication = async () => {
  const responseFB = await checkDuplicationTemplate(name.value);
  const responseWaba = await checkDuplicateWaba(name.value);
  isShowDuplicateName.value =
    responseFB.data.status !== 200 || responseWaba.data?.data?.length > 0;
};

const listNumbers = (str) => {
  const regex = /{{\s*([\d]+)\s*}}/g;
  let match;
  const numbers = [];
  while ((match = regex.exec(str)) !== null) {
    numbers.push("{{" + Number(match[1]) + "}}");
  }
  return numbers;
};

const bodyMessageChange = () => {
  if (props.formType !== "bots" && props.formType !== "customer-services") {
    const customVariableCounted = listNumbers(bodyMessage.value);
    customVariables.value = Array(customVariableCounted.length).fill("");
  }
};

const submitGeneralInformation = () => {
  let buttonValues = {};
  if (actionCategory.value !== ac.NONE) {
    if (actionCategory.value === ac.CALL_TO_ACTION) {
      buttonValues = actions.value?.map(function (btn) {
        const formatted = {};
        if (btn.type === at.CALL_PHONE) {
          formatted.type = fat.CALL_PHONE;
          formatted.phone_number = btn.country.split(" ")[1] + " " + btn.value;
        } else {
          formatted.type = fat.VIEW_WEB;
          formatted.url = btn.value;
          formatted.example = [btn.value];
        }
        formatted.text = btn.label;

        return formatted;
      });
    } else {
      buttonValues = replies.value?.map(function (text) {
        return { type: "QUICK_REPLY", text };
      });
    }
  }

  const formattedValueForEmit = (type) => {
    if (type === "language") {
      console.log(languageOptions);
      return languageOptions.includes(language.value)
        ? languageCodes[languageOptions.indexOf(language.value)]
        : language.value;
    }
    if (type === "components") {
      const componentsFormatted = [
        {
          type: "FOOTER",
          text: footerMessage.value,
        },
      ];

      const headerComponent = {
        type: "HEADER",
        format:
          header.value.toUpperCase() === "TEXT"
            ? "TEXT"
            : media.value.toUpperCase(),
      };

      if (header.value.toUpperCase() === "TEXT") {
        headerComponent.text = headerMessage.value;
      } else {
        if (media.value.toUpperCase() === "VIDEO") {
          headerComponent.example = {
            header_handle: [
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            ],
          };
        }
        if (media.value.toUpperCase() === "IMAGE") {
          headerComponent.example = {
            header_handle: [
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            ],
          };
        }
        if (media.value.toUpperCase() === "DOCUMENT") {
          headerComponent.example = {
            header_handle: [
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            ],
          };
        }
      }

      componentsFormatted.push(headerComponent);

      const bodyComponent = {
        type: "BODY",
        text: bodyMessage.value,
      };

      if (customVariables.value.length > 0) {
        bodyComponent.example = { body_text: [customVariables.value] };
      }

      componentsFormatted.push(bodyComponent);

      if (actionCategory.value.toUpperCase() !== "NONE") {
        componentsFormatted.push({
          type: "BUTTONS",
          buttons: buttonValues,
        });
      }

      return componentsFormatted;
    }

    return "";
  };

  console.log({
    name: name.value.toLowerCase().replace(/\s+/g, ""),
    is_approved: false,
    category: selectedCategory.value.toUpperCase(),
    is_email_template: isEmail.value === "Yes",
    language: formattedValueForEmit("language"),
    status: status.value,
    components: formattedValueForEmit("components"),
    messages_sent: delivered.value,
    messages_opened: read.value,
    top_block_reason: replied.value,
    json: {
      name: name.value,
      category: "MARKETING",
      language: formattedValueForEmit("language"),
      components: formattedValueForEmit("components"),
    },
    created_by: userInfo.userProfile.id,
  });

  emit("submitGeneralInformation", {
    name: name.value.toLowerCase().replace(/\s+/g, ""),
    is_approved: false,
    category: selectedCategory.value.toUpperCase(),
    is_email_template: isEmail.value === "Yes",
    language: formattedValueForEmit("language"),
    status: status.value,
    components: formattedValueForEmit("components"),
    messages_sent: delivered.value,
    messages_opened: read.value,
    top_block_reason: replied.value,
    json: {
      name: name.value,
      category: "MARKETING",
      language: formattedValueForEmit("language"),
      components: formattedValueForEmit("components"),
    },
    created_by: userInfo.userProfile.id,
  });
};
</script>
