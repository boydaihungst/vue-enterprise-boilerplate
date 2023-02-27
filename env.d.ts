/// <reference types="vite/client" />
// IntelliSense for TypeScript
// https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
// import.meta.env.*
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_I18N_LOCALE: string;
  readonly VITE_I18N_FALLBACK_LOCALE: string;
}

// import.meta.*
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
