import * as React from 'react'
import { FAQs } from '@/components/website/faqs'
import { Features } from '@/components/website/features'
import { Hero } from '@/components/website/hero'

export default async function Page() {
  return (
    <React.Fragment>
      <Hero />
      <Features />
      <FAQs />
    </React.Fragment>
  )
}
