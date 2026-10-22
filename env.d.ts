/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API base URL. Default "/api" (Vite proxy in dev). */
  readonly VITE_API_URL?: string
  /** Prefix for uploaded images when the API lives on another origin. */
  readonly VITE_ASSET_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
