// Importa todos los archivos de src (excepto los tests y el layout raíz, que importa CSS)
// para que el reporte de cobertura incluya también los que no tienen pruebas propias.
// Sin esto, istanbul solo mide los archivos que algún test importa y el % se infla.
const modulos = import.meta.webpackContext('../', {
  recursive: true,
  regExp: /^\.\/(?!tests\/|app\/layout\.tsx$)(?!.*\.d\.ts$).+\.tsx?$/
})

describe('módulos del proyecto', () => {
  it('todos los archivos de src se importan sin errores', () => {
    const claves = modulos.keys()
    claves.forEach(clave => expect(() => modulos(clave)).not.toThrow())
    expect(claves.length).toBeGreaterThan(60)
  })
})
