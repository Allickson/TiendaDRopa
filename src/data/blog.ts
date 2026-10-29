import type { EntradaBlog } from '@/tipos'

export const entradas: EntradaBlog[] = [
  {
    id: 1,
    titulo: 'Cómo combinar rosa sin morir en el intento',
    fecha: '2026-03-12',
    imagen: '/img/blusa.png',
    resumen: 'Tres combinaciones fáciles para usar rosa todos los días.',
    contenido: [
      'El rosa no es solo para ocasiones especiales. Con un pantalón de mezclilla y una blusa rosa pálido tienes un look de oficina relajado.',
      'Si te atreves con un rosa fuerte, acompáñalo con tonos neutros como crema, gris o beige para que sea el protagonista.',
      'Para los días fríos, un polerón rosa con falda oscura equilibra lo cómodo con lo arreglado.'
    ]
  },
  {
    id: 2,
    titulo: 'Cuidado de tus prendas',
    fecha: '2026-04-02',
    imagen: '/img/sueter.png',
    resumen: 'Consejos de lavado para que tu ropa dure más.',
    contenido: [
      'Lava los tejidos de punto a mano o en ciclo delicado con agua fría, y sécalos en horizontal para que no se estiren.',
      'Da vuelta las prendas de mezclilla antes de lavarlas: así el color se mantiene por más tiempo.',
      'Evita la secadora en prendas de algodón si quieres que conserven su talla.'
    ]
  }
]
