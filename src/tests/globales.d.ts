// Tipo de import.meta.webpackContext (lo provee webpack 5, usado en modulos.spec.ts)
interface ImportMeta {
  webpackContext(
    directorio: string,
    opciones: { recursive?: boolean; regExp?: RegExp }
  ): { keys(): string[]; (id: string): unknown }
}

