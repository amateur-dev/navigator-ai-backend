export default async function Page() {
  return (
    <div className="flex flex-col w-full flex-1">
      <div className="flex flex-col border-b border-border px-8 py-5 flex-shrink-0 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">Patients</h1>
            <p className="text-muted-foreground text-sm">Manage and track patient information</p>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      <div className="bg-background flex p-8 items-center justify-center text-center flex-1">
        <span className="text-5xl font-medium opacity-10">Patients List</span>
      </div>
    </div>
  )
}
