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

    <div
      class="grid mt-5 p-9 rounded-xl bg-white min-h-screen grid-cols-1 gap-5"
    >
      <div class="">
        <p class="text-2xl font-semibold">Campaign Setting</p>
      </div>

      <div class="container">
        <div class="grid grid-rows-1 lg:grid-rows-3 lg:grid-flow-col gap-4">
          <div class="lg:row-span-3 bg-red-500">01</div>
          <div class="lg:col-span-2 bg-red-500">02</div>
          <div class="lg:row-span-2 lg:col-span-2 bg-red-500">03</div>
        </div>
      </div>
    </div>
  </div>
</template>
