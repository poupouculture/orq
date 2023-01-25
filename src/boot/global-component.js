import { boot } from "quasar/wrappers";
import Vue3DraggableResizable from "vue3-draggable-resizable";

export default boot(({ app }) => {
  app.use(Vue3DraggableResizable);
});
