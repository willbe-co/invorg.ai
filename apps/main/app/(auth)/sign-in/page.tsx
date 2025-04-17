import { MainLogoBlack } from "@/components/main-logo-black";
import { SignIn } from "@/modules/auth/components/sign-in";

export default function SignInPage() {
  return (
    <div className="max-w-md p-4 mx-auto min-h-screen flex items-center">
      <div className="w-full flex flex-col space-y-6">
        <div className="max-w-80 mx-auto w-full">
          <MainLogoBlack />
        </div>
        <SignIn />
      </div>
    </div>
  )
}
