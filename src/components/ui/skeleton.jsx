import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[#ede7e7] animate-in rounded-2xl ", className)}
      {...props}
    />
  )
}

export { Skeleton }