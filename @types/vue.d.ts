import BaseButton from '@components/_base-button.vue';
import BaseIcon from '@components/_base-icon.vue';
import BaseInput from '@components/_base-input-text.vue';
import BaseLink from '@components/_base-link.vue';
import BaseSelect from '@components/_base-select.vue';
import 'vue';

// Fix import .vue in ts file
declare global {
  // module '*.vue' {
  //   const component: DefineComponent<
  //     Record<string, any>,
  //     Record<string, any>,
  //     any
  //   >;
  //   export default component;
  // }
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    // Custom component properties
    $style: { [key: string]: string };
  }

  export interface GlobalComponents {
    // Property intelisence for dynamic component
    // https://vuejs.org/guide/essentials/component-basics.html#dynamic-components
    component: <T>(props: { is: T } & ExtractComponentProps<T>) => JSX.Element;
    // Custom Global components
    BaseLink: typeof BaseLink;
    BaseButton: typeof BaseButton;
    BaseIcon: typeof BaseIcon;
    BaseInput: typeof BaseInput;
    BaseSelect: typeof BaseSelect;
  }

  type ExtractComponentProps<T> = T extends new (...args: any) => {
    $props: infer P;
  }
    ? P
    : Record<string, any>;
}

// export {};
