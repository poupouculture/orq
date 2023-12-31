<template>
  <div :class="{ isMobile: isMobile, isDesktop: !isMobile }">
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
      option-value="id"
      option-label="label"
      use-input
      @filter="filterFn"
      @clear="clear"
      :input-debounce="250"
      @input-value="handleTextInput"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section>
            <q-item-label>No results found</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label caption>{{ scope.opt.dateCreated }}</q-item-label>
            <q-item-label>
              <div v-if="!isMobile" style="max-width: 400px">
                {{ scope.opt.label }}
              </div>
              <span v-else>{{ scope.opt.label }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:selected>
        <div class="ellipsis">
          {{
            internalValue?.label.length > 20
              ? `${internalValue?.label.substring(0, 20)}...`
              : internalValue?.label
          }}
        </div>
      </template>
    </q-select>
  </div>
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
// const isDesktop = computed(() => Platform.is.desktop);

const internalValue = ref(null);

watch(internalValue, (v) => {
  if (v) {
    messagingStore.selectedSearchResult = v;
    messagingStore.fetchChatSearchResultPagination(v.id);
  }
});

const handleTextInput = (value) => {
  console.log(value.length);
  if (!value.length) {
    console.log("[search-box] handleTextInput: clear");
    clear();
  }
};

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
      messagingStore.resetSearchResults();
      messagingStore.resetSelectedSearchResult();
      messagingStore.resetSelectedSearchResultPagination();
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

<style scoped>
div.isDesktop {
  width: 350px;
}

div.isMobile {
  max-width: 200px;
}
</style>
