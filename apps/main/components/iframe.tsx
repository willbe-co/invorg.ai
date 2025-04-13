import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, FileIcon, Download } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

export function Iframe({
  src,
  width,
  height,
  onLoaded,
  setError,
  preview = false,
  delay = 0,
}: {
  src: string;
  width: number | string;
  height: number | string;
  preview: boolean;
  delay?: number;
  onLoaded: (loaded: boolean) => void;
  setError: (error: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to try different PDF viewing approaches
  const loadPdf = () => {
    if (!iframeRef.current || !src) return;

    // First attempt: Try with Google Docs Viewer as a fallback
    if (triedFallback) {
      iframeRef.current.src = `https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`;
    } else {
      // Initial attempt: Direct PDF with parameters
      iframeRef.current.src = `${src}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
    }
  };

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setTriedFallback(false);

    if (!src) {
      setError(true);
      setHasError(true);
      return;
    }

    // Notify parent component loading started
    onLoaded(false);

    // Set a small delay before loading to ensure DOM is ready
    const timer = setTimeout(() => {
      loadPdf();
    }, (delay || 0.5) * 1000);

    return () => clearTimeout(timer);
  }, [src, delay, onLoaded, setError]);

  // Handle load errors
  const handleError = () => {
    if (!triedFallback) {
      // Try fallback viewing method
      setTriedFallback(true);
      loadPdf();
    } else {
      // Both methods failed
      setIsLoading(false);
      setHasError(true);
      setError(true);
    }
  };

  // Handle successful loads
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoaded(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md border">
      {hasError ? (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-muted/20">
          <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <AlertDescription className="text-center mb-6">
            Unable to display the PDF document in the browser.
          </AlertDescription>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setTriedFallback(false);
                setHasError(false);
                setIsLoading(true);
                loadPdf();
              }}
            >
              Try Again
            </Button>
            <Button
              variant="default"
              onClick={() => window.open(src, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Open PDF
            </Button>
          </div>
        </div>
      ) : (
        <>
          <iframe
            ref={iframeRef}
            title="PDF Viewer"
            width="100%"
            height="100%"
            className={cn(
              "w-full h-full transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            style={{
              minHeight: typeof height === 'number' ? `${height}px` : height,
              border: "none",
            }}
            onLoad={handleLoad}
            onError={handleError}
            allow="fullscreen"
          />

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10">
              <Skeleton
                className="w-3/4 h-3/4 mx-auto"
                style={{
                  minHeight: typeof height === 'number' ? `${height / 2}px` : "50%",
                }}
              />
              <div className="mt-4 text-sm text-muted-foreground">Loading document...</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
