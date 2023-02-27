import type { InjectionKey, Ref } from 'vue';

/** Type-safe provide/inject key */
export const InjectKey = {
  exampleKey: Symbol('Using to provide/inject data') as InjectionKey<
    Readonly<Ref<string>>
  >,
  exampleFuncKey: Symbol('Function to do something') as InjectionKey<
    (data: unknown) => unknown
  >,
};

// key for session/local storage
export const PersistStateKey = {
  // prefix: '__persisted__',
  user: '__user__',
  globalAppSettings: '__app_settings__',
};

/** Useful regex */
export enum Regex {
  POSITIVE_NUMBER = '^([+-]?[1-9]\\d*|0)$',
  // Allow 0-9,a-z, must have number and string, min length 8, max length 8
  RESET_PASSWORD = '^(?=.*[0-9])(?=.*[a-z])([a-z0-9]{8,8})$',
  // Allow 0-9,a-z, must have number and string, min length 8, max length 20
  PASSWORD = '^(?=.*[0-9])(?=.*[a-z])([a-zA-Z0-9]{8,20})$',
  EMAIL = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$',
  // Allow 0-9,a-z, min length 5, max length 30
  ACCOUNT = '^(?=.*[a-z])([a-zA-Z0-9]{5,30})$',
  PHONE = '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$',
  HEX_COLOR = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
}

/** Useful when using vue-recaptcha */
export enum RecaptchaAction {
  RESET_PASSWORD = '1',
  SIGN_UP = '2',
  VERIFY_ACCOUNT = '3',
  LOGIN = '4',
  REQUEST_RESET_PASSWORD = '5',
}

export enum IconSource {
  AWESOME_FONT = 'font-awesome',
  MDI_FONT = 'mdi',
  CUSTOM = 'custom',
}
