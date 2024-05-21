<script setup lang="ts">
import { watch } from 'vue';
import BaseIcon from '@/components/base/BaseIcon.vue';

export interface Props {
  text: string,
  display: string,
  size: string,
  icon: string | null,
  iconPosition: string | null,
  rounded: boolean | null,
  disabled: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  display: 'filled',
  size: 'normal',
  icon: null,
  iconPosition: 'left',
  rounded: null,
  disabled: false
})


let _icon;
watch(() => props.icon, (value) => _icon = value, { immediate: true });

let _iconPosition = props.iconPosition;
let isIconOnly = false;

if (props.text === '' && _icon !== null) {
  isIconOnly = true;
  _iconPosition = null;
}

let _rounded = false;
if (props.rounded === null && props.text === '') _rounded = true;
if (props.rounded === null && props.text !== '') _rounded = false;
if (props.rounded !== null) _rounded = props.rounded;

const classes = {};

if (props.display === 'link') {
  _iconPosition = 'right';
  _icon = 'heroicons:arrow-right-20-solid';
}

classes['focus-visible:t-outline-none focus-visible:t-ring-4 !t-flex t-items-center t-justify-center disabled:t-opacity-50'] = true;

classes['t-rounded-md'] = !_rounded;
classes['t-rounded-full'] = _rounded;

// Paddings Size Normal
classes['t-py-2.5 t-ps-3 t-pe-5'] = props.size === 'normal' && !!(_icon) && _iconPosition === 'left';
classes['t-py-2.5 t-ps-5 t-pe-3'] = props.size === 'normal' && !!(_icon) && _iconPosition === 'right';
classes['t-p-[0.6rem]'] = props.size === 'normal' && isIconOnly;
classes['t-py-2.5 t-px-5'] = props.size === 'normal' && !_icon;

// Paddings Size Small
classes['t-py-1.5 t-ps-2 t-pe-3'] = props.size === 'small' && !!(_icon) && _iconPosition === 'left';
classes['t-py-1.5 t-ps-3 t-pe-2'] = props.size === 'small' && !!(_icon) && _iconPosition === 'right';
classes['t-p-2'] = props.size === 'small' && isIconOnly;
classes['t-py-1.5 px-3'] = props.size === 'small' && !_icon;

// Paddings Size Tiny
classes['t-py-1 t-ps-1 t-pe-1.5'] = props.size === 'tiny' && !!(_icon) && _iconPosition === 'left';
classes['t-py-1 t-ps-1.5 t-pe-1'] = props.size === 'tiny' && !!(_icon) && _iconPosition === 'right';
classes['t-p-0.5'] = props.size === 'tiny' && isIconOnly;
classes['t-py-1.5 px-2'] = props.size === 'tiny' && !_icon;

// Font Size Normal
classes['t-text-sm t-leading-2'] = props.size === 'normal' && !isIconOnly;
classes['t-text-md t-leading-2'] = props.size === 'normal' && isIconOnly;

// Font Size Small
classes['t-text-sm t-leading-2'] = props.size === 'small';

// Font Size Tiny
classes['t-text-xs t-leading-3'] = props.size === 'tiny';

classes['focus-visible:t-ring-primary focus-visible:t-ring-opacity-25 dark:focus-visible:t-ring-primary dark:focus-visible:t-ring-opacity-50 t-bg-primary t-text-white hover:t-bg-primary-700 '
  + 'dark:t-bg-primary dark:hover:t-bg-primary dark:focus:t-ring-green-800 hover:t-bg-primary-accent'] = props.display === 'filled';

classes['focus-visible:t-ring-primary focus-visible:t-ring-opacity-25 dark:focus-visible:t-ring-primary dark:focus-visible:t-ring-opacity-50 t-bg-none t-text-primary hover:t-underline'] = props.display === 'link';

classes['t-bg-white t-text-dark t-border t-border-zinc-400 focus:t-ring-zinc-300 focus:t-ring-opacity-50 hover:t-bg-zinc-100 dark:t-bg-zinc-800'] = props.display === 'mono';

classes['t-bg-none t-text-primary t-border t-border-primary focus:t-ring-zinc-300 focus:t-ring-opacity-50 hover:t-bg-primary-50 dark:hover:t-bg-zinc-800'] = props.display === 'outline';

classes['t-bg-transparent hover:t-bg-gray-300/30 dark:hover:t-bg-gray-600 '
  + 'focus-visible:t-ring-primary dark:focus-visible:t-ring-primary-300 dark:focus-visible:t-ring-opacity-50 focus-visible:t-ring-opacity-25'] = props.display === 'flat';

</script>
<template>
  <button type="button" :class="classes" :disabled="disabled">
    <template v-if="_icon && _iconPosition === 'left'">
      <BaseIcon :name="_icon" class="t-text-base t-me-1"/>
    </template>
    <template v-if="isIconOnly">
      <BaseIcon :name="_icon" class="mt-[1px]"/>
    </template>
    <template v-else>{{ text }}</template>
    <template v-if="_icon && _iconPosition === 'right'">
      <BaseIcon :name="_icon" class="t-text-base t-ms-1"/>
    </template>
  </button>
</template>
