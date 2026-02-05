"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "default" | "lg" | "xl"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
}

const LoadingSpinner = ({ size = "default", className }: LoadingSpinnerProps) => {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingPageProps {
  message?: string
}

const LoadingPage = ({ message = "Loading..." }: LoadingPageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

interface LoadingSectionProps {
  message?: string
  size?: SpinnerSize
}

const LoadingSection = ({
  message = "Loading...",
  size = "default",
}: LoadingSectionProps) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <LoadingSpinner size={size} className="mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  )
}

type LoadingCardProps = React.HTMLAttributes<HTMLDivElement>

const LoadingCard = ({ className, children }: LoadingCardProps) => {
  return (
    <div className={cn("border rounded-lg animate-pulse", className)}>
      <div className="p-6 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        {children}
      </div>
    </div>
  )
}

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

const LoadingButton = ({
  children,
  loading,
  ...props
}: LoadingButtonProps) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export {
  LoadingSpinner,
  LoadingPage,
  LoadingSection,
  LoadingCard,
  LoadingButton,
}
