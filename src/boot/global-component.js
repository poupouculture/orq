import { boot } from "quasar/wrappers";
import Vue3DraggableResizable from "vue3-draggable-resizable";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default boot(({ app }) => {
  app.use(Vue3DraggableResizable);
  app.use(VueSweetalert2);
});
