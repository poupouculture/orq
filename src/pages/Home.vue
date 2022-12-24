<template>
  <div>
    {{ $t("signup") }}
  </div>
  <q-btn label="chineese" @click="$i18n.locale = 'zh-CN'" />

  <q-btn label="english" @click="$i18n.locale = 'en-US'" />
</template>
