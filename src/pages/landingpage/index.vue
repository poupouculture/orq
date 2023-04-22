<script setup>
import Navbar from "./navbar.vue";
</script>

<template>
  <div>
    <div class="min-h-screen home flex flex-col items-center w-full p-10">
      <div class="container">
        <Navbar />

        <div class="min-h-[90vh] w-full flex flex-col mt-7 px-20 items-start">
          <div class="w-100">
            <p class="text-white capitalize font-black w-[80px] text-[70px]">
              we provide business solution
            </p>

            <div
              class="flex flex-col mt-5 gap-5 text-white text-2xl font-normal w-4/5"
            >
              <span class="">
                Streamline your workflow with our web app that includes
                messaging.
              </span>

              <span class="">
                Our goal is to provide a seamless and intuitive experience that
                simplifies your business operations and builds strategic value
                for your brand, whether you're in e-commerce, healthcare, or any
                other industry.
              </span>
            </div>
          </div>

          <div class="flex w-full mt-24 justify-center">
            <button class="rounded-full p-2 border-dashed border-2">
              <q-icon class="text-white" name="arrow_downward" size="4rem" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  background: linear-gradient(200.56deg, #40a4ff -3.58%, #e12179 94.64%),
    #4b44f6;
}
</style>
