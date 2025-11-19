'use client'

import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui'
import { Logo } from '@/components/website'

export const Header = () => {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const navigationItems = [
    { label: 'Features', href: '/#features', id: 'features' },
    { label: 'Support', href: '/#support', id: 'support' },
    { label: 'FAQ', href: '/#faq', id: 'faq' }
  ]

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky top-0 z-100 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto py-4 md:py-6 flex items-center justify-between px-4 md:px-0">
        <Link href="/" onClick={scrollToTop}>
          <Logo className="h-5 md:h-6.5 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} scroll={false} onClick={(e) => handleSmoothScroll(e, item.id)}>
                <Button variant="ghost" size="lg" className="px-4">
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-1 items-center">
          <Link href="/app">
            <Button size="lg" variant="ghost">
              Sign In
            </Button>
          </Link>
          <Link href="/app">
            <Button size="lg">
              <span>Try Now</span>
              <ArrowRight className="size-4" strokeWidth={1.4} />
            </Button>
          </Link>
        </div>

        {/* Mobile Drawer */}
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex flex-row items-center justify-between">
              <Link
                href="/"
                onClick={(e) => {
                  scrollToTop(e)
                  setOpen(false)
                }}
              >
                <Logo className="h-5 w-auto" />
              </Link>
              <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="size-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="flex flex-col p-4 gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll={false}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.id)
                    setOpen(false)
                  }}
                >
                  <Button variant="outline" size="lg" className="w-full justify-center">
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="mt-6 flex flex-col gap-2">
                <Link href="/app" onClick={() => setOpen(false)}>
                  <Button size="lg" variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/app" onClick={() => setOpen(false)}>
                  <Button size="lg" className="w-full">
                    <span>Try Now</span>
                    <ArrowRight className="size-4" strokeWidth={1.4} />
                  </Button>
                </Link>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </nav>
    </div>
  )
}
