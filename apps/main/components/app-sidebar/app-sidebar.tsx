"use client"
import * as React from "react"
import { GalleryVerticalEnd, HeartIcon, HeartOffIcon, HeartPulse } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import path from "node:path/win32"
import { IconLogo } from "../icon-logo"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          isActive: true,
        },
        {
          title: "Upload invoices",
          url: "/upload",
        },
        {
          title: "Vendors",
          url: "/vendor",
        },
        {
          title: "Reports",
          url: "/reports",
        },
      ],
    },
  ],
}

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname()
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch={true}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IconLogo />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-base leading-none">invorg.ai</span>
                  <span className="text-xs">Invoice organizer</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <div className="mb-1 font-medium text-xs">
                  {item.title}
                </div>
                {item.items?.length ? (
                  <SidebarMenuSub className="mx-0 border-l-0 px-1.5">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={pathname === item.url}>
                          <Link href={item.url} prefetch={true}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-muted-foreground text-[10px] flex items-center flex-wrap gap-1 justify-center py-1">
          <span>made with </span>
          <HeartIcon className="size-2.5 fill-muted-foreground" />
          <span>in <a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/R.+Dr.+Manuel+Pais,+4750-317+Barcelos/@41.5272888,-8.6074515,1421a,35y,301.76h,44.55t/data=!3m1!1e3!4m15!1m8!3m7!1s0xd2452334f891715:0xbbb13fdb637f476e!2sBarcelos!3b1!8m2!3d41.5335052!4d-8.6192892!16s%2Fg%2F11bc68v4gs!3m5!1s0xd245235b0f9e705:0xaa55d3acd71c5093!8m2!3d41.5348375!4d-8.6197181!16s%2Fg%2F11gfmfk_xn?entry=ttu&g_ep=EgoyMDI1MDQxNC4xIKXMDSoASAFQAw%3D%3D" className="underline">Barcelos</a>, Portugal</span>
          <span>for Vercel® Hackaton 2025</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
