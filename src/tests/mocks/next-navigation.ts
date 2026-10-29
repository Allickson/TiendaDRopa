// Mock de 'next/navigation' para las pruebas.
// En Karma no existe el router de Next, así que karma.conf.cjs redirige este import aquí.
// Las pruebas configuran la ruta simulada con configurarRuta() y revisan
// a dónde se navegó con routerMock.historial o con spyOn(routerMock, 'push').

type Params = Record<string, string>

const estado = { pathname: '/', search: '', params: {} as Params }

export const routerMock = {
  historial: [] as string[],
  push(url: string) { routerMock.historial.push(url) },
  replace(url: string) { routerMock.historial.push(url) },
  back() {},
  forward() {},
  refresh() {},
  prefetch() {}
}

export function configurarRuta({ pathname = '/', search = '', params = {} }: { pathname?: string; search?: string; params?: Params } = {}) {
  estado.pathname = pathname
  estado.search = search
  estado.params = params
  routerMock.historial = []
}

export const ultimaRuta = () => routerMock.historial[routerMock.historial.length - 1]

export function useRouter() { return routerMock }
export function usePathname() { return estado.pathname }
export function useSearchParams() { return new URLSearchParams(estado.search) }
export function useParams<T extends Params = Params>(): T { return estado.params as T }
