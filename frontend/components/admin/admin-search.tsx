import { Command, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const AdminSearch = () => {
  return (
    <div className="flex items-center gap-2 relative w-full max-w-[200px]">
      <Button
        variant="outline"
        className="pl-7 w-full text-left items-center pr-1! bg-muted-background shadow-none"
        size="sm"
      >
        <Search className="shrink-0 size-3.5 text-muted-foreground" strokeWidth={1.5} />
        <span className="w-full font-medium text-xs pt-px text-muted-foreground leading-0">
          Search...
        </span>
        <div className="flex items-center gap-0.5 py-0.5 border rounded-xs px-1 border-border bg-background">
          <Command className="size-3 text-muted-foreground" strokeWidth={1.5} />
          <span className="font-mono text-xs font-medium">K</span>
        </div>
      </Button>
    </div>
  )
}

AdminSearch.displayName = 'AdminSearch'
