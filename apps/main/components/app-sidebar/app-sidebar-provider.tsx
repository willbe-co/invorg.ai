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
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 py-4 shrink-0 items-center gap-2 px-4 w-full justify-between">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
            {/* <Breadcrumb> */}
            {/*   <BreadcrumbList> */}
            {/*     <BreadcrumbItem className="hidden md:block"> */}
            {/*       <BreadcrumbLink href="#"> */}
            {/*         Building Your Application */}
            {/*       </BreadcrumbLink> */}
            {/*     </BreadcrumbItem> */}
            {/*     <BreadcrumbSeparator className="hidden md:block" /> */}
            {/*     <BreadcrumbItem> */}
            {/*       <BreadcrumbPage>Data Fetching</BreadcrumbPage> */}
            {/*     </BreadcrumbItem> */}
            {/*   </BreadcrumbList> */}
            {/* </Breadcrumb> */}
          </div>
          <div>
            <AuthButton />
          </div>
        </header>
        <div className="px-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
