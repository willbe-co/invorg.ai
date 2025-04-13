import {
  parseAsArrayOf,
  parseAsStringEnum,
  parseAsInteger,
  parseAsString,
  useQueryStates,
  parseAsTimestamp,
  createLoader,
} from "nuqs";

enum InvoiceState {
  processing = "processing",
  processed = "processed",
  duplicated = "duplicated"
}


export function useInvoiceFilterParams(options?: { shallow: boolean, throttleMs: number }) {
  const [params, setParams] = useQueryStates(
    {
      vendor: parseAsString,
      vendor_id: parseAsString,
      start_date: parseAsTimestamp,
      end_date: parseAsTimestamp,
      state: parseAsStringEnum<InvoiceState>(Object.values(InvoiceState))
    },
    {
      shallow: false,
      throttleMs: 500,
      ...options
    }
  );

  return {
    ...params,
    setParams,

  };
}
