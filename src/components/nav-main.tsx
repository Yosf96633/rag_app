"use client"
import {  type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { signOut } from "next-auth/react"
export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: Icon
    isLogout: boolean,
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className=" " tooltip={item.title}>
                <item.icon className={`${item.isLogout ? 'text-red-500' : 'text-black'}`}/>
               {!item.isLogout &&  <Link href={`/admin/dashboard${item.url}`}>{item.title}</Link>}
               <span   onClick={() => signOut()} className=" text-red-500">{item.isLogout && item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
