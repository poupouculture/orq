<template>
  <div>
    <span v-if="props.content?.type === MessageType.IMAGE">
      <q-icon class="text-4xl" name="image" />
    </span>
    <span v-else-if="props.content?.type === MessageType.AUDIO">
      <q-icon class="text-4xl" name="mic" />
    </span>
    <span v-else>{{ props.content.text ?? props.content }}</span>
  </div>
</template>

<script setup lang="ts">
import { MessageType } from "src/types/MessagingTypes";
interface ContentType {
  type: string;
  text: string;
}
interface Props {
  content: ContentType;
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({} as ContentType),
});
</script>
