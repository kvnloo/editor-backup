'use client'

import { Check } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface ToggleControlProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  mixed?: boolean
}

export function ToggleControl({
  label,
  checked,
  onChange,
  className,
  mixed = false,
}: ToggleControlProps) {
  return (
    <div
      className={cn(
        'group flex h-7 w-full cursor-pointer items-center justify-between rounded-[7px] bg-control px-2.5 text-[13px] shadow-control transition-colors hover:bg-raised dark:hover:bg-selected',
        className,
      )}
      onClick={() => onChange(!checked)}
    >
      <div className="select-none text-muted-foreground transition-colors group-hover:text-foreground">
        {label}
      </div>

      <div
        className={cn(
          'flex size-4 items-center justify-center rounded-[4px] border transition-all duration-200',
          mixed
            ? 'border-muted-foreground/70 bg-black/5 dark:bg-black/20 text-muted-foreground'
            : checked
              ? 'border-violet-accent bg-violet-accent text-white'
              : 'border-border bg-black/5 dark:bg-black/20 text-transparent group-hover:border-muted-foreground',
        )}
      >
        {mixed ? (
          <div className="h-0.5 w-2.5 rounded-full bg-current" />
        ) : (
          <Check className="size-3" strokeWidth={3} />
        )}
      </div>
    </div>
  )
}
