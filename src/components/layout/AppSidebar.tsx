import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  FolderKanban,
  Calendar,
  Building2,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
  { icon: FileText, label: 'Demandes', path: '/demandes' },
  { icon: Receipt, label: 'Dépenses', path: '/depenses' },
  { icon: FolderKanban, label: 'Opérations', path: '/operations' },
  { icon: Calendar, label: 'Campagnes', path: '/campagnes' },
  { icon: Building2, label: 'Services', path: '/services' },
  { icon: Users, label: 'Utilisateurs', path: '/utilisateurs' },
  { icon: Settings, label: 'Paramètres', path: '/parametres' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'sidebar-gradient flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
          <Wallet className="w-6 h-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold text-sidebar-foreground">Budget Pro</h1>
            <p className="text-xs text-sidebar-muted">Gestion municipale</p>
          </div>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* User Profile */}
      <div className={cn('px-4 py-4', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sidebar-accent text-sidebar-foreground font-semibold">
            AG
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <p className="text-sm font-medium text-sidebar-foreground">Anne GAVARD</p>
              <p className="text-xs text-sidebar-muted">Admin</p>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'text-sidebar-foreground hover:bg-sidebar-accent',
                isActive && 'bg-sidebar-accent text-primary font-medium',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
              {!collapsed && <span className="animate-slide-in">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Bottom Section */}
      <div className="p-2 space-y-2">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Déconnexion</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Réduire</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
