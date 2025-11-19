import features from '@/data/website/features.json'

export const Features = () => {
  return (
    <div
      className="flex flex-col container mx-auto pt-12 md:pt-20 gap-12 md:gap-20 px-4 md:px-0 scroll-mt-24"
      id="features"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base text-muted-foreground font-medium">Features</span>
          <h2 className="text-2xl md:text-4xl leading-snug break-all">
            Schedule Referral Patients <br className="hidden lg:block" />
            In Minutes, Not Days.
          </h2>
        </div>
        <p className="text-base md:text-lg text-muted-foreground">
          Navigator AI gives care coordinators an end-to-end control panel for moving every referral
          to a kept visit without firefighting. From in-network scheduling, real-time benefits
          checks, and prior auth automation to patient outreach, live case tracking, and smart
          worklists, each feature is built around the actual grind of daily coordination work.
          Connected into your EHR and payer systems with clear KPIs and compliance guardrails,
          Navigator AI doesn't just add another dashboard - it takes over the tedious steps so your
          team can focus on getting patients seen on time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border rounded-4xl corner-smooth supports-corner:rounded-4xl overflow-hidden bg-secondary">
        {features.map((feature) => (
          <div
            className="flex flex-col px-6 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16 gap-3 border-b md:border-r md:[&:nth-of-type(2n)]:border-r-0 lg:[&:nth-of-type(2n)]:border-r lg:[&:nth-of-type(3n)]:border-r-0 last:border-b-0 md:[&:nth-last-of-type(-n+2)]:border-b-0 lg:[&:nth-last-of-type(-n+3)]:border-b-0"
            key={feature.id}
          >
            <span
              dangerouslySetInnerHTML={{ __html: feature.icon }}
              className="[&_svg]:size-8 md:[&_svg]:size-10 [&_svg]:stroke-1"
            />
            <h3 className="text-base md:text-lg font-medium">{feature.title}</h3>
            <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
