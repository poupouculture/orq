<template>
  <div>
    <p class="mb-2">Label</p>
    <q-select
      v-model="tags"
      :options="tagOptionsFilter"
      use-input
      :rules="[(val) => required(val)]"
      @filter="filter"
      :input-debounce="700"
      outlined
      lazy-rules
      multiple
      dense
      map-options
      :disable="mode == 'show'"
      use-chips
    />
  </div>
</template>
<script setup lang="ts">
import { required } from "src/utils/validation-rules";
import { ref, computed, watch, onMounted } from "vue";
import type { Ref } from "vue";
import type { Tag as ITag } from "src/types/TagTypes";
import { api } from "src/boot/axios";

interface Option {
  value: string | number;
  label: string;
}
type ITagOptions = Option & ITag;

const props = defineProps({
  mode: { default: "edit" },
  modelValue: { default: () => [] },
  customer: { type: Object, default: null },
});
const customer = computed(() => props.customer);
const emits = defineEmits(["update:modelValue"]);
watch(customer, (val: any) => {
  tags.value = [];
  setTagDefault(val);
});
const tags = computed({
  set: (val: ITagOptions[]) => emits("update:modelValue", val),
  get: () => props.modelValue,
});
const tagOptions: Ref<ITagOptions[]> = ref([]);
const tagOptionsFilter: Ref<Option[]> = ref(tagOptions);

const setTagDefault = (customer: any) => {
  if (customer.id && customer.tags.length) {
    tags.value = customer.tags.map((data: any) => ({
      label: data.tags_id.name,
      value: data.tags_id.id,
    }));
  }
};
onMounted(async () => {
  setTagDefault(customer.value);
});

const filter = async (val: string, update: any) => {
  try {
    if (val === "") {
      tagOptions.value = await searchTag();
    } else {
      tagOptions.value = await searchTag(val);
    }
    update(async () => {
      const needle = val.toLowerCase();
      tagOptionsFilter.value = tagOptions.value
        .map((item: ITag) => ({
          label: `${item.name}`,
          value: item.id,
        }))
        .filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
    });
  } catch (error) {}
};

const searchTag = async (val?: string) => {
  const { data } = await api.get("/items/tags", {
    params: {
      fields: "*",
      limit: 10,
      search: val,
    },
  });
  return data.data;
};
</script>
