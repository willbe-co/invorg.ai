import { SignUp } from "@/modules/auth/components/sign-up";

export default function SignUpPage() {
  return (
    <div className="max-w-xl p-4 mx-auto min-h-screen flex items-center">
      <div className="w-full">
        <SignUp />
      </div>
    </div>
  )
}
