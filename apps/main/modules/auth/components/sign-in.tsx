import { Card, CardHeader, CardTitle, CardContent, CardFooter, } from "@/components/ui/card"
import { SignInForm } from "./sign-in-form"
import Link from "next/link"

export const SignIn = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter>
        <div className="text-sm">
          Don't have an account? <Link href="/sign-up" className="underline">Click here</Link>
        </div>
      </CardFooter>
    </Card>
  )
}
