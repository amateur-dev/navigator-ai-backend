import Link from 'next/link'
import { Logo } from '@/components/website/logo'
import footer from '@/data/website/footer.json'

export const Footer = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] container mx-auto pt-12 md:pt-20 pb-16 md:pb-24 gap-12 md:gap-20 px-4 md:px-0">
      <div className="flex flex-col items-start gap-2">
        <Logo className="h-6 md:h-7 w-auto" />
        <span className="text-xs text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} Navigator AI. All rights reserved.
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-20 w-full">
        {footer.columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h3 className="text-sm md:text-base font-medium">{column.title}</h3>
            <ul className="flex flex-col gap-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
