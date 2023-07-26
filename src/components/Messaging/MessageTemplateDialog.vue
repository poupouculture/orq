<template>
  <q-dialog :modelValue="modelValue" @hide="hideModal">
    <q-card
      :style="
        'min-height: 85%; ' +
        (isPreview ? 'min-width: 55%;' : 'min-width: 85%;')
      "
      class="q-pa-lg flex justify-between"
      :class="{ 'flex-col': usedTemplate !== null }"
    >
      <div class="w-full flex flex-col">
        <div class="w-full flex justify-end">
          <q-icon name="close" class="cursor-pointer" @click="hide" />
        </div>
        <div class="w-full" v-if="usedTemplate === null">
          <q-card-section>
            <div class="text-h6">Choose Template</div>
            <div class="text-h7">All Templates</div>

            <div class="q-mt-lg" style="max-width: 250px">
              <SearchTableInput
                :loading="loading"
                @search="searchHandler"
                @reset="resetSearch"
              />
            </div>
          </q-card-section>

          <div class="w-11/12 mx-auto mt-10">
            <TableComponent
              :applicationPrograms="data.applicationPrograms"
              :totalCount="data.totalCount"
              :page="data.page"
              :rowsPerPage="data.rowsPerPage"
              :isSimple="true"
              v-model:selected="selectedTemplate"
              @useTemplate="useTemplate"
              @previewTemplate="previewTemplate"
              @changePage="changePage"
            />
          </div>

          <q-card-actions align="right"> </q-card-actions>
        </div>
        <div class="w-full flex" v-else>
          <div class="w-7/12 flex flex-col border-r pr-2" v-if="!isPreview">
            <p class="font-semibold">Add Content</p>
            <!-- <p class="mt-4">
              To help us understand what kind of message you want to send, you
              have the option to provide specific content examples for your
              template. You can add a sample template for one or all languages
              you are submitting.
            </p> -->
            <p class="mt-4">
              The Previewed Message on the right will be sent to the contact.
            </p>
            <!-- <p class="mt-4">
              Make sure not to include any actual user or customer information,
              and provide only sample content in your examples.
              <a href="#" class="text-primary"> Learn More </a>
            </p> -->
            <div
              class="w-4/12 flex flex-col"
              v-if="mediaHeader.includes(header.toUpperCase())"
            >
              <p class="mt-4 font-semibold">Header</p>
              <button
                class="mt-2 py-2 bg-primary text-white rounded-md"
                @click="uplader?.pickFiles"
              >
                Choose
                {{
                  header.toUpperCase() === "IMAGE"
                    ? "JPG or PNG"
                    : header.toUpperCase() === "VIDEO"
                    ? "MP4 or MOV"
                    : "PDF"
                }}
                file
                <q-uploader
                  ref="uplader"
                  :accept="
                    header.toUpperCase() === 'IMAGE'
                      ? '.gif, .jpg, .jpeg, .png, image/*'
                      : header.toUpperCase() === 'VIDEO'
                      ? '.mp4, .mov'
                      : '.pdf'
                  "
                  class="hidden invisible"
                  @added="upload"
                />
              </button>
            </div>
            <p class="mt-4 font-semibold">Body</p>
            <p class="text-gray-500 mt-2">
              {{ bodyMessage }}
            </p>
            <SlimInput
              type="text"
              v-for="(cusVar, index) of customVariables"
              v-model="customVariables[index]"
              :key="index"
              :placeholder="'Enter content for {{' + (index + 1) + '}}'"
              :rules="[(val) => val.length > 0 || 'This is required field.']"
              ref="textBoxRefs"
            />
          </div>
          <div
            class="p-6 flex flex-col"
            :class="{ 'w-8/12 m-auto': isPreview, 'w-1/3': !isPreview }"
          >
            <span class="text-xl text-center">
              Preview {{ isPreview ? "Message Template" : "" }}
            </span>
            <Preview
              :header="header"
              :headerMessage="headerMessage"
              :media="media"
              :bodyMessage="bodyMessage"
              :footerMessage="footerMessage"
              :actionCategory="actionCategory"
              :actions="actions"
              :replies="replies"
              :file-preview="filePreview"
              v-if="!loading"
            />
          </div>
        </div>
      </div>

      <div class="w-full flex items-end justify-end gap-2 px-4">
        <button class="btn-dotted" @click="hide" v-if="!isPreview">
          Close
        </button>
        <button
          class="px-4 py-2 bg-primary text-white rounded-md"
          @click="send"
          v-if="usedTemplate !== null && !isPreview"
        >
          Send
        </button>
        <button
          class="px-4 py-2 bg-primary text-white rounded-md"
          @click="useTemplate(usedTemplate)"
          v-if="isPreview"
        >
          Continue
        </button>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { getMessageTemplates } from "src/api/messageTemplate";
import { ref, onMounted, watch, reactive } from "vue";
import type { Ref } from "vue";
import TableComponent from "src/components/ApplicationProgram/TableComponent.vue";
import Preview from "src/components/ApplicationProgram/Preview.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import { formattedActionType } from "src/constants/messageTemplate";
import useMessagingStore from "src/stores/modules/messaging";
import { storeToRefs } from "pinia";
import SlimInput from "../SlimInput.vue";

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["hide", "send"]);

const loading = ref(false);
const search: Ref<string> = ref("");
const page = ref(1);
const rowsPerPage = ref(10);
const selectedTemplate = ref([]);
const usedTemplate = ref(null);
const language = ref("");
const mediaHeader = ["MEDIA", "VIDEO", "IMAGE", "DOCUMENT"];
const templateName = ref("");
const isMeta: Ref<boolean> = ref(false);
const header = ref("");
const headerMessage = ref("");
const media = ref("");
const bodyMessage = ref("");
const footerMessage = ref("");
const actionCategory = ref("None");
const replies = ref(["", ""]);
const actions = ref(Array(2).fill(null));
const customVariables = ref([]);
const isPreview = ref(false);
const uplader: any = ref(null);
const filePreview: any = ref(null);
const data = reactive({
  applicationPrograms: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});

const messagingStore = useMessagingStore();

const { getSelectedChatPending: isPending, getSelectedChatExpired: isExpired } =
  storeToRefs(messagingStore);

const textBoxRefs = ref([]);

const fetchTemplates = async () => {
  loading.value = true;

  let isMeta = null;

  if (isExpired.value || isPending.value) {
    isMeta = true;
  } else if (!isPending.value) {
    isMeta = false;
  }

  const {
    data: { data: applicationPrograms, meta },
  } = await getMessageTemplates({
    limit: data.rowsPerPage,
    page: data.page,
    status: "published",
    isApproved: true,
    search: search.value,
    isMeta,
  });
  data.applicationPrograms = applicationPrograms;
  data.totalCount = meta?.filter_count;
  loading.value = false;
};

watch([rowsPerPage, page, isPending], () => {
  fetchTemplates();
});

onMounted(() => {
  data.page = 1;
  page.value = 1;
  fetchTemplates();
});

const hide = () => {
  if (usedTemplate.value === null) {
    emit("hide");
  }
  isPreview.value = false;
  usedTemplate.value = null;
};

const hideModal = () => {
  usedTemplate.value = null;
  hide();
};

/**
 * emits "send" event to trigger send message template
 */
const send = async () => {
  const numbers = listNumbers(bodyMessage.value);
  const validations = await Promise.allSettled(
    textBoxRefs.value.map(async (ref) => await ref.validate())
  );

  const fail = validations.some((validation) => validation.value === false);

  if (fail) {
    return;
  }

  numbers.forEach((num, index) => {
    bodyMessage.value = bodyMessage.value.replace(
      num,
      customVariables.value[index]
    );
  });

  emit(
    "send",
    templateName.value,
    bodyMessage.value,
    language.value,
    customVariables.value?.length > 0,
    isMeta.value,
    customVariables.value,
    header.value.toUpperCase(),
    headerMessage.value
  );
  emit("hide");
};

const listNumbers = (str: string) => {
  const regex = /{{\s*([\d]+)\s*}}/g;
  let match;
  const numbers: string[] = [];
  while ((match = regex.exec(str)) !== null) {
    numbers.push("{{" + Number(match[1]) + "}}");
  }
  return numbers;
};

const previewTemplate = (val: any) => {
  filePreview.value = null;
  usedTemplate.value = val;
  isPreview.value = true;

  applyTemplateComponent(val);
};

const useTemplate = (val: any) => {
  console.log("[message-template dialog] Using template:", val);
  filePreview.value = null;
  customVariables.value = [];
  templateName.value = val.name;
  language.value = val.language;
  isMeta.value = val.is_meta;

  usedTemplate.value = val;
  isPreview.value = false;
  applyTemplateComponent(val);
};

const applyTemplateComponent = (val: any) => {
  actions.value = Array(2).fill(null);
  console.log("[message-template-dialog] Previewing template", val);
  if (usedTemplate.value?.json?.components) {
    usedTemplate.value.components = usedTemplate.value?.json?.components;
    val.components = usedTemplate.value?.json?.components;
  }
  if (val.components) {
    const headerComponent = val.components.find(
      (c: any) => c?.type === "HEADER"
    );
    header.value = headerComponent?.format;
    console.log("used template", headerComponent);
    if (header.value?.toUpperCase() === "TEXT") {
      headerMessage.value = headerComponent.text;
    } else {
      media.value = headerComponent.text;
    }

    const bodyComponent = val.components.find((c: any) => c?.type === "BODY");
    bodyMessage.value = bodyComponent.text;

    const footerComponents = val.components.find(
      (c: any) => c?.type === "FOOTER"
    );
    footerMessage.value = footerComponents?.text;

    const buttonsComponents = val.components.find(
      (c: any) => c?.type === "BUTTONS"
    );

    if (buttonsComponents?.buttons.length > 0) {
      console.log(
        "[message-template-dialog] Message template has buttions",
        buttonsComponents
      );
      const firstButtonAction = buttonsComponents.buttons[0].type;
      actionCategory.value =
        firstButtonAction === formattedActionType.CALL_PHONE ||
        firstButtonAction === formattedActionType.VIEW_WEB
          ? (actionCategory.value = "Call To Action")
          : (actionCategory.value = "Quick Reply");

      actions.value = buttonsComponents.buttons.map((button, index) => {
        return {
          index,
          label: button.text,
          type:
            button.type === "PHONE_NUMBER"
              ? "Call Phone Number"
              : "View website",
          country:
            button.type === "PHONE_NUMBER"
              ? button.phone_number?.split(" ")[0]
              : "Static",
          value:
            button.type === "PHONE_NUMBER"
              ? button.phone_number?.split(" ")[1]
              : button.url,
        };
      });
    }

    const customerVariableCounted = listNumbers(bodyMessage.value).length;
    if (customerVariableCounted > 0) {
      customVariables.value = Array(customerVariableCounted).fill("");
    }
  }
};

const changePage = (val: number) => {
  data.page = val;
  fetchTemplates();
};

const searchHandler = (searchValue = "") => {
  search.value = searchValue;
  loading.value = true;
  fetchTemplates();
};

const resetSearch = () => {
  search.value = "";
  searchHandler();
};

const upload = async (fileList: any) => {
  const file = fileList[0];
  filePreview.value = file;
};
</script>
