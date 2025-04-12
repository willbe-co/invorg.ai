// mport { InvoiceListSection } from "../section/invoice-list-section"

import { BaseInfoSection } from "../section/base-info-section"

type Props = {
  id?: string
}

export const InvoiceView = ({ id }: Props) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <p className="text-xs text-muted-foreground">id: {id}</p>
      </div>
      {id &&
        <BaseInfoSection id={id} />
      }
    </div>
  )
}
