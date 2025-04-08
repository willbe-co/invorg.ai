"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const AuthButton = () => {
  const { useSession, signOut } = authClient
  const router = useRouter()

  const { data: session, isPending, error } = useSession()

  // if (!session) {
  //   return (
  //     <Button disabled={isPending}>Login</Button>
  //   )
  // }
  return (
    <Button disabled={isPending} onClick={() => signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
          toast.success("Signed out", { description: "Disconnected successfully, see you soon." })
        }
      }
    })}>
      Logout
    </Button>
  )
}
