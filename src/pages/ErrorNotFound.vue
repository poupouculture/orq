<template>
  <div class="w-full flex justify-center items-center h-screen">
    <div
      class="flex justify-between gap-20 flex-col items-center container p-10"
    >
      <img class="w-32" src="~assets/images/logo-invert.svg" />

      <div class="flex flex-col">
        <div class="flex flex-col justify-center items-center">
          <p class="text-primary pb-5 font-bold text-2xl">404 error</p>
          <p class="text-[#111827] pb-4 font-bold text-5xl">Page not found</p>
          <span class="text-[#6B7280] text-base font-normal">
            Sorry, we couldn't find the page you're looking for.
          </span>
          <q-btn to="/" flat rounded class="mt-5" color="primary">
            <span class="capitalize pr-2 text-base font-normal">
              Go Back Home
            </span>
            <q-icon name="arrow_forward" />
          </q-btn>
        </div>
      </div>

      <q-btn to="/" flat rounded class="mt-auto">
        <span class="capitalize text-[#6B7280] text-base font-normal">
          Contact support
        </span>
      </q-btn>
    </div>
  </div>
</template>
