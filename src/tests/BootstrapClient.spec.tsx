import { render } from '@testing-library/react'
import BootstrapClient from '@/componentes/BootstrapClient'

describe('BootstrapClient', () => {
  it('no dibuja nada en pantalla (solo carga el JS de Bootstrap en el navegador)', () => {
    const { container } = render(<BootstrapClient />)
    expect(container.innerHTML).toBe('')
  })
})
