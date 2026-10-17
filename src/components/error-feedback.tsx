"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ErrorFeedback({ title, detail, onRetry }: { title: string; detail: string; onRetry?: () => void }) {
  useEffect(() => {
    toast.error(title, { id: title, description: detail, duration: 8000 });
  }, [title, detail]);

  return onRetry ? <button className="retry" onClick={onRetry}>{`Retry: ${title}`}</button> : null;
}
