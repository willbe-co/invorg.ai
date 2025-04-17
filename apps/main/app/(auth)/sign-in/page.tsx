import { MainLogo } from "@/components/main-logo";
import { MainLogoBlack } from "@/components/main-logo-black";
import { SignIn } from "@/modules/auth/components/sign-in";

export default function SignInPage() {
  return (
    <div className="max-w-md p-4 mx-auto min-h-screen flex items-center">
      <div className="w-full flex flex-col space-y-8">
        <div className="max-w-52 mx-auto w-full">
          <MainLogo />
        </div>
        <SignIn />
      </div>
    </div>
  )
}
