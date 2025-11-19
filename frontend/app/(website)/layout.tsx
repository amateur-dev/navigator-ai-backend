import { CallToAction } from '@/components/website/call-to-action'
import { Footer } from '@/components/website/footer'
import { Header } from '@/components/website/header'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background">
      <Header />
      {children}
      <CallToAction />
      <Footer />
    </main>
  )
}
