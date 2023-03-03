<template>
  <img ref="authImg" />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
const props = defineProps({
  imgUrl: { type: String, default: "" },
  authToken: { type: String, default: "" },
});

const authImg = ref<any>();
const getImgUrl = () => {
  Object.defineProperty(Image.prototype, "imgurl", {
    configurable: true,
    writable: true,
    enumerable: true,
  });
  const request = new XMLHttpRequest();
  request.responseType = "blob";
  request.open("get", process.env.BACKEND_URL + props.imgUrl, true);
  request.setRequestHeader("authorization", props.authToken);

  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      authImg.value.src = URL.createObjectURL(request.response);
      authImg.value.onLoad = () => {
        URL.revokeObjectURL(authImg.value.src);
      };
    }
  };
  request.send(null);
};

// 结合具体业务需求添加
watch(
  () => props.imgUrl,
  () => {
    getImgUrl();
  }
);
onMounted(getImgUrl);
</script>
