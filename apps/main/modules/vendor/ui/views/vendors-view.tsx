import { VendorListSection } from "../section/vendor-list-section"

type Props = {
  month?: string
}

export const VendorsView = async ({ month }: Props) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-4">
          <h1 className="text-2xl font-bold">Vendors</h1>
          <p className="text-xs text-muted-foreground">Manage your vendors</p>
        </div>
      </div>
      <VendorListSection />
    </div>
  )
}
