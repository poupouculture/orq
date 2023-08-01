<script setup>
import { computed } from "vue";

const props = defineProps({
  navigation: {
    type: Object,
  },
  category: {
    type: Array,
  },
});

const emits = defineEmits([
  "update:modelValue",
  "parentActive",
  "update:Collapse",
]);

const value = computed({
  set: (val) => emits("update:modelValue", val),
  get: () => props.category,
});

const collapse = computed({
  set: (val) => emits("update:Collapse", val),
  get: () => props.navigation.openCollapse,
});
</script>

<template>
  <q-expansion-item :model-value="collapse">
    <template #header>
      <q-item-section avatar>
        <q-checkbox
          size="xs"
          @click="emits('parentActive', navigation.id)"
          :val="navigation.id"
          v-model="value"
        />
      </q-item-section>

      <q-item-section class="text-capitalize">
        {{ navigation.name }}
      </q-item-section>
    </template>

    <q-card>
      <q-card-section class="py-0">
        <q-list
          class="rounded-borders"
          padding
          dense
          v-for="(children, index) in navigation.children"
          :key="index"
        >
          <q-item clickable v-ripple v-if="navigation.children.length === 0">
            <q-item-section avatar>
              <q-checkbox v-model="value" size="xs" :val="children.id" />
            </q-item-section>
            <q-item-section>
              {{ children.name }}
            </q-item-section>
          </q-item>

          <q-expansion-item
            v-if="navigation.children.length > 0"
            class="w-full"
          >
            <template #header>
              <q-item-section avatar>
                <q-checkbox v-model="value" size="xs" :val="children.id" />
              </q-item-section>
              <q-item-section>
                {{ children.name }}
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="py-0">
                <q-list
                  v-for="(childrenChildren, childrenIndex) in children.children"
                  :key="childrenIndex"
                >
                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-checkbox
                        v-model="value"
                        :val="childrenChildren.id"
                        size="xs"
                      />
                    </q-item-section>

                    <q-item-section>
                      {{ childrenChildren.name }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<style scoped></style>
