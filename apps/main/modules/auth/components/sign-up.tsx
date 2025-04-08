import { Card, CardHeader, CardTitle, CardContent, CardFooter, } from "@/components/ui/card"
import { SignUpForm } from "./sign-up-form"
import Link from "next/link"

export const SignUp = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <div className="text-sm">
          Allready have and account? <Link href="/sign-in" className="underline">Click here</Link>
        </div>
      </CardFooter>
    </Card>)
}
