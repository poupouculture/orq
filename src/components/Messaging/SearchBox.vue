<template>
  <q-select
    autocomplete
    class="self-center mr-3"
    :class="{ 'mb-3': !isMobile, 'mb-1': isMobile }"
    dense
    clearable
    outlined
    label="Search"
    v-bind="$props"
    v-model="internalValue"
    :options="options"
    input-style="max-width: 125px"
    option-value="id"
    option-label="label"
    use-input
    @filter="filterFn"
    @clear="clear"
    :input-debounce="250"
    behavior="dialog"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label caption>{{ scope.opt.dateCreated }}</q-item-label>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { Platform } from "quasar";
import { searchMessages } from "src/api/messaging";
import useMessagingStore from "src/stores/modules/messaging";
import useUserInfoStore from "src/stores/modules/userInfo";
import { format } from "date-fns";

const messagingStore = useMessagingStore();
const userInfoStore = useUserInfoStore();
const isMobile = computed(() => Platform.is.mobile);

const internalValue = ref(null);

watch(internalValue, (v) => {
  if (v) {
    messagingStore.selectedSearchResult = v;
    messagingStore.fetchChatSearchResultPagination(v.id);
  }
});

const clear = () => {
  internalValue.value = null;
  messagingStore.resetSearchResults();
  messagingStore.resetSelectedSearchResult();
  messagingStore.resetSelectedSearchResultPagination();
};

const options = ref([]);
const filterFn = async (value, update, abort) => {
  if (value === "") {
    update(() => {
      options.value = [];
    });
    return;
  }
  try {
    const { data } = await searchMessages({
      keyword: value,
      chatId: messagingStore.getSelectedChatId,
      userId: userInfoStore.getUserId,
    });
    update(() => {
      options.value = data
        .map(({ content, ...args }) => ({
          id: args.id,
          label: content.text,
          dateCreated: format(new Date(args.date_created), "p, d MMM"),
        }))
        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    });
  } catch (e) {
    abort();
    console.error(e);
  }
};
</script>
