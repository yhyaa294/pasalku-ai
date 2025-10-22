"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"

export function useToast() {
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState<string>("")
  const [title, setTitle] = React.useState<string>("")

  const show = (t: string, m?: string) => {
    setTitle(t)
    setMessage(m || "")
    setOpen(true)
  }

  const Toast = (
    <ToastPrimitives.Provider swipeDirection="right">
      <ToastPrimitives.Root open={open} onOpenChange={setOpen} className="fixed bottom-4 right-4 w-[320px] rounded-lg border bg-white shadow-lg p-4">
        {title && <ToastPrimitives.Title className="text-sm font-semibold text-gray-900">{title}</ToastPrimitives.Title>}
        {message && <ToastPrimitives.Description className="mt-1 text-sm text-gray-600">{message}</ToastPrimitives.Description>}
      </ToastPrimitives.Root>
      <ToastPrimitives.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]" />
    </ToastPrimitives.Provider>
  )

  return { show, Toast }
}
