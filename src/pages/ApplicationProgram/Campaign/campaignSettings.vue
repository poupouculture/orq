<template>
  <div class="main-container py-4">
    <div
      class="w-full text-gray-400 capitalize h-full text-2xl font-semibold leading-8 flex items-center justify-start gap-3"
    >
      <RouterLink
        to="/application-programs"
        class="flex items-center capitalize gap-2 hover:text-primary transition-all duration-200"
      >
        <q-icon class="text-xl" name="fa-solid fa-arrow-left" />

        <span>Application Programs</span>
      </RouterLink>

      <span>/</span>

      <RouterLink
        to="/application-programs/campaign"
        class="hover:text-primary transition-all duration-200"
      >
        <span>Campaign</span>
      </RouterLink>

      <span>/</span>

      <RouterLink :to="$route.path" class="text-primary">
        <span>Campaign setting</span>
      </RouterLink>
    </div>
  </div>
</template>
