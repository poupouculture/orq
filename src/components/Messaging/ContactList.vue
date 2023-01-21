<template>
  <q-drawer :modelValue="true" class="bg-grey-2" show-if-above bordered>
    <q-list>
      <q-item-label header>
        <q-input placeholder="Search Items..." outlined dense>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon name="reorder" @click="text = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </q-item-label>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-mt-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        no-caps
      >
        <q-tab name="ongoing" label="Ongoing 6" />
        <q-tab name="waiting" label="Waiting 1" />
        <q-tab name="closed" label="Closed 0" />
      </q-tabs>
      <q-separator size="2px" style="margin-top: -2px" inset />
      <q-tab-panels v-model="tab" animated class="q-mt-md transparent">
        <q-tab-panel name="ongoing"> test </q-tab-panel>
        <q-tab-panel name="waiting" class="q-gutter-y-sm">
          <ContactCard
            active
            name="Visitor"
            message="Hi"
            time="11:21
          AM"
            :totalUnread="3"
          />
          <ContactCard
            name="Chester "
            message="May I help you"
            time="11:21
          AM"
            :totalUnread="3"
          />
          <ContactCard
            name="Leslie"
            message="test"
            time="11:21
          AM"
          />
          <ContactCard
            name="Jimmy"
            message="hola"
            time="11:21
          AM"
          />
        </q-tab-panel>
        <q-tab-panel name="closed"> test </q-tab-panel>
      </q-tab-panels>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref } from "vue";
import ContactCard from "./ContactCard.vue";

const tab = ref("waiting");
</script>
