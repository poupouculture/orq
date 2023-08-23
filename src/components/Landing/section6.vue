<script setup lang="ts">
import angliss from "src/assets/images/angliss.png";
import tasteofasia from "src/assets/images/tasteofasia.png";
import fitmax from "src/assets/images/fitmax.png";
import paradise from "src/assets/images/paradise.jpeg";
import ks from "src/assets/images/k.jpeg";

import { ref } from "vue";

const clients = ref([angliss, fitmax, tasteofasia, paradise, ks]);
</script>

<template>
  <div class="mt-36">
    <div class="pl-5 flex flex-col">
      <span class="text-[#E12179] tracking-wide text-[23px] font-normal">
        THEY TRUST US
      </span>

      <p
        class="text-black text-[40px] font-black w-full md:w-[602px] leading-[57px]"
      >
        Selected Clients
      </p>
    </div>

    <div class="grid grid-cols-1 mt-10 sm:grid-cols-3 md:grid-cols-5 gap-16">
      <div
        v-for="(client, index) in clients"
        :key="index"
        class="flex justify-center"
      >
        <img :src="client" class="w-32" alt="" style="object-fit: contain" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
