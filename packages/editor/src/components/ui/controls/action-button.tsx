'use client'

import { cn } from '../../../lib/utils'

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  label: string
}

export function ActionButton({ icon, label, className, ...props }: ActionButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        // The fill runs through custom properties so a caller's `bg-*` or
        // `hover:bg-*` replaces it in both themes; tailwind-merge would keep a
        // `dark:bg-*` fill alive under the caller's class.
        'flex min-h-7 min-w-0 flex-1 shrink-0 items-center justify-center gap-1.5 rounded-[7px] bg-(--action-fill) px-3 py-1 font-medium text-[12.5px] text-foreground leading-4 shadow-control transition-colors [&>svg]:shrink-0 [--action-fill-hover:var(--raised)] [--action-fill:var(--control)] hover:bg-(--action-fill-hover) active:bg-(--action-fill-hover) dark:[--action-fill-hover:var(--selected)]',
        className,
      )}
    >
      {icon}
      <span className="min-w-0 whitespace-normal text-center">{label}</span>
    </button>
  )
}

export function ActionGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('flex gap-1.5', className)}>{children}</div>
}
