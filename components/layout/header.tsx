'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  onMenuClick: () => void
}

const getPageTitle = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean)
  
  switch (segments[0]) {
    case 'dashboard':
      return 'Dashboard'
    case 'sessions':
      if (segments[1] === 'new') return 'Nueva Sesión de Calibración'
      if (segments[1] && segments[1] !== 'new') return 'Detalles de Sesión'
      return 'Mis Sesiones'
    case 'scorecards':
      if (segments[1] === 'new') return 'Nuevo Scorecard'
      if (segments[1] && segments[1] !== 'new') return 'Editar Scorecard'
      return 'Gestión de Scorecards'
    case 'analytics':
      return 'Análisis y Reportes'
    case 'action-plans':
      return 'Planes de Acción'
    case 'settings':
      return 'Configuración'
    default:
      return 'CalibraPro'
  }
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search bar - only show on larger screens */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar sesiones, scorecards..."
                className="pl-10 w-64"
              />
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  )
}