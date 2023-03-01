<template>
  <div
    class="fixed w-full min-h-screen bg-black/50 z-[1000] top-0 bottom-0 right-0 flex justify-end"
    @click="showContent = false"
  >
    <Transition name="right-to-left" appear @after-leave="close()">
      <div
        class="w-8/12 h-full bg-white px-5 py-6 overflow-y-scroll"
        @click.stop
        v-if="showContent"
      >
        <slot name="header-search">
          <div class="flex items-center justify-between">
            <div class="w-52 ml-3">
              <q-input
                placeholder="Search Items..."
                bg-color="transparent"
                outlined
                dense
                class="border-gray-400"
              >
                <template v-slot:prepend>
                  <q-icon name="search" class="text-gray-400" />
                </template>
                <template v-slot:append>
                  <q-icon name="filter_list" class="text-gray-400" />
                </template>
              </q-input>
            </div>
            <q-btn @click="submit()" round color="primary" icon="check" />
          </div>
        </slot>
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref } from "vue";

const emits = defineEmits(["submit", "changePage", "close"]);
const showContent = ref(true);

const submit = () => {
  emits("submit");
  showContent.value = false;
};
const close = () => {
  emits("close");
};
</script>
