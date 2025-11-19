import { Home, Inbox, List, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { ReferralCreateNew } from '@/app/(app)/app/referrals/referral-create-new'
import { AppUser } from '@/components/app'
import { Button, Logo } from '@/components/ui'

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50">
      <nav className="pt-3 pb-6 flex items-center justify-between px-1">
        <div className="flex gap-3 items-center">
          <Link href="/app">
            <Logo className="h-5 md:h-6 w-auto" />
          </Link>
          <div className="flex gap-1 items-center">
            <Link href="/app">
              <Button variant="outline" className="h-10">
                <Home className="size-4" strokeWidth={1.8} />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/app/referrals">
              <Button variant="outline" className="h-10">
                <List className="size-4" strokeWidth={1.8} />
                <span>Referrals</span>
              </Button>
            </Link>
            <Link href="/app/patients">
              <Button variant="outline" className="h-10">
                <Users className="size-4" strokeWidth={1.8} />
                <span>Patients</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-1.5 items-center">
          <ReferralCreateNew />

          <div className="flex items-center gap-1">
            <Button variant="outline" className="h-10">
              <span className="sr-only">Inbox</span>
              <Inbox className="size-4" strokeWidth={1.8} />
            </Button>
            <Link href="/app/settings">
              <Button variant="outline" className="h-10">
                <span className="sr-only">Settings</span>
                <Settings className="size-4" strokeWidth={1.8} />
              </Button>
            </Link>
            <AppUser />
          </div>
        </div>
      </nav>
    </header>
  )
}

AppHeader.displayName = 'AppHeader'
