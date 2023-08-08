<script setup>
defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div class="w-full flex justify-center">
    <article class="prose">
      <h1 class="text-center">{{ content.name }}</h1>

      <div
        class="grid p-4 gap-10 w-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="(children, index) in content.children"
          :key="index"
          class="flex flex-col"
        >
          <q-img
            class="rounded-borders"
            :src="children.icon"
            style="max-width: 150px"
          />

          <div class="flex flex-col capitalize mt-3 text-center justify-center">
            <span>{{ children.name }}</span>

            <div v-if="children.status !== 'draft'">
              <q-btn flat round color="primary" icon="expand_more">
                <q-menu>
                  <article v-html="children.content" class="prose" />
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss"></style>
