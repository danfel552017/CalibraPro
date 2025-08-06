'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { isAdmin, canLeadSessions } from '@/lib/auth'
import { User } from '@/types'
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  CheckSquare,
  Settings,
  LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiresAdmin?: boolean
  requiresLeader?: boolean
}

const navigationItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Mis Sesiones',
    href: '/sessions',
    icon: Users,
  },
  {
    name: 'Scorecards',
    href: '/scorecards',
    icon: FileText,
    requiresAdmin: true,
  },
  {
    name: 'Nueva Sesión',
    href: '/sessions/new',
    icon: Users,
    requiresLeader: true,
  },
  {
    name: 'Análisis',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Planes de Acción',
    href: '/action-plans',
    icon: CheckSquare,
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    requiresAdmin: true,
  },
]

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const user = session?.user as User

  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAdmin && !isAdmin(user)) return false
    if (item.requiresLeader && !canLeadSessions(user)) return false
    return true
  })

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 nubank-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CP</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">CalibraPro</h1>
            <p className="text-xs text-muted-foreground">Quality Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-nubank-purple/10 text-nubank-purple'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User info and sign out */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src={user?.image || '/default-avatar.png'}
              alt={user?.name || 'Usuario'}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={cn(
              'status-badge',
              user?.role === 'Admin' && 'status-critical',
              user?.role === 'Lider' && 'status-in-progress',
              user?.role === 'Analista' && 'status-active'
            )}>
              {user?.role}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}