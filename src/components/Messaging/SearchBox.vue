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
    input-style="max-width: 125px"
    use-input
    @filter="filterFn"
    :input-debounce="250"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-select>
</template>

<script setup>
import { computed, ref } from "vue";
import { Platform } from "quasar";
import { searchMessages } from "src/api/messaging";
import useMessagingStore from "src/stores/modules/messaging";
import useUserInfoStore from "src/stores/modules/userInfo";

const messagingStore = useMessagingStore();
const userInfoStore = useUserInfoStore();
const isMobile = computed(() => Platform.is.mobile);

const options = ref([]);
const filterFn = (value) => {
  try {
    if (value === "") {
      options.value = [];
    }
    options.value = searchMessages({
      keyword: value,
      chatId: messagingStore.getSelectedChatId,
      userId: userInfoStore.getUserId,
    });
  } catch (e) {
    console.error("[search-message] Error in component", e);
  }
};
</script>
