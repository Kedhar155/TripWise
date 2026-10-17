"use client";

import { CircleCheck, CircleX, Info } from "lucide-react";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return <Sonner theme="light" position="bottom-right" richColors closeButton duration={5000}
    icons={{ success: <CircleCheck size={20} />, error: <CircleX size={20} />, info: <Info size={20} /> }}
    toastOptions={{ style: { fontFamily: "Arial, Helvetica, sans-serif", borderRadius: "1rem" } }} />;
}
