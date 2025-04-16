import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { is } from "drizzle-orm"
import { useEffect } from "react"
import { Button } from "./ui/button"

type Props = {
  isManual?: boolean,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}: Props) => {

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px"
  })

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, isManual, fetchNextPage])

  return (
    <div>
      <div ref={targetRef} className="h-1">
        {hasNextPage && (
          <Button
            variant="secondary"
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        )
          //   : (
          //   <div className="text-xs text-muted-foreground py-1">All invoices loaded</div>
          // )
        }

      </div>
    </div>
  )
}
