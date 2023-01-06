<template>
  <q-dialog :modelValue="props.modelValue" persistent class="q-pa-lg">
    <q-card class="q-pa-sm">
      <q-card-section class="row items-start">
        <div class="col-1">
          <img src="../../assets/images/warning.png" />
        </div>
        <div class="col q-ml-md">
          <span>
            <div class="deletetxt">{{ title }}</div>
            <div class="q-mt-sm">
              {{ description }}
            </div>
          </span>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="btn-hld">
        <q-btn
          color="primary"
          :label="cancelLabel"
          v-close-popup
          outline
          class="dialogbtn-cls"
          @click="cancel"
        />

        <q-btn
          color="primary"
          :label="submitLabel"
          v-close-popup
          class="dialogbtn-cls"
          @click="submitDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  cancelLabel: {
    type: String,
    default: "Cancel",
  },
  submitLabel: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["delete", "cancel"]);

const cancel = () => {
  emit("cancel");
};
const submitDelete = () => {
  emit("submit");
};
</script>

<style scoped>
.dialog-class {
  border-radius: 6px;
}
.lowertext {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  display: flex;

  justify-content: center;
  align-items: center;
  padding-left: 80px;
  padding-right: 80px;
  margin-top: -15px;
  color: #6b7280;
}
.dialogbtn-cls {
  border-radius: 5px;
  margin-top: 20px;
}
.deletetxt {
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #111827;
}
</style>
