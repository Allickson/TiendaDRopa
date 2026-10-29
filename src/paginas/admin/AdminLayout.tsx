import type { ReactNode } from 'react'
import AdminSidebar from '@/componentes/AdminSidebar'

interface Props {
  nombre: string
  onSalir: () => void
  children: ReactNode
}

export default function AdminLayout({ nombre, onSalir, children }: Props) {
  return (
    <div className="container-fluid flex-grow-1">
      <div className="row">
        <aside className="col-12 col-md-3 col-xl-2 px-0">
          <AdminSidebar nombre={nombre} onSalir={onSalir} />
        </aside>
        <main className="col-12 col-md-9 col-xl-10 py-4 px-3 px-md-4">{children}</main>
      </div>
    </div>
  )
}
