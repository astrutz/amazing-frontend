declare interface Env {
  readonly NG_APP_BACKEND_URL: string;
  readonly NG_APP_GEONAMES_USER: string;
  readonly NG_APP_GEONAMES_URL: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
