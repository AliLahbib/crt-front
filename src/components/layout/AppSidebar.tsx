import { useState } from "react"
import { useLocation, NavLink } from "react-router-dom"
import { 
  Users, 
  Calendar, 
  User,
  ChevronDown,
  ChevronUp,
  ClipboardList
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { 
    title: "Tableau de Bord", 
    url: "/", 
    icon: User,
    description: "Vue d'ensemble"
  },
  { 
    title: "Ressources Humaines", 
    url: "/rh", 
    icon: Users,
    description: "Gestion des bénévoles"
  },
  { 
    title: "Gestion des Stocks", 
    url: "/stocks", 
    icon: Calendar,
    description: "Inventaire et dons"
  },
  { 
    title: "Familles à Aider", 
    url: "/familles", 
    icon: Users,
    description: "Bénéficiaires"
  },
  { 
    title: "Gestion des Besoins", 
    url: "/besoins", 
    icon: ClipboardList,
    description: "Types de besoins"
  },
  { 
    title: "Événements", 
    url: "/evenements", 
    icon: Calendar,
    description: "Actions et missions"
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const location = useLocation()
  const currentPath = location.pathname
  const [isMenuOpen, setIsMenuOpen] = useState(true)

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavClasses = (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200 hover:bg-redCrescent-lightRed/20"
    return isActive(path) 
      ? `${baseClasses} bg-redCrescent-red text-white hover:bg-redCrescent-darkRed` 
      : `${baseClasses} text-gray-700 hover:text-redCrescent-red`
  }

  return (
    <Sidebar className={`border-r border-gray-200 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-redCrescent-red rounded-full flex items-center justify-center text-white font-bold">
            CR
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h2 className="text-lg font-bold text-redCrescent-red">Croissant Rouge</h2>
              <p className="text-sm text-gray-600">Comité Régional</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel 
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {!isCollapsed && <span className="text-redCrescent-red font-medium">Navigation</span>}
            {!isCollapsed && (isMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
          </SidebarGroupLabel>

          {isMenuOpen && (
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink 
                        to={item.url} 
                        className={getNavClasses(item.url)}
                        end={item.url === "/"}
                      >
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs opacity-75 truncate">{item.description}</div>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-gray-200">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  )
}
