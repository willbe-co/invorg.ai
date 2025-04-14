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
      vendor_query: parseAsString,
      vendor_id: parseAsString,
      start_date: parseAsTimestamp,
      end_date: parseAsTimestamp,
      state: parseAsStringEnum<InvoiceState>(Object.values(InvoiceState))
    },
    {
      shallow: true,
      throttleMs: 500,
      history: "replace",
      ...options
    }
  );

  return {
    ...params,
    setParams,

  };
}
