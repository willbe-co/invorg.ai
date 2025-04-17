import GridBackground from "@/components/grid-background";
import { MainLogo } from "@/components/main-logo";
import { MainLogoBlack } from "@/components/main-logo-black";
import { SignIn } from "@/modules/auth/components/sign-in";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Sign-in | invorg.ai",
  description: "Invoice organization made simple",
};

export default function SignInPage() {
  return (
    <div>
      <GridBackground />
      <div className="max-w-md p-4 mx-auto min-h-screen flex items-center">
        <div className="w-full flex flex-col space-y-8">
          <div className="max-w-52 mx-auto w-full">
            <MainLogo />
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  )
}
