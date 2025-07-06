"use client"

import * as React from "react"
import {
  IconChartBar,
  IconInnerShadowTop,
  IconUsers,
  IconFileTypePdf,
  IconLogout,

} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data:session} = useSession();
  const data = {
  user: {
    name: session?.user?.name,
    email: session?.user?.email,
  },
  navMain: [
    {
      title: "Upload",
      url: "/",
      icon: IconFileTypePdf,
       isLogout:false,
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
       isLogout:false,
    },
      {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
       isLogout:false,
    },
      {
      title: "Logout",
      url: "",
      icon: IconLogout,
      isLogout:true,
    },
  ],
}
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Rag App.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
