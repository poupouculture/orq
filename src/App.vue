<template>
  <RouterView v-slot="{ Component }">
    <Transition name="slide-fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
