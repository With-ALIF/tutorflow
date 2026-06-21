/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  // Add any specific custom env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
