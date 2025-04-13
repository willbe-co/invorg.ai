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

const paramsSchema = {
  // vendor: parseAsString.withDefault("").withOptions({ history: "push" }),
  vendor: parseAsString.withDefault(""),
  vendor_id: parseAsArrayOf(parseAsString),
  start_date: parseAsTimestamp,
  end_date: parseAsTimestamp,
  state: parseAsStringEnum<InvoiceState>(Object.values(InvoiceState))
}

export function useInvoiceFilterParams(options?: { shallow: boolean, throttleMs: number }) {
  const [params, setParams] = useQueryStates(
    paramsSchema,
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

export const loadInvoiceFilterParams = createLoader(paramsSchema)
