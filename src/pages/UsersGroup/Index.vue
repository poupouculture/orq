<template>
  <div class="mt-10">
    <!-- Heading -->
    <div class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5">
      <q-icon name="keyboard_backspace" class="text-gray-400" />
      <span class="text-gray-400">User Group</span>
      <span>/</span>
      <span>Customer Groups</span>
    </div>
    <!-- Search -->
    <div class="flex items-center justify-between">
      <div class="w-52 ml-3">
        <q-input placeholder="Search Items..." bg-color="transparent" outlined dense class="border-gray-400">
          <template v-slot:prepend>
            <q-icon name="search" class="text-gray-400" />
          </template>
          <template v-slot:append>
            <q-icon name="filter_list" class="text-gray-400" />
          </template>
        </q-input>
      </div>
      <q-btn class="bg-primary text-white">
        <q-icon name="add" class="text-white mr-2" />
        <span>Add</span>
      </q-btn>
    </div>
    <!-- Content -->
    <h5 class="uppercase mt-6 text-gray-500">Pinned Projects</h5>
    <div class="grid lg:grid-cols-4 gap-4">
      <!-- Projects -->
      <div class="flex flex-col gap-y-2" v-for="project in projects" :key="project.name">
        <div
          class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 flex-nowrap">
          <div class="shrink-0 flex items-center">
            <div class="w-16 h-16 items-center justify-center flex text-white mr-3"
              :style="{ backgroundColor: project.imageColor }">
              {{ project.imageText }}
            </div>
            <div>
              <div>{{ project.name }}</div>
              <p class="text-gray-400">{{ project.members.length }} Members</p>
            </div>
          </div>
          <ButtonAction />
        </div>
        <!-- members -->
        <div
          class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 flex-nowrap"
          v-for="(member, i) in project.members" :key="i">
          <div class="shrink-0 flex items-center">
            <img :src="member.image" class="w-10 h-10 rounded-full mx-3" />
            <div>
              <div class="relative">
                {{ member.name }}
                <span class="absolute top-0 -right-10 bg-primary rounded-xl text-white px-2 py-0.5 text-xs">VIP</span>
              </div>
              <div class="text-gray-400 cursor-pointer">
                {{ member.position }}
                <q-menu fit anchor="bottom middle" self="top right" auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section>View</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Remove</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>
          </div>
          <ButtonAction />
        </div>
      </div>
    </div>
    <div class="flex items-cnter justify-center mt-20">
      <BasePagination />
    </div>
  </div>
</template>

<script setup>
import ButtonAction from 'components/Group/ButtonAction.vue'
import BasePagination from 'components/BasePagination.vue'
const projects = [
  {
    name: 'VIP Group',
    imageText: 'VP',
    imageColor: 'lightblue',
    members: [
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer'
      },
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer'
      },
    ]
  },
  {
    name: 'Developer - Hong Kong',
    imageText: 'D - HK',
    imageColor: 'rgb(238, 111, 37)',
    members: [
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer',
        isVIp: true
      },
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer'
      },
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer',
        isVIp: true
      },
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer'
      },
    ]
  },
  {
    name: 'Pending Group',
    imageText: 'PG',
    imageColor: 'rgb(37, 238, 144)',
    members: [
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer'
      },
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer',
        isVip: true
      },
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer'
      },
    ]
  },
  {
    name: 'New Customer',
    imageText: 'NC',
    imageColor: 'rgb(238, 37, 161)',
    members: [
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer'
      },
      {
        name: 'Rido Ananda',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        position: 'Developer'
      },
    ]
  },
]
</script>
