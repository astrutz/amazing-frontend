interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_BACKEND_URL: string
  readonly VITE_APP_GEONAMES_USER: string
  readonly VITE_APP_GEONAMES_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}