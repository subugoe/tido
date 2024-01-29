<script setup>
// interface Props {
//   text?: string,
//   display?: 'filled' | 'link' | 'mono' | 'flat' | 'outline',
//   size?: 'tiny' | 'small' | 'normal',
//   icon?: string | null,
//   iconPosition?: 'left' | 'right' | null,
//   rounded?: boolean | null
// }
//
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

import BaseIcon from '@/components/base/BaseIcon.vue';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  display: {
    type: String,
    default: 'filled',
  },
  size: {
    type: String,
    default: 'normal',
  },
  icon: {
    type: String,
    default: null,
  },
  iconPosition: {
    type: String,
    default: 'left',
  },
  rounded: {
    type: Boolean,
    default: null,
  },
});

let _icon = props.icon;
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

classes['focus:t-outline-none focus:t-ring-4 t-text-sm t-font-medium t-flex t-items-center t-justify-center t-leading-2'] = true;

classes['t-rounded-md'] = !_rounded;
classes['t-rounded-full'] = _rounded;

classes['t-py-2.5 t-ps-3 t-pe-5'] = props.size === 'normal' && !!(_icon) && _iconPosition === 'left';
classes['t-py-2.5 t-ps-5 t-pe-3'] = props.size === 'normal' && !!(_icon) && _iconPosition === 'right';
classes['t-p-2'] = props.size === 'normal' && isIconOnly;
classes['t-py-2.5 t-px-5'] = props.size === 'normal' && !_icon;

classes['t-py-1.5 t-ps-2 t-pe-3'] = props.size === 'small' && !!(_icon) && _iconPosition === 'left';
classes['t-py-1.5 t-ps-3 t-pe-2'] = props.size === 'small' && !!(_icon) && _iconPosition === 'right';
classes['t-p-1'] = props.size === 'small' && isIconOnly;
classes['t-py-1.5 px-3'] = props.size === 'small' && !_icon;

classes['t-py-1 t-ps-1 t-pe-1.5'] = props.size === 'tiny' && !!(_icon) && _iconPosition === 'left';
classes['t-py-1 t-ps-1.5 t-pe-1'] = props.size === 'tiny' && !!(_icon) && _iconPosition === 'right';
classes['t-p-0.5'] = props.size === 'tiny' && isIconOnly;
classes['t-py-1.5 px-2'] = props.size === 'tiny' && !_icon;
classes['t-text-xs t-leading-3'] = props.size === 'tiny';

classes['focus:t-ring-primary focus:t-ring-opacity-25 dark:focus:t-ring-primary-300 dark:focus:t-ring-opacity-50 t-bg-primary-300 t-text-white hover:t-bg-primary-700 '
  + 'dark:t-bg-primary dark:hover:t-bg-primary dark:focus:t-ring-green-800'] = props.display === 'filled';

classes['focus:t-ring-primary focus:t-ring-opacity-25 dark:focus:t-ring-primary-300 dark:focus:t-ring-opacity-50 t-bg-none t-text-primary hover:t-underline '
  + 'dark:focus:t-ring-green-800'] = props.display === 'link';

classes['t-bg-white t-text-dark t-border t-border-zinc-400 focus:t-ring-zinc-300 focus:t-ring-opacity-50 hover:t-bg-zinc-100 dark:t-bg-zinc-800'] = props.display === 'mono';

classes['t-bg-none t-text-primary t-border t-border-primary focus:t-ring-zinc-300 focus:t-ring-opacity-50 hover:t-bg-primary-50 dark:hover:t-bg-zinc-800'] = props.display === 'outline';

classes['t-bg-transparent hover:t-bg-zinc-100 dark:hover:t-bg-zinc-600 '
  + 'focus:t-ring-primary dark:focus:t-ring-primary-300 dark:focus:t-ring-opacity-50 focus:t-ring-opacity-25'] = props.display === 'flat';

function addTailwindPrefix(prefix, classesObj) {
  return classesObj;
  return Object.keys(classesObj).reduce((acc, cur) => {
    const byClass = cur.split(' ');

    const result = byClass.map((item) => {
      const byStates = item.split(':');
      byStates[byStates.length - 1] = prefix + byStates[byStates.length - 1];
      return byStates.join(':');
    }).join(' ');

    acc[result] = classesObj[cur];

    return acc;
  }, {});
}

</script>
<template>
  <button type="button" :class="addTailwindPrefix(fullConfig.prefix, classes)">
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
