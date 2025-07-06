'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b shadow-sm">
      {/* Logo or site name */}
      <Link href="/" className="text-2xl font-bold">
        Rag App
      </Link>

      {/* User Avatar & Dropdown */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.image ?? ''} alt={user.name ?? 'User'} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {user.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard" className="w-full">
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-red-500 focus:text-red-500"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
