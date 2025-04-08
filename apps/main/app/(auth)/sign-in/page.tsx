import { SignIn } from "@/modules/auth/components/sign-in";

export default function SignInPage() {
  return (
    <div className="max-w-md p-4 mx-auto min-h-screen flex items-center">
      <div className="w-full">
        <SignIn />
      </div>
    </div>
  )
}
