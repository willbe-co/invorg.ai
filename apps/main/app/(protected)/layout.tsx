
import { AppSidebarProvider } from "@/components/app-sidebar/app-sidebar-provider";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";


export const metadata: Metadata = {
  title: "Dashboard | invorg.ai",
  description: "Invoice organizer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session] = await Promise.all([
    auth.api.getSession({ headers: await headers() })
  ])
  return (
    <AppSidebarProvider session={JSON.parse(JSON.stringify(session))}>
      {children}
    </AppSidebarProvider>
  );
}
