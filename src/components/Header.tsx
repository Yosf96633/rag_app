"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onToggleSidebar?: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  // `useSession` can return `undefined` if no `SessionProvider` wraps the app.
  // Using optional-chaining avoids a runtime crash in that case.
  const sessionData = useSession?.()
  const session = sessionData?.data ?? null
  const user = session?.user

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b shadow-sm bg-background">
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Button */}
        <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
        </Button>

        {/* Logo or site name */}
        <Link href="/" className="text-2xl font-bold">
          Rag App
        </Link>
      </div>

      {/* User Avatar & Dropdown */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
              <AvatarFallback>{user.name?.charAt(0).toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard" className="w-full">
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => signOut()} className="text-red-500 focus:text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
