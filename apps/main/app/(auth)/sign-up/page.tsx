import { MainLogo } from "@/components/main-logo";
import { MainLogoBlack } from "@/components/main-logo-black";
import { SignUp } from "@/modules/auth/components/sign-up";

export default function SignUpPage() {
  return (
    <div className="max-w-xl p-4 mx-auto min-h-screen flex items-center">
      <div className="w-full flex flex-col space-y-6">
        <div className="max-w-52 mx-auto w-full">
          <MainLogo />
        </div>
        <SignUp />
      </div>
    </div>
  )
}
