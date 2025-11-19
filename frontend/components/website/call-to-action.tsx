import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

export const CallToAction = () => {
  return (
    <div className="flex flex-col container mx-auto scroll-mt-24" id="support">
      <div className="relative flex corner-smooth supports-corner:rounded-4xl rounded-4xl flex-col gap-12 md:gap-20 items-center py-16 md:py-28 overflow-hidden border bg-default text-default-foreground px-4 md:px-0">
        <div className="flex flex-col gap-8 md:gap-10 items-center justify-center">
          <div className="relative z-10 flex flex-col gap-4 md:gap-5 justify-center items-center w-full text-center max-w-3xl mx-auto break-words">
            <h1 className="text-3xl md:text-5xl lg:text-6xl leading-tight">
              Ready to transform your
              <br className="hidden sm:block" />
              Referral process?
            </h1>
            <p className="text-base md:text-lg text-white/50 text-balance leading-relaxed">
              Schedule a demo to see how Navigator AI can help your team streamline referrals and
              improve patient care.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto">
          <Button
            size="xl"
            variant="default"
            className="px-14! bg-default-foreground text-default hover:bg-default-foreground/80 w-full sm:w-auto"
          >
            <span>Schedule a Demo</span>
            <ArrowRight className="size-4" strokeWidth={1.4} />
          </Button>
        </div>
      </div>
    </div>
  )
}
