import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Button } from "@/components/ui/button"
import { Session } from "@/lib/auth-types"
import { AuthButton } from "@/modules/auth/components/auth-button"

export const AppSidebarProvider = ({
  children,
  session
}: {
  children: React.ReactNode
  session: Session
}) => {
  // console.log(session)
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "17rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="@container">
        <header className="flex h-16 py-4 shrink-0 items-center gap-2 px-4 w-full justify-between @6xl:px-8">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Hello {session.user.name}!
            </div>
            <AuthButton />
          </div>
        </header>
        <div className="">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
