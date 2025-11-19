import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export const Hero = () => {
  return (
    <div className="flex flex-col container mx-auto">
      <div className="relative flex corner-smooth supports-corner:rounded-4xl rounded-4xl flex-col gap-12 md:gap-20 items-center pt-24 md:pt-36 pb-20 md:pb-36 overflow-hidden border text-default-foreground px-4 md:px-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover corner-smooth supports-corner:rounded-4xl rounded-4xl"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b backdrop-blur-sm from-transparent via-default/92 to-default" />

        <div className="flex flex-col gap-8 md:gap-10 items-center justify-center">
          <div className="items-center justify-center hidden lg:flex">
            <div className="relative z-10 flex bg-default-foreground/10 corner-smooth supports-corner:rounded-full rounded-full p-4 md:p-6 backdrop-blur-lg">
              <Play className="size-6 md:size-8 text-default-foreground" strokeWidth={1.4} />
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-4 md:gap-5 justify-center items-center w-full text-center max-w-5xl mx-auto break-words px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl leading-tight">
              Automate Patient Referrals <br className="hidden lg:block" />
              into Scheduled, In-Network Appointments.
            </h1>
            <p className="text-base md:text-lg text-white/50 text-balance leading-relaxed max-w-3xl">
              Navigator AI handles benefits checks, prior auth, and reminders so care coordinators
              can stop chasing paperwork and focus on patients.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-4 sm:px-0">
          <Button
            size="xl"
            variant="ghost"
            className="hover:bg-default-foreground/10 hover:text-default-foreground w-full sm:w-auto"
          >
            <Play className="size-5 md:size-6" strokeWidth={1.4} />
            <span>Watch Demo</span>
          </Button>
          <Link href="/app">
            <Button
              size="xl"
              variant="default"
              className="px-14! bg-default-foreground text-default hover:bg-default-foreground/80 w-full sm:w-auto"
            >
              <span>Try Now</span>
              <ArrowRight className="size-4" strokeWidth={1.4} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
