/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Change to fallback language
import enUS from '@src/lang/en.json';

// typesafe for i18n plugin
// {@link https://vue-i18n.intlify.dev/guide/advanced/typescript.html}
declare module 'vue-i18n' {
  type MessageSchema = typeof enUS;

  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {
    short: {
      hour: 'numeric';
      minute: 'numeric';
      second: 'numeric';
      timeZoneName: 'short';
      timezone: string;
    };
  }

  // define the number format schema
  export interface DefineNumberFormat {
    currency: {
      style: 'currency';
      currencyDisplay: 'symbol';
      currency: string;
    };
  }
}
