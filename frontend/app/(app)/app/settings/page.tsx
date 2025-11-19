export default function Page() {
  return (
    <div className="flex flex-col w-full flex-1">
      <div className="flex flex-col border-b border-border px-8 py-5 flex-shrink-0 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      <div className="flex p-8 items-center justify-center text-center flex-1 bg-background">
        <span className="text-5xl font-medium opacity-10">Settings</span>
      </div>
    </div>
  )
}
