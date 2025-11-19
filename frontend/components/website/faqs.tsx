import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import faqs from '@/data/website/faqs.json'

export const FAQs = () => {
  return (
    <div
      id="faq"
      className="flex flex-col container mx-auto py-12 md:py-20 gap-12 md:gap-20 px-4 md:px-0 scroll-mt-24"
    >
      <div className="grid grid-cols-1 gap-6 md:gap-10">
        <div className="flex flex-col gap-2 text-center justify-center items-center">
          <span className="text-sm md:text-base text-muted-foreground font-medium">
            Get Answers
          </span>
          <h2 className="text-2xl md:text-4xl leading-snug">Frequently Asked Questions</h2>
        </div>
      </div>

      <div className="grid border rounded-4xl corner-smooth supports-corner:rounded-4xl overflow-hidden bg-secondary mx-auto py-2 w-full max-w-7xl">
        <Accordion type="single" collapsible className="w-full" defaultValue={faqs[0].question}>
          {faqs.map((faq) => (
            <AccordionItem
              value={faq.question}
              key={faq.question}
              className="px-6 md:px-8 lg:px-16 py-1"
            >
              <AccordionTrigger className="text-left text-base md:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance text-muted-foreground text-sm md:text-base">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
