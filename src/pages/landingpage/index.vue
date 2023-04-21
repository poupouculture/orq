<script setup>
import Navbar from "./navbar.vue";
</script>

<template>
  <div>
    <div class="h-screen home flex flex-col items-center w-full p-10">
      <div class="container">
        <Navbar />

        <div class="h-[85vh] flex flex-col justify-center items-start">
          <div class="">
            <p class="text-white capitalize font-black w-[80px] text-[70px]">
              we provide business solution
            </p>
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
