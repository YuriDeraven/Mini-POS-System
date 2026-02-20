"use client"

import * as React from "react"
import { Bell, Search, User, ChevronDown, Settings, LogOut, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  title: string
  subtitle?: string
  onSeedData?: () => void
  onClearData?: () => void
  onSwitchUser?: () => void
}

export function Header({ title, subtitle, onSeedData, onClearData, onSwitchUser }: HeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search..."
            className="w-64 rounded-xl border-slate-200 bg-slate-50 pl-10 focus:bg-white"
          />
        </div>

        {/* Action Buttons */}
        {onSeedData && (
          <Button
            onClick={onSeedData}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 hover:bg-slate-50"
          >
            Load Demo
          </Button>
        )}
        
        {onClearData && (
          <Button
            onClick={onClearData}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 hover:bg-slate-50"
          >
            Clear Data
          </Button>
        )}

        {/* Notifications */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl cursor-pointer">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FFC107]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-[#FFC107] hover:text-[#FFC107]/80"
              >
                Mark all read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-medium">New sale recorded</span>
                </div>
                <span className="text-xs text-slate-500 ml-4">Rice (50kg bag) - 2 units</span>
                <span className="text-xs text-slate-400 ml-4">2 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="font-medium">Low stock alert</span>
                </div>
                <span className="text-xs text-slate-500 ml-4">Sugar (50kg) - 3 units left</span>
                <span className="text-xs text-slate-400 ml-4">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FFC107]" />
                  <span className="font-medium">Demo data loaded</span>
                </div>
                <span className="text-xs text-slate-500 ml-4">10 products, 50+ sales</span>
                <span className="text-xs text-slate-400 ml-4">Today</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Switch User Button */}
        {onSwitchUser && (
          <Button
            onClick={onSwitchUser}
            variant="ghost"
            size="sm"
            className="rounded-xl text-slate-600 hover:bg-slate-50"
          >
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Switch User</span>
          </Button>
        )}

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC107]">
                <User className="h-4 w-4 text-[#1A1A1A]" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-900">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Admin</span>
                <span className="text-xs font-normal text-slate-500">admin@minipos.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-lg">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-lg text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
