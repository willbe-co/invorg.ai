import { DashboardHello } from "@/components/dashboard-hello"
import { HydrateClient, trpc } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export default async function DashboardPage() {
  void trpc.hello.prefetch({ text: "ola rica" })
  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error...</p>}>
          <DashboardHello />
          <div>
            Dashboard
          </div>
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  )
}
