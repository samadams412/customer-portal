"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          duration={props.duration ?? 4000} // 👈 Force 4s duration if not passed
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}

      <ToastViewport
        className={`
          fixed z-50 pointer-events-none w-full max-w-sm px-4
          sm:bottom-4 sm:left-4
          top-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:top-auto
        `}
      />
    </ToastProvider>
  )
}
