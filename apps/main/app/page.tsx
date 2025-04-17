
import Spline from '@splinetool/react-spline/next';
import { MainLogo } from "@/components/main-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GridBackground from '@/components/grid-background';

export default function Home() {
  return (
    <div className="w-screen min-h-screen py-8 lg:py-14 flex flex-col space-y-32 lg:space-y-44">
      <GridBackground />
      <div className="flex flex-col space-y-6 max-w-[1330px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className='w-[200px] h-[55px]'>
            <Link href="/">
              <MainLogo />
            </Link>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="secondary">
              <Link href="/sign-in" prefetch={true}>
                Sign In
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up" prefetch={true}>
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid lg:grid-cols-12 h-[70vh] lg:h-[73vh] min-h-[600px] items-center">
          <div className="lg:col-span-6">
            <div className="font-grotesk font-medium text-xl lg:text-2xl text-[#949494] mb-5">AI powered invoice organizer assistant</div>
            <div className="font-grotesk font-medium text-5xl lg:text-[56px] text-[#ffffff] leading-[120%] mb-7">
              The Smartest Way
              to Manage Your Invoices
            </div>
            <div className="font-grotesk font-normal text-xl lg:text-2xl text-[#ffffff] mb-12">Forward email or Upload and let AI do the rest.</div>
            <Button variant="cta">Get started for free</Button>
          </div>
          {/* <div className="lg:col-span-6"> */}
          {/*   <Spline */}
          {/*     scene="https://prod.spline.design/pONb5aasFhFvLomB/scene.splinecode" */}
          {/*   /> */}
          {/* </div> */}
        </div>
        <div className='mb-20 lg:mb-24'  >
          <h2 className="text-2xl lg:text-3xl font-grotesk font-bold text-white lg:text-center mb-6">AI That Understands Invoices</h2>
          <p className='lg:text-center text-white max-w-[800px] text-base mx-auto'>
            Our advanced AI engine doesn’t just read documents — it understands them. It extracts and organizes key information instantly, giving you a clear and actionable view of your finances.
          </p>
        </div>
        <div className='mb-32 lg:mb-56'>
          <ul className='grid sm:grid-cols-2 xl:grid-cols-4 gap-5'>
            <li className="h-80 relative grad-1 rounded-[8px]"
            >
              <div className='flex flex-col justify-center items-start h-full px-4 bg-card'>
                <h3 className='font-grotesk text-2xl text-white mb-8'>Auto-Extract Key Data</h3>
                <p className='font-light text-[#d6d6d6]'>
                  Our AI captures the essential details — invoice number, total amount, due date, supplier name — all within seconds.
                </p>
              </div>


            </li>
            <li className='rounded-[8px] grad-2 h-80 relative'>
              <div className='flex flex-col justify-center items-start h-full px-4 bg-card'>
                <h3 className='font-grotesk text-2xl text-white mb-8'>
                  Understands Context
                </h3>
                <p className='font-light text-[#d6d6d6]'>
                  Whether it's a PDF from a big company or a scanned invoice from a freelancer, our AI adapts and reads it accurately.
                </p>
              </div>
            </li>
            <li className='rounded-[8px] grad-3 h-80 relative'>
              <div className='flex flex-col justify-center items-start h-full px-4 bg-card '>
                <h3 className='font-grotesk text-2xl text-white mb-8'>
                  Organizes Automatically
                </h3>
                <p className='font-light text-[#d6d6d6]'>
                  Invoices are categorized and sorted in your dashboard — no manual tagging or folders needed.
                </p>
              </div>
            </li>
            <li className='rounded-[8px] grad-4 h-80 relative'>
              <div className='flex flex-col justify-center items-start h-full px-4 bg-card'>
                <h3 className='font-grotesk text-2xl text-white mb-8'>
                  Access anytime
                </h3>
                <p className='font-light text-[#d6d6d6]'>
                  Log in to the invorg.ai to see your invoice history, track upcoming payments, filter by vendor, and much more.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <div className='grid lg:grid-cols-12 gap-4'>
            <div className='lg:col-span-3'>
              <h2 className='font-grotesk font-bold text-4xl lg:text-5xl text-white'>How it works</h2>
            </div>
            <div className='lg:col-span-1'></div>
            <div className='lg:col-span-8 bg-card relative  rounded-[8px] grad-3'>
              <div className='w-full h-full bg-card px-5 py-5 lg:py-12'>
                <ul className='w-full max-w-[430px] mx-auto bg-card flex flex-col space-y-10'>
                  <li className='flex gap-2 items-baseline'>
                    <div className='font-grotesk font-bold text-4xl lg:text-5xl text-[#898989] flex-none'>
                      1.
                    </div>
                    <div className='flex-1 flex flex-col gap-3'>
                      <div className='font-grotesk font-medium text-2xl text-white'>
                        Receive an invoice
                      </div>
                      <div className='font-light text-[#d6d6d6] leading-[22px]'>
                        Got a new invoice in your inbox or saved as a PDF? You're ready to go.
                      </div>
                    </div>
                  </li>
                  <li className='flex gap-2 items-baseline'>
                    <div className='font-grotesk font-bold text-4xl lg:text-5xl text-[#898989] flex-none'>
                      2.
                    </div>
                    <div className='flex-1 flex flex-col gap-3'>
                      <div className='font-grotesk font-medium text-2xl text-white'>
                        Send it to invorg
                      </div>
                      <div className='font-light text-[#d6d6d6] leading-[22px]'>
                        Forward the email to invoice@mail.invorg.app or upload the invoice directly.
                      </div>
                    </div>
                  </li>
                  <li className='flex gap-2 items-baseline'>
                    <div className='font-grotesk font-bold text-4xl lg:text-5xl text-[#898989] flex-none'>
                      3.
                    </div>
                    <div className='flex-1 flex flex-col gap-3'>
                      <div className='font-grotesk font-medium text-2xl text-white'>
                        Let AI take over
                      </div>
                      <div className='font-light text-[#d6d6d6] leading-[22px]'>
                        Invorg extracts the key information, organizes your invoices, and gives you instant insights.
                      </div>
                    </div>
                  </li>
                  <li className='flex gap-2 items-baseline'>
                    <div className='font-grotesk font-bold text-4xl lg:text-5xl text-[#898989] flex-none'>
                      4.
                    </div>
                    <div className='flex-1 flex flex-col gap-3'>
                      <div className='font-grotesk font-medium text-2xl text-white'>
                        Access everything online
                      </div>
                      <div className='font-light text-[#d6d6d6] leading-[22px]'>
                        Log in anytime to view, filter, and menage your invoices.
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className='border-t border-muted '>
        <div className='max-w-[1330px] mx-auto  px-4 lg:px-6 pt-16'>
          {/* <div className='flex items-center justify-between'> */}
          <div className='grid lg:grid-cols-12 w-full items-center gap-4'>
            <div className='max-w-[220px] lg:max-w-full lg:col-span-3'>
              <Link href="/">
                <MainLogo />
              </Link>
            </div>
            <div className='lg:col-span-1'></div>

            <div className='lg:col-span-8 bg-card rounded-[8px]  grad-3 relative'>
              <div className='flex flex-col lg:flex-row bg-card justify-start p-4 lg:p-10 lg:justify-between lg:items-end gap-6'>
                <div className='flex flex-col gap-3'>
                  <div className='font-grotesk font-medium text-2xl text-white'>
                    Get started in minutes
                  </div>
                  <div className='font-light text-base text-[#d6d6d6]'>
                    A simpler, faster way to manage your invoices powered by intelligent automation.
                  </div>
                </div>
                <div className=''>
                  <Button variant="cta" asChild><Link href="/sign-up">Get started now </Link></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
