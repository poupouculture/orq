<template>
  <div>
    <h1>QR Code Component</h1>
    <div>
      <!-- Conditionally render the image if qrCodeUrl is not empty, otherwise show a loading indicator -->
      <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" />
      <div v-else>Loading QR Code...</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import useUserInfoStore from "src/stores/modules/userInfo.js";

export default {
  data() {
    return {
      qrCodeUrl: "",
    };
  },
  created() {
    // Call the generateQRCode method when the component is created
    this.generateQRCode();
  },
  methods: {
    generateQRCode() {
      const token = useUserInfoStore().token;

      const payload = {
        email: "qr-user@synque.io",
        password: "123456",
        qrCodeType: "payment",
      };

      axios
        .post("https://orq.dev.synque.ca/QR/generate", payload, {
          responseType: "arraybuffer", // Ensure the response is treated as binary data
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Convert the binary data to base64 and set it as the image source
          const imageBase64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          this.qrCodeUrl = `data:image/png;base64,${imageBase64}`;
        })
        .catch((error) => {
          console.error("Error generating QR code:", error);
        });
    },
  },
};
</script>
