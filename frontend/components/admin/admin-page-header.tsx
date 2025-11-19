interface AdminPageHeaderProps {
  title: string
  description: string
}

export const AdminPageHeader = ({ title, description }: AdminPageHeaderProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

AdminPageHeader.displayName = 'AdminPageHeader'
