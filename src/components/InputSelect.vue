<!-- eslint-disable vue/require-prop-type-constructor -->
<!-- eslint-disable no-tabs -->
<!-- eslint-disable vue/require-v-for-key -->
<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
  <div :style="isBorder && { height: `10px`}" class="custom-select" :class="icon ? `custom-select-icon` : `custom-select`" :tabindex="tabindex" @blur="open = false">
    <div
    style="font-family: 'Archivo', sans-serif; font-weight: 500; font-size: 14px;"
    class="selected"
    :class="{ open: open }" @click="open = !open"
    :style="isBorder ? {
      border: 'none',
      opacity: isBorder && isColorGray && 0.3
    } : isColorGray && {
      opacity:0.3
    }"
    >
      {{ selected }}
      <q-icon
        name="fa-solid fa-chevron-down"
        style="color: gray; margin-right: 10px"
      />
    </div>
    <div class="items" :class="{ selectHide: !open}" :style="icon && { top: `40px`}">
      <div
        v-for="(option, i) of options"
        :key="i"
        @click="
          selected = option;
          open = false;
          $emit('input', option);
          updateValue(option);
        "
        style="font-family: 'Archivo', sans-serif; font-weight: 500; font-size: 14px;"
      >
        {{ option }}
      </div>
    </div>
    <div v-if="icon" style="width: 40px; height: 40px; background-color: #F2F3F7; border-top-right-radius: 10px; border-bottom-right-radius: 10px; margin-left: -4px; display: flex; align-items: center; justify-content: center;">
      <img :src="icon" style="width: 15px; object-fit: contain;" />
    </div>
  </div>
</template>

<script>

export default {
  props: {
    options: [],
    // eslint-disable-next-line vue/require-prop-type-constructor
    default: '',
    // eslint-disable-next-line vue/require-prop-type-constructor
    tabindex: 0,
    // eslint-disable-next-line vue/require-prop-type-constructor
    value: '',
    // eslint-disable-next-line vue/require-prop-type-constructor
    icon: '',
    // eslint-disable-next-line vue/require-prop-type-constructor
    isBorder: false,
    // eslint-disable-next-line vue/require-prop-type-constructor
    isColorGray: false
  },
  data () {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
          ? this.options[0]
          : null,
      open: false
    }
  },
  mounted () {
    this.$emit('input', this.selected)
  },
  methods: {
    updateValue (value) {
      this.$emit('update:value', value)
      console.log(value)
    }
  }
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 40px;
  line-height: 40px;
}
.custom-select-icon {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 40px;
  line-height: 40px;
  display: flex;
}

.selected {
  background-color: transparent;
  border-radius: 6px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  width: 100%;
  color: #2E2E3A;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  overflow: hidden;
}

.custom-select .selected.open {
  border: 1px solid #4B44F6;
  border-radius: 6px 6px 0px 0px;
}

.custom-select .items {
  color: black;
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  border-right: 1px solid #4B44F6;
  border-left: 1px solid #4B44F6;
  border-bottom: 1px solid #4B44F6;
  position: absolute;
  background-color: white;
  left: 0;
  right: 0;
  z-index: 1;
}

.custom-select .items div {
  color: black;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
}

.selectHide {
  display: none;
}
</style>
